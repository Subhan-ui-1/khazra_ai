import React from 'react';
import { Plus, Edit3, Trash2, Eye, Download, Filter, Search } from 'lucide-react';

interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'badge' | 'action';
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableAction {
  label?: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
}

interface TableProps {
  title?: string;
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  showSearch?: boolean;
  showFilter?: boolean;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  rowKey?: string;
  selectable?: boolean;
  onRowSelect?: (selectedRows: any[]) => void;
  selectedRows?: any[];
}

const Table: React.FC<TableProps> = ({
  title,
  columns,
  data,
  actions = [],
  showSearch = false,
  showFilter = false,
  showAddButton = false,
  addButtonLabel = 'Add New',
  onAddClick,
  onSearch,
  onFilter,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  className = '',
  rowKey = 'id',
  selectable = false,
  onRowSelect,
  selectedRows = []
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>(selectedRows.map(row => row[rowKey]));

  React.useEffect(() => {
    setSelectedRowIds(selectedRows.map(row => row[rowKey]));
  }, [rowKey]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleRowSelect = (row: any, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedRowIds, row[rowKey]]
      : selectedRowIds.filter(id => id !== row[rowKey]);
    
    setSelectedRowIds(newSelectedIds);
    
    const newSelectedRows = data.filter(item => newSelectedIds.includes(item[rowKey]));
    onRowSelect?.(newSelectedRows);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedIds = checked ? data.map(row => row[rowKey]) : [];
    setSelectedRowIds(newSelectedIds);
    onRowSelect?.(checked ? data : []);
  };

  const renderCell = (column: TableColumn, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'status':
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            value === 'active' ? 'bg-green-100 text-green-700' :
            value === 'inactive' ? 'bg-red-100 text-red-700' :
            value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {value}
          </span>
        );
      
      case 'badge':
        return (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
            {value}
          </span>
        );
      
      case 'date':
        return (
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString()}
          </span>
        );
      
      case 'number':
        return (
          <span className="font-medium text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        );
      
      default:
        return (
          <span className="text-sm text-gray-900">
            {value}
          </span>
        );
    }
  };

  const getActionVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600 hover:text-blue-800';
      case 'secondary':
        return 'text-gray-600 hover:text-gray-800';
      case 'danger':
        return 'text-red-600 hover:text-red-800';
      case 'success':
        return 'text-green-600 hover:text-green-800';
      default:
        return 'text-gray-600 hover:text-gray-800';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      {(title || showSearch || showFilter || showAddButton) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {showFilter && (
                <button
                  onClick={onFilter}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              )}
              
              {showAddButton && (
                <button
                  onClick={onAddClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#0D5942] text-white rounded-md  text-sm"
                >
                  <Plus className="w-4 h-4" color='white'/>
                  <span>{addButtonLabel}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.width ? `w-${column.width}` : ''
                  } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {column.label}
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    {emptyIcon || (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <div className="w-6 h-6 bg-gray-400 rounded"></div>
                      </div>
                    )}
                    <p className="text-lg font-medium text-gray-900 mb-2">No data found</p>
                    <p className="text-gray-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(row[rowKey])}
                        onChange={(e) => handleRowSelect(row, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {renderCell(column, row[column.key], row)}
                    </td>
                  ))}
                  
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled}
                            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              action.disabled
                                ? 'text-gray-400 cursor-not-allowed'
                                : getActionVariantClasses(action.variant || 'secondary')
                            }`}
                            title={action.label}
                          >
                            {action.icon}
                            <span>{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table; 