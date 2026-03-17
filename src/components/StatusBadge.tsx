interface StatusBadgeProps {
  status: string;
}
const STATUS_STYLES: Record<string, string> = {
  Running: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Faulted: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  Cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Retrying: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};
export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}