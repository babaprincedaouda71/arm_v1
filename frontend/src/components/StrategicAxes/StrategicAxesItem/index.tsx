import React from 'react';
import DeleteIcon from '@/components/Svgs/DeleteIcon';
import EditIcon from "@/components/Svgs/EditIcon";

interface StrategicAxesItemProps {
    title: string;
    id?: number | null;
    year?: string | number;
    onEdit?: (axeToEdit: { title: string; id: number | null; year: string | number }) => void;
    onDelete?: (axeToDelete: { title: string; id: number | null; year: string | number }) => void;
}

const StrategicAxesItem: React.FC<StrategicAxesItemProps> = ({title, id, year, onEdit, onDelete}) => {
    const handleEdit = () => {
        if (onEdit) {
            onEdit({title, id, year});
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete({title, id, year})
        }
    }

    return (
        <div className="flex items-center md:text-base justify-between py-2">
            <span className="text-blue-700">{title}</span>
            <div className="flex items-center space-x-2">
                <button onClick={handleEdit}>
                    <EditIcon/>
                </button>
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    <DeleteIcon/>
                </button>
            </div>
        </div>
    );
};

export default StrategicAxesItem;