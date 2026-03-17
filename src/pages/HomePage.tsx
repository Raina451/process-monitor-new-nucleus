import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePolling } from '@/hooks/usePolling';
import { ProcessInstances } from '@uipath/uipath-typescript/maestro-processes';
import { MaestroProcesses } from '@uipath/uipath-typescript/maestro-processes';
import type { ProcessInstanceGetResponse, MaestroProcessGetAllResponse } from '@uipath/uipath-typescript/maestro-processes';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProcessTable } from '@/components/ProcessTable';
import { FilterBar } from '@/components/FilterBar';
import { Activity } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const { sdk, isAuthenticated, isInitializing, login } = useAuth();
  const processInstances = useMemo(() => sdk ? new ProcessInstances(sdk) : null, [sdk]);
  const maestroProcesses = useMemo(() => sdk ? new MaestroProcesses(sdk) : null, [sdk]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [processes, setProcesses] = useState<MaestroProcessGetAllResponse[]>([]);
  // Load available processes/folders on mount
  useEffect(() => {
    if (!maestroProcesses || !isAuthenticated) return;
    maestroProcesses.getAll().then(setProcesses).catch(console.error);
  }, [maestroProcesses, isAuthenticated]);
  const fetchInstances = useCallback(async () => {
    if (!processInstances) return [];
    const options: any = { pageSize: 50 };
    if (selectedFolder) options.processKey = selectedFolder;
    const result = await processInstances.getAll(options);
    return 'items' in result ? result.items : [];
  }, [processInstances, selectedFolder]);
  const { data, isLoading, isActive, error } = usePolling<ProcessInstanceGetResponse[]>({
    fetchFn: fetchInstances,
    interval: 5000,
    enabled: isAuthenticated && !!processInstances,
    deps: [selectedFolder],
  });
  // Flicker prevention: accumulate instances, preserve last data
  const lastDataRef = useRef<ProcessInstanceGetResponse[] | null>(null);
  const lastFolderRef = useRef(selectedFolder);
  const accumulatedInstancesRef = useRef<Map<string, ProcessInstanceGetResponse>>(new Map());
  // Reset accumulation when folder changes
  if (selectedFolder !== lastFolderRef.current) {
    lastFolderRef.current = selectedFolder;
    lastDataRef.current = null;
    accumulatedInstancesRef.current = new Map();
  }
  if (data) lastDataRef.current = data;
  const displayData = lastDataRef.current;
  if (displayData) {
    for (const inst of displayData) {
      accumulatedInstancesRef.current.set(inst.instanceId, inst);
    }
  }
  // Stable sorted array
  const allInstances = [...accumulatedInstancesRef.current.values()].sort(
    (a, b) => new Date(b.startedTime).getTime() - new Date(a.startedTime).getTime()
  );
  // Apply status filter client-side
  const filteredInstances = statusFilter
    ? allInstances.filter(i => i.latestRunStatus === statusFilter)
    : allInstances;
  if (isInitializing) {
    return (
      <AppLayout container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Initializing...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  if (!isAuthenticated) {
    return (
      <AppLayout container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Process Monitor</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">Connect to your UiPath Orchestrator to monitor process instances</p>
          </div>
          <button
            onClick={login}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Connect to UiPath
          </button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout container>
      <ThemeToggle />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Process Instances</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and track process executions</p>
          </div>
          {isActive && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>
        {/* Filters */}
        <FilterBar
          processes={processes}
          selectedFolder={selectedFolder}
          onFolderChange={setSelectedFolder}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        {/* Error State */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            Error loading instances: {error.message}
          </div>
        )}
        {/* Table */}
        {!displayData && isLoading ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded flex-1 animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-24 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <ProcessTable instances={filteredInstances} />
        )}
      </div>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}