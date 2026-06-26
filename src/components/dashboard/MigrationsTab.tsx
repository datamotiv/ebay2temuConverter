/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useListMigrationsQuery,
  useMigrationItemsQuery,
  useRetryMigrationMutation,
} from '../../Redux/features/migrations/migrationsApi';

const JOB_STATUS_CLS: Record<string, string> = {
  COMPLETED: 'bg-[#ECFDF5] text-[#059669]',
  PROCESSING: 'bg-[#EFF6FF] text-[#2563EB]',
  QUEUED: 'bg-[#FFF4E5] text-[#B58900]',
  FAILED: 'bg-[#FDECEA] text-[#DC2626]',
  PARTIAL_FAILED: 'bg-[#FFF4E5] text-[#B58900]',
};

const ITEM_STATUS: Record<string, { cls: string; Icon: any }> = {
  DONE: { cls: 'bg-[#ECFDF5] text-[#059669]', Icon: CheckCircle2 },
  FAILED: { cls: 'bg-[#FDECEA] text-[#DC2626]', Icon: XCircle },
  PROCESSING: { cls: 'bg-[#EFF6FF] text-[#2563EB]', Icon: Loader2 },
  PENDING_REVIEW: { cls: 'bg-[#FFF4E5] text-[#B58900]', Icon: Clock },
};

const isLive = (status: string) =>
  status === 'PROCESSING' || status === 'QUEUED';

const MigrationItems = ({
  migrationId,
  live,
  highlighted = false,
}: {
  migrationId: string;
  live: boolean;
  highlighted?: boolean;
}) => {
  const { data, isLoading, refetch } = useMigrationItemsQuery(
    { migrationId },
    { pollingInterval: live ? 3000 : 0 },
  );
  const items = data?.items ?? [];

  const prevLiveRef = useRef(live);
  useEffect(() => {
    if (prevLiveRef.current && !live) {
      refetch();
    }
    prevLiveRef.current = live;
  }, [live, refetch]);

  if (isLoading) {
    return (
      <div className="px-5 py-6 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#94A3B8]" />
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="px-5 py-6 text-center text-[13px] text-[#94A3B8]">
        No items in this job.
      </div>
    );
  }

  return (
    <div
      className={`divide-y border-t ${highlighted ? 'divide-[#C7D7F7] rounded-xl border-[#C7D7F7] bg-[#E8EFFE]' : 'divide-[#F1F5F9] border-[#F1F5F9] bg-[#FAFBFD]'}`}
    >
      {items.map((item: any) => {
        const meta = ITEM_STATUS[item.status] ?? {
          cls: 'bg-[#F1F5F9] text-[#64748B]',
          Icon: AlertCircle,
        };
        const errorMsg = item.errors?.[0]?.message;
        return (
          <div
            key={item.id ?? item.sourceListingId}
            className="flex items-center justify-between gap-4 px-5 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[#334155]">
                {item.sourceListingId}
              </p>
              {errorMsg && (
                <p className="truncate text-[12px] text-[#DC2626]">
                  {errorMsg}
                </p>
              )}
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium ${meta.cls}`}
            >
              <meta.Icon
                className={`h-3.5 w-3.5 ${
                  item.status === 'PROCESSING' ? 'animate-spin' : ''
                }`}
              />
              {item.status}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const MigrationsTab = ({
  active,
  highlightId,
}: {
  active: boolean;
  highlightId?: string;
}) => {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [highlightActive, setHighlightActive] = useState(false);
  const highlightFiredRef = useRef(false);
  const highlightRowRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, refetch } = useListMigrationsQuery(
    { page, limit: 10 },
    { skip: !active, pollingInterval: active ? 3000 : 0 },
  );
  const jobs = data?.items ?? [];
  const meta = data?.meta;

  // Bypass cache immediately when arriving with a highlight ID
  useEffect(() => {
    if (highlightId && active) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId]);

  // Fire highlight once the target job appears in the list
  useEffect(() => {
    if (!highlightId || highlightFiredRef.current) return;
    if (!jobs.some((j: any) => j.migrationId === highlightId)) return;
    highlightFiredRef.current = true;
    setExpanded(highlightId);
    setHighlightActive(true);
    setTimeout(
      () =>
        highlightRowRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        }),
      80,
    );
    const t = setTimeout(() => setHighlightActive(false), 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId, jobs]);

  const [retryMigration, { isLoading: retrying }] = useRetryMigrationMutation();

  const handleRetry = async (migrationId: string) => {
    try {
      await retryMigration({ migrationId }).unwrap();
      toast.success('Retry started');
    } catch (e: any) {
      toast.error(e?.data?.message || 'Retry failed');
    }
  };

  if (isLoading) {
    return (
      <div className="px-5 py-12 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="px-5 py-12 text-center text-[14px] text-[#94A3B8]">
        No migrations yet. Select ready listings and start one.
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="space-y-3">
        {jobs.map((job: any) => {
          const open = expanded === job.migrationId;
          const pct = Number(job.progressPercentage ?? 0);
          const summary = [
            `${job.publishedCount ?? 0} of ${job.total ?? 0} published`,
            job.failedCount ? `${job.failedCount} failed` : '',
            job.pendingCount ? `${job.pendingCount} pending` : '',
          ]
            .filter(Boolean)
            .join(' · ');

          const isHighlighted =
            highlightActive && job.migrationId === highlightId;
          return (
            <div
              key={job.migrationId}
              ref={isHighlighted ? highlightRowRef : undefined}
              className={`rounded-xl border transition-all duration-1000 ${
                isHighlighted
                  ? 'border-[#1D4ED8] bg-[#EFF4FF] shadow-[0_0_0_4px_rgba(29,78,216,0.12)]'
                  : 'border-[#E5E7EB] bg-white shadow-none'
              }`}
            >
              <div className="flex flex-wrap items-center gap-4 p-4">
                <button
                  onClick={() => setExpanded(open ? null : job.migrationId)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:bg-[#F8FAFC]"
                  aria-label={open ? 'Collapse' : 'Expand'}
                >
                  {open ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="truncate text-[14px] font-semibold text-[#0F172A]">
                      Migration #{String(job.migrationId).slice(0, 8)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-medium ${
                        JOB_STATUS_CLS[job.status] ??
                        'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {isLive(job.status) && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-[#64748B]">{summary}</p>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-[280px]">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF2F6]">
                    <div
                      className="h-full rounded-full bg-[#1D4ED8] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[13px] font-medium text-[#475569]">
                    {pct}%
                  </span>
                </div>

                {job.failedCount > 0 && (
                  <button
                    onClick={() => handleRetry(job.migrationId)}
                    disabled={retrying}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[13px] font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-60"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry failed
                  </button>
                )}
              </div>

              {open && (
                <MigrationItems
                  migrationId={job.migrationId}
                  live={isLive(job.status)}
                  highlighted={isHighlighted}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3">
          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-[#94A3B8]" />
          )}
          <button
            disabled={!meta.hasPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[13px] font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-[13px] text-[#64748B]">
            Page {meta.page} of {meta.pages}
          </span>
          <button
            disabled={!meta.hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-[13px] font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MigrationsTab;
