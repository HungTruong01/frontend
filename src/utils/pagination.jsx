import React from "react";

export const generatePagination = (
  currentPage,
  totalPages,
  maxPagesToShow = 3
) => {
  const pages = [];

  if (totalPages <= 0) return pages;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow = 3,
}) => {
  const pages = generatePagination(currentPage, totalPages, maxPagesToShow);

  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all"
        >
          Trước
        </button>
        <div className="flex items-center space-x-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="text-gray-600">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-md text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};
