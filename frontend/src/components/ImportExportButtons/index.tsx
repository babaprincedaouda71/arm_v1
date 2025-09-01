import React from "react";
import DownloadIcon from "@/components/Svgs/DownloadIcon";
import UploadIcon from "@/components/Svgs/UploadIcon";

interface ImportExportButtonsProps {
    onImport: () => void;
    onExport: () => void;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ onImport, onExport }) => {
    return (
        <div className="flex justify-end space-x-8 md:space-x-3 font-title">
            <div className="flex flex-col items-center cursor-pointer" onClick={onImport}>
                <DownloadIcon className="w-8 h-8" />
                <span className="text-bold">Importer</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={onExport}>
                <UploadIcon className="w-8 h-8" />
                <span className="text-bold">Exporter</span>
            </div>
        </div>
    );
};

export default ImportExportButtons;