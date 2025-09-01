import React, {ReactNode} from "react";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export type SortOrder = "asc" | "desc";

export interface TableProps<T = Record<string, any>> {
    data: T[];
    keys: string[];
    headers: string[];
    sortableCols: string[];
    onSort: (col: string, order: SortOrder) => void;
    isPagination?: boolean;
    pagination?: PaginationProps;
    totalRecords?: number;
    loading?: boolean;
    onAdd?: () => void;
    visibleColumns: any;
    renderers?: {
        [key: string]: (value: any, row: any) => React.ReactNode;
    };
    expandable?: boolean;
    isExpandable?: boolean;
    onGroupAdd?: (need: any) => void;
    renderExpandedContent?: any;
    expandableColumn?: string
    onDuplicate?: (group: any) => void; // Ajout de la prop onDuplicate
    onGroupEdit?: (need: any, groupId: number) => void; // Ajout de la prop onDuplicate
}

export interface TableHeadProps {
    cols: string[];
    sortableCols: string[];
    sort: SortOrder;
    onSort: (col: string, order: SortOrder) => void;
    sortColumn: string; // Nouveau prop ajouté

}

export interface TableBodyProps {
    data: Record<string, any>[];
    keys: string[];
    renderers?: {
        [key: string]: (value: any, row: any) => React.ReactNode;
    };
    expandableColumn?: string;
    renderExpandedContent?: any;
    onGroupAdd?: (group: any) => void;
    onGroupEdit?: (need: any, groupId: number) => void;
    expandable?: boolean,
    onDuplicate?: (group: any) => void; // Ajout de la prop onDuplicate
}

export interface ActionConfig {
    icon: ReactNode;
    onClick: (row: any) => void;
    label: string;
}

// components/Tables/TableActions.tsx
export interface TableActionsProps {
    actions: ActionConfig[];
    row: any;
}

// types/Table.types.ts
export interface StatusConfig {
    label: string;
    color: string;
    backgroundColor: string;
    showDot?: boolean;
    icon?: React.ReactNode;
    pill?: {
        show: true,
        value: -12
    }
}

export interface GroupeConfig {
    label: string;
    color: string;
    backgroundColor: string;
    showDot?: boolean;
    icon?: React.ReactNode;
    pill?: {
        show: true,
        value: -12
    }
}

export interface PermissionConfig {
    label: string;
    color: string;
    backgroundColor: string;
    showIcon?: boolean;
    icon?: ReactNode;
}

export interface PermissionConfigProps {
    value: string;
    permissionConfig: Record<string, PermissionConfig>
}

export interface ColumnConfig {
    key: string;
    formatter?: (value: any) => string | React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

// components/Tables/Renderers/StatusRenderer.tsx
export interface GroupeRendererProps {
    value: string;
    groupeConfig: Record<string, StatusConfig>;
}

export interface ManagerRendererProps {
    value: string;
}