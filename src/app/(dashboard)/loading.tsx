import { Skeleton } from '@/components/ui/skeleton'

/**
 * Route-group loading UI for every dashboard page. All dashboard routes are
 * force-dynamic, so without this Next.js shows a frozen screen during
 * navigation — the source of the "pages are blank / slow to load" reports.
 */
export default function DashboardLoading() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Stat row */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>

      {/* Content card */}
      <div className="space-y-3 rounded-lg border border-border bg-card p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-2/3" />
      </div>
    </div>
  )
}
