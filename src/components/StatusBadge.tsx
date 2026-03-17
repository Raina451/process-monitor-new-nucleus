interface StatusBadgeProps {
  status: string;
}
const STATUS_STYLES: Record<string, string> = {
  Running: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Faulted: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Paused: 'bg-yellow-100 text-yellow-700',
  Retrying: 'bg-orange-100 text-orange-700',
};
export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}