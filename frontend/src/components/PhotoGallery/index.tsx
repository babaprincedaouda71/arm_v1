import React, { useState } from 'react';
import { Edit2, Trash2, Eye, LayoutGrid, LayoutList, X } from 'lucide-react';
import FileInputField from '../FormComponents/FileInputField';

interface Photo {
    id: string;
    url: string;
    title: string;
}

const PhotoGallery = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
    const [isGridLayout, setIsGridLayout] = useState(true);
    const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (files: File[]) => {
        if (files.length > 0) {
            setIsUploading(true);

            const newPhotos: Photo[] = await Promise.all(
                files.map(async (file) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    url: URL.createObjectURL(file),
                    title: file.name,
                }))
            );

            setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
            setIsUploading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedPhotos.size === photos.length) {
            setSelectedPhotos(new Set());
        } else {
            setSelectedPhotos(new Set(photos.map(photo => photo.id)));
        }
    };

    const togglePhotoSelection = (photoId: string) => {
        const newSelected = new Set(selectedPhotos);
        if (newSelected.has(photoId)) {
            newSelected.delete(photoId);
        } else {
            newSelected.add(photoId);
        }
        setSelectedPhotos(newSelected);
    };

    const deletePhoto = (photoId: string) => {
        setPhotos(photos.filter(photo => photo.id !== photoId));
        setSelectedPhotos(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(photoId);
            return newSelected;
        });
    };

    const deleteSelectedPhotos = () => {
        const selectedIds = Array.from(selectedPhotos);
        setPhotos(photos.filter(photo => !selectedIds.includes(photo.id)));
        setSelectedPhotos(new Set());
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            {/* Section Upload */}
            <section className='grid gap-4 grid-cols-1 md:grid-cols-3'>
                <FileInputField
                    label="Téléverser les fichiers"
                    name="photos"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mb-4 col-span-2"
                    labelClassName="font-extrabold"
                    inputClassName="rounded-xl"
                />
                <div className=''></div>
                {isUploading && (
                    <div className="mt-2 text-sm text-gray-600">
                        Chargement des images En Cours...
                    </div>
                )}
            </section>

            {/* Section Galerie */}
            <section className="space-y-4 shadow-2xl rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedPhotos.size === photos.length && photos.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span>Tout sélectionner</span>
                        </label>
                        {selectedPhotos.size > 0 && (
                            <button
                                onClick={deleteSelectedPhotos}
                                className="text-redShade-600 hover:text-redShade-700 text-sm flex items-center space-x-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer la sélection</span>
                            </button>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsGridLayout(true)}
                            className={`p-2 rounded transition-all duration-200 hover:scale-105 active:scale-95 
                ${isGridLayout ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsGridLayout(false)}
                            className={`p-2 rounded transition-all duration-200 hover:scale-105 active:scale-95
                ${!isGridLayout ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Reste du code inchangé... */}
                {/* Grille de photos */}
                <div
                    className={`grid transition-all duration-300 ease-in-out
            ${isGridLayout
                            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'
                            : 'grid-cols-1 gap-3'}`}
                >
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className={`relative group transition-transform duration-200 ease-in-out hover:scale-[1.02]
                ${!isGridLayout ? 'flex items-center space-x-4' : ''}`}
                        >
                            <div className={`relative ${isGridLayout ? 'aspect-square' : 'h-32 w-32'}`}>
                                <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />

                                <div className="absolute top-2 left-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        className="p-1 bg-white rounded-full hover:bg-gray-100 transition-transform duration-200 hover:scale-110 active:scale-90"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => deletePhoto(photo.id)}
                                        className="p-1 bg-white rounded-full hover:bg-gray-100 transition-transform duration-200 hover:scale-110 active:scale-90"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <input
                                        type="checkbox"
                                        checked={selectedPhotos.has(photo.id)}
                                        onChange={() => togglePhotoSelection(photo.id)}
                                        className="w-3 h-3 rounded border-gray-300"
                                    />
                                </div>

                                <button
                                    onClick={() => setViewingPhoto(photo)}
                                    className="absolute bottom-2 left-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100
                    transition-all duration-200 hover:scale-110 active:scale-90 hover:bg-gray-100"
                                >
                                    <Eye className="w-3 h-3" />
                                </button>
                            </div>

                            <p className={`text-sm text-gray-600 truncate ${isGridLayout ? 'mt-2' : 'flex-1'}`}>
                                {photo.title}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Vue agrandie de la photo */}
            {viewingPhoto && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4
            animate-[fadeIn_200ms_ease-in-out]"
                    onClick={() => setViewingPhoto(null)}
                >
                    <div
                        className="relative max-w-3xl w-full animate-[scaleIn_200ms_ease-in-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={viewingPhoto.url}
                            alt={viewingPhoto.title}
                            className="w-full h-auto rounded-lg max-h-[80vh] object-contain"
                        />
                        <button
                            onClick={() => setViewingPhoto(null)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full
                transition-transform duration-200 hover:scale-110 active:scale-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;