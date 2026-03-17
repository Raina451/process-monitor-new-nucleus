import type { ProcessInstanceGetResponse } from '@uipath/uipath-typescript/maestro-processes';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
interface ProcessTableProps {
  instances: ProcessInstanceGetResponse[];
}
export function ProcessTable({ instances }: ProcessTableProps) {
  if (instances.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center bg-white dark:bg-gray-800">
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No process instances found</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or wait for new instances to start</p>
      </div>
    );
  }
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instance Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Process</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Started</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Folder</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {instances.map((instance) => (
              <tr key={instance.instanceId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {instance.instanceDisplayName || instance.instanceId}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <StatusBadge status={instance.latestRunStatus} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {instance.packageKey}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {format(new Date(instance.startedTime), 'MMM d, yyyy h:mm a')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {instance.folderKey}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}