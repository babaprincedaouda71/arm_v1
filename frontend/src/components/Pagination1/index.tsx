import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const MAX_VISIBLE_PAGES = 3; // Nombre maximal de pages visibles à la fois

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // Toujours afficher la première page
    pages.push(1);

    // Afficher les pages autour de la page actuelle
    const startPage = Math.max(
      2,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    const endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(MAX_VISIBLE_PAGES / 2)
    );

    if (startPage > 2) pages.push("..."); // Ajouter des points si les pages initiales sont masquées

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push("..."); // Ajouter des points si les pages finales sont masquées

    // Toujours afficher la dernière page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () =>
    getPageNumbers().map((page, index) => (
      <button
        key={index}
        className={`mx-1 px-3 py-1 rounded ${page === currentPage
          ? "bg-primary text-white"
          : typeof page === "number"
            ? "bg-gray-200 text-gray-700"
            : "bg-transparent text-gray-500 cursor-default"
          }`}
        disabled={typeof page !== "number"}
        onClick={() => handlePageClick(page)}
      >
        {page}
      </button>
    ));

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-primary text-white"
          }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Précédent
      </button>
      <div className="flex">{renderPageNumbers()}</div>
      <button
        className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-primary text-white"
          }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;