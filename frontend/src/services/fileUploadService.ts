// services/fileUploadService.ts
import { toast } from 'react-toastify';

export interface FileUploadResult {
    success: boolean;
    fileName?: string;
    objectName?: string;
    fileId?: number;
    error?: string;
}

export interface FileMetadata {
    originalName: string;
    size: number;
    type: string;
    lastModified: number;
}

export interface FileUploadProgress {
    fileId: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
}

class FileUploadService {
    private readonly baseUrl: string;
    private readonly maxFileSize: number = 50 * 1024 * 1024; // 50MB
    private readonly allowedTypes: string[] = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4', 'video/avi', 'video/mov'
    ];

    constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Valide un fichier avant l'upload
     */
    private validateFile(file: File): { isValid: boolean; error?: string } {
        if (file.size > this.maxFileSize) {
            return {
                isValid: false,
                error: `Le fichier ${file.name} dépasse la taille maximale autorisée (50MB)`
            };
        }

        if (!this.allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: `Le type de fichier ${file.type} n'est pas autorisé`
            };
        }

        return { isValid: true };
    }

    /**
     * Upload un seul fichier avec progress tracking
     */
    async uploadFile(
        file: File,
        groupId: number,
        category: 'document' | 'media' | 'certificate',
        subCategory?: string,
        onProgress?: (progress: number) => void
    ): Promise<FileUploadResult> {
        try {
            // Validation du fichier
            const validation = this.validateFile(file);
            if (!validation.isValid) {
                return { success: false, error: validation.error };
            }

            // Création du FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('groupId', groupId.toString());
            formData.append('category', category);
            if (subCategory) {
                formData.append('subCategory', subCategory);
            }

            // Métadonnées du fichier
            const metadata: FileMetadata = {
                originalName: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };
            formData.append('metadata', JSON.stringify(metadata));

            // Configuration de la requête avec progress tracking
            const response = await fetch(`${this.baseUrl}/api/training/files/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                // On ne définit pas Content-Type pour laisser le navigateur gérer le boundary
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();

            return {
                success: true,
                fileName: result.fileName,
                objectName: result.objectName,
                fileId: result.fileId
            };

        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Upload multiple files avec gestion de la concurrence
     */
    async uploadMultipleFiles(
        files: File[],
        groupId: number,
        category: 'document' | 'media' | 'certificate',
        subCategory?: string,
        onProgress?: (fileId: string, progress: FileUploadProgress) => void
    ): Promise<FileUploadResult[]> {
        const maxConcurrentUploads = 3; // Limite la concurrence pour éviter la surcharge
        const results: FileUploadResult[] = [];

        // Divise les fichiers en chunks pour traitement par batch
        const chunks = this.chunkArray(files, maxConcurrentUploads);

        for (const chunk of chunks) {
            const chunkPromises = chunk.map(async (file, index) => {
                const fileId = `${Date.now()}-${index}`;

                try {
                    if (onProgress) {
                        onProgress(fileId, {
                            fileId,
                            progress: 0,
                            status: 'uploading'
                        });
                    }

                    const result = await this.uploadFile(file, groupId, category, subCategory);

                    if (onProgress) {
                        onProgress(fileId, {
                            fileId,
                            progress: 100,
                            status: result.success ? 'completed' : 'error',
                            error: result.error
                        });
                    }

                    return result;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

                    if (onProgress) {
                        onProgress(fileId, {
                            fileId,
                            progress: 0,
                            status: 'error',
                            error: errorMessage
                        });
                    }

                    return { success: false, error: errorMessage };
                }
            });

            const chunkResults = await Promise.all(chunkPromises);
            results.push(...chunkResults);
        }

        return results;
    }

    /**
     * Supprime un fichier
     */
    async deleteFile(fileId: number): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/training/files/${fileId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Récupère la liste des fichiers d'un groupe
     */
    async getGroupFiles(
        groupId: number,
        category?: string,
        page: number = 0,
        size: number = 20
    ): Promise<{
        success: boolean;
        data?: any[];
        totalElements?: number;
        totalPages?: number;
        error?: string;
    }> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (category) {
                params.append('category', category);
            }

            const response = await fetch(
                `${this.baseUrl}/api/training/groups/${groupId}/files?${params.toString()}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                data: result.content || result.data,
                totalElements: result.totalElements,
                totalPages: result.totalPages
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Télécharge un fichier
     */
    async downloadFile(fileId: number, fileName: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/training/files/${fileId}/download`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Erreur lors du téléchargement: ${response.status}`);
            }

            // Crée et déclenche le téléchargement
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            toast.error('Erreur lors du téléchargement du fichier');
        }
    }

    /**
     * Divise un array en chunks
     */
    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}

// Instance singleton
export const fileUploadService = new FileUploadService();