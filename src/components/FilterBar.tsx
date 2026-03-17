import type { MaestroProcessGetAllResponse } from '@uipath/uipath-typescript/maestro-processes';
import { X } from 'lucide-react';
interface FilterBarProps {
  processes: MaestroProcessGetAllResponse[];
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
}
const STATUS_OPTIONS = [
  { value: 'Running', label: 'Running', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { value: 'Faulted', label: 'Faulted', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
];
export function FilterBar({
  processes,
  selectedFolder,
  onFolderChange,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Folder Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Process</label>
        <select
          value={selectedFolder || ''}
          onChange={(e) => onFolderChange(e.target.value || null)}
          className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Processes</option>
          {processes.map((proc) => (
            <option key={proc.processKey} value={proc.processKey}>
              {proc.name}
            </option>
          ))}
        </select>
      </div>
      {/* Status Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilterChange(statusFilter === option.value ? null : option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                statusFilter === option.value
                  ? option.color + ' ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
              {statusFilter === option.value && (
                <X className="inline-block w-3 h-3 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}