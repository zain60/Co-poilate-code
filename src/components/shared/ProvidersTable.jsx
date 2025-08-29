import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { Pagination } from '../../components/common/Pagination';

const ProvidersTable = ({
  providers = [],
  showCheckbox = false,
  selectedRows = new Set(),
  onRowSelect = () => { },
  onSelectAll = () => { },
  pagination = false,
}) => {
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(providers.length / perPage));
  }, [providers]);

  const paginatedProviders = providers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Calculate if all/some items are selected for checkboxes
  const allSelected = providers.length > 0 && providers.every(provider => selectedRows.has(provider.id));
  const someSelected = providers.some(provider => selectedRows.has(provider.id)) && !allSelected;

  return (
    <div className="border border-gray-200 rounded-lg overflow-x-auto">
      <div className="min-w-[800px] md:min-w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {showCheckbox && (
                <th scope="col" className="table-header-cell" colSpan={showCheckbox ? 2 : 1}>
                  <div className="flex items-center">
                    <Checkbox
                      className="m-0 p-0 mr-2"
                      onChange={onSelectAll}
                      checked={allSelected}
                      indeterminate={someSelected}
                    />
                    <span className="whitespace-nowrap">Provider Name</span>
                  </div>
                </th>
              )}
              {!showCheckbox && (
                <th scope="col" className="table-header-cell">
                  Provider Name
                </th>
              )}
              <th scope="col" className="table-header-cell whitespace-nowrap">
                Speciality
              </th>
              <th scope="col" className="table-header-cell whitespace-nowrap">
                Address
              </th>
              <th scope="col" className="table-header-cell whitespace-nowrap">
                Contact #
              </th>
              <th scope="col" className="table-header-cell whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="table-header-cell whitespace-nowrap">
                <div className="flex flex-col items-center justify-center">
                  <span>Available on</span>
                  <span>InjurySync</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProviders.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell" colSpan={showCheckbox ? 2 : 1}>
                  <div className="flex items-center">
                    {showCheckbox && (
                      <Checkbox
                        className="m-0 p-0 mr-2"
                        checked={selectedRows.has(item.id)}
                        onChange={(e) => onRowSelect(e, item.id)}
                      />
                    )}
                    <div className="table-cell-primary">{item.name}</div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="table-cell-secondary">{item.speciality || '-'}</div>
                </td>
                <td className="table-cell">
                  <div className="table-cell-secondary">{item.address || '-'}</div>
                </td>
                <td className="table-cell">
                  <div className="table-cell-secondary">{item.contact || '-'}</div>
                </td>
                <td className="table-cell">
                  <div className="table-cell-secondary truncate max-w-[180px]">{item.email || '-'}</div>
                </td>
                <td className="table-cell text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.availability === 'Pending' ? 'bg-[#FFFAEB] text-[#F59E42]' :
                    'bg-green-100 text-green-800'
                    }`}>
                    {item.availability || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div style={{ padding: "3px 20px", marginBottom: "13px" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={providers?.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <style jsx global>{`
        .table-header-cell {
          padding: 0.75rem 1rem 0.75rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6B7280;
          letter-spacing: 0.05em;
          vertical-align: middle;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .table-header-cell {
            padding: 0.5rem 0.75rem;
            font-size: 0.7rem;
          }
        }

        .table-header-cell .flex {
          display: flex;
          align-items: center;
        }

        .table-row {
          transition: background-color 0.15s ease-in-out;
        }

        .table-row:hover {
          background-color: #F9FAFB;
        }

        .table-cell {
          padding: 0.75rem 1rem 0.75rem 1.5rem;
          white-space: nowrap;
          border-bottom: 1px solid #E5E7EB;
          vertical-align: middle;
        }

        @media (max-width: 767px) {
          .table-cell {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
        }

        .table-cell:first-child {
          padding-left: 1.5rem;
        }

        .table-cell-primary {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .table-cell-secondary {
          font-size: 0.875rem;
          color: #6B7280;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 9999px;
          background-color: #ECFDF5;
          color: #065F46;
        }
      `}</style>
    </div>
  );
};

export default ProvidersTable;
