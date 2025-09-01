import { TableActionsProps } from "../../../types/Table.types";

const TableActions: React.FC<TableActionsProps> = ({ actions, row }) => {
    return (
        <div className="flex justify-center items-center">
            <div className="flex">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => action.onClick(row)}
                        title={action.label}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {action.icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TableActions