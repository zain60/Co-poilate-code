import React from 'react';

const styles = {
  container: 'flex justify-between items-center mt-4 text-sm text-gray-500',
  info: 'text-sm text-gray-500',
  buttonGroup: 'flex items-center space-x-2',
  pageButton: 'w-10 h-10 flex items-center justify-center rounded-lg',
  activePageButton: 'bg-blue-600 text-white font-medium',
  inactivePageButton: 'text-gray-500 hover:bg-gray-50',
  navButton: 'w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300',
  disabledNavButton: 'opacity-50 cursor-not-allowed',
  enabledNavButton: 'hover:bg-gray-50',
  navIcon: 'h-5 w-5 text-gray-400',
  ellipsis: 'text-gray-500'
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  perPage = 10,
  totalItems,
  onPageChange,
}) => {
  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(startIndex + perPage - 1, totalItems);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <div>Showing {startIndex} to {endIndex} of {totalItems} {totalItems === 1 ? 'entry' : 'entries'}</div>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`${styles.navButton} ${currentPage === 1 ? styles.disabledNavButton : styles.enabledNavButton}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        {renderPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`${styles.pageButton} ${currentPage === page ? styles.activePageButton : styles.inactivePageButton}`}
            >
              {page}
            </button>
          )
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`${styles.navButton} ${currentPage === totalPages ? styles.disabledNavButton : styles.enabledNavButton}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
