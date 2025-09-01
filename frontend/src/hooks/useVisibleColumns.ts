import { useState } from "react";

export const useVisibleColumns = (initialColumns: string[]) => {
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  return { visibleColumns, toggleColumnVisibility };
};
