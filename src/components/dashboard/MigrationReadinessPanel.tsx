/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Image as ImageIcon,
  ListFilter,
  Loader2,
  Rocket,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useListDashboardListingsQuery,
  useValidateListingsMutation,
} from '../../Redux/features/migrations/migrationsApi';
import {
  savePendingMigration,
  useCreateCheckoutMutation,
} from '../../Redux/features/payments/paymentsApi';
import { calcMigrationCost, formatGBP } from '../../utils/pricing';
import MigrationsTab from './MigrationsTab';
import PaymentModal from './PaymentModal';

interface Account {
  accountId: number;
  sellerId: number;
  provider: string;
  name: string | null;
  status: string;
}

type Readiness =
  | 'READY'
  | 'READY_WITH_WARNINGS'
  | 'PUBLISHED'
  | 'NOT_READY'
  | '';

const READINESS_META: Record<
  Exclude<Readiness, ''>,
  { label: string; cls: string; Icon: any }
> = {
  READY: {
    label: 'Ready',
    cls: 'bg-[#ECFDF5] text-[#059669]',
    Icon: CheckCircle2,
  },
  READY_WITH_WARNINGS: {
    label: 'Ready (warnings)',
    cls: 'bg-[#FFF4E5] text-[#B58900]',
    Icon: AlertTriangle,
  },
  PUBLISHED: {
    label: 'Published',
    cls: 'bg-[#E8EDFF] text-[#2563EB]',
    Icon: CheckCircle2,
  },
  NOT_READY: {
    label: 'Not Ready',
    cls: 'bg-[#FDECEA] text-[#DC2626]',
    Icon: AlertCircle,
  },
};

const LISTINGS_PAGE_SIZE = 50;

const isSelectable = (status: Readiness) =>
  status === 'READY' || status === 'READY_WITH_WARNINGS';

const ReadinessBadge = ({ status }: { status: Readiness }) => {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[13px] font-medium text-[#64748B]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Validating…
      </span>
    );
  }
  const meta = READINESS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium ${meta.cls}`}
    >
      <meta.Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
};

const MigrationReadinessPanel = ({ accounts }: { accounts: Account[] }) => {
  const temuAccount = accounts.find(
    (a) => a.provider?.toUpperCase() === 'TEMU',
  );

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const highlightId = searchParams.get('highlight') ?? undefined;

  const tab: 'readiness' | 'migrations' =
    urlTab === 'migrations' ? 'migrations' : 'readiness';

  const switchTab = (key: 'readiness' | 'migrations') => {
    navigate(`/dashboard?tab=${key}`, { replace: true });
  };

  // Listings state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | Exclude<Readiness, ''>
  >('all');
  const [readinessMap, setReadinessMap] = useState<Record<string, Readiness>>(
    {},
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Fetch paginated listings from our integration backend
  const { data: listingsData, isFetching: listingsLoading } =
    useListDashboardListingsQuery({
      page,
      limit: LISTINGS_PAGE_SIZE,
      search: search || undefined,
    });

  const listings = listingsData?.data ?? [];
  const totalListings = listingsData?.meta.total ?? 0;
  const totalPages = listingsData?.meta.pageCount ?? 1;

  const [validateListings, { isLoading: validating }] =
    useValidateListingsMutation();
  const [createCheckout, { isLoading: creatingCheckout }] =
    useCreateCheckoutMutation();

  // Validate the current page whenever listings change
  useEffect(() => {
    if (!listings.length) return;
    validateListings({ sourceListingIds: listings.map((l) => l.id) })
      .unwrap()
      .then((res) => {
        const map: Record<string, Readiness> = {};
        res.items?.forEach((it) => {
          map[String(it.sourceListingId).trim()] = it.status as Readiness;
        });
        setReadinessMap(map);
      })
      .catch(() => {});
  }, [listings]);

  // Reset page + readiness when search changes
  useEffect(() => {
    setPage(1);
    setReadinessMap({});
    setSelectedIds([]);
  }, [search]);

  // Reset readiness map on page change so stale badges don't show
  useEffect(() => {
    setReadinessMap({});
  }, [page]);

  const displayedListings = listings.filter((l) => {
    if (statusFilter === 'all') return true;
    return (readinessMap[String(l.id)] ?? '') === statusFilter;
  });

  const selectableVisible = displayedListings.filter((l) =>
    isSelectable(readinessMap[String(l.id)] ?? ''),
  );
  const allSelected =
    selectableVisible.length > 0 &&
    selectableVisible.every((l) => selectedIds.includes(String(l.id)));

  const toggleOne = (id: number) => {
    const s = String(id);
    setSelectedIds((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const toggleAll = () => {
    const ids = selectableVisible.map((l) => String(l.id));
    if (allSelected) {
      const rm = new Set(ids);
      setSelectedIds((prev) => prev.filter((x) => !rm.has(x)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const handleConfirmMigration = async () => {
    if (!temuAccount) {
      toast.error('Connect a TEMU store before migrating.');
      return;
    }
    try {
      const result = await createCheckout({
        listingCount: selectedIds.length,
      }).unwrap();
      savePendingMigration({
        orderId: result.orderId,
        selectedIds,
        accountId: temuAccount.accountId,
        sellerId: temuAccount.sellerId,
      });
      window.location.href = result.checkoutUrl;
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to create checkout session.');
    }
  };

  const cost = calcMigrationCost(selectedIds.length);
  const marginalRate = cost.marginalRate;

  return (
    <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#EEF2F6] px-5 pt-4">
        {[
          {
            key: 'readiness',
            label: 'Listings Readiness',
            Icon: ClipboardList,
          },
          { key: 'migrations', label: 'Migrations', Icon: Rocket },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => switchTab(key as any)}
            className={`flex items-center gap-2 border-b-2 px-3 pb-3 text-[14px] font-semibold transition ${
              tab === key
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#64748B] hover:text-[#334155]'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'migrations' ? (
        <MigrationsTab
          active={tab === 'migrations'}
          highlightId={highlightId}
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-[14px] text-[#64748B]">
              {totalListings > 0
                ? `${totalListings.toLocaleString()} listing${totalListings !== 1 ? 's' : ''}`
                : 'Your eBay listings and their migration readiness.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSearch(searchInput);
                  }}
                  placeholder="Search title… (Enter)"
                  className="w-[220px] rounded-lg border border-[#E2E8F0] bg-white py-2 pl-9 pr-3 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                />
              </div>
              <div className="relative">
                <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="appearance-none rounded-lg border border-[#E2E8F0] bg-white py-2 pl-9 pr-8 text-[14px] font-medium text-[#334155] outline-none transition focus:border-[#1D4ED8]"
                >
                  <option value="all">All Status</option>
                  <option value="READY">Ready</option>
                  <option value="READY_WITH_WARNINGS">Ready (warnings)</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="NOT_READY">Not Ready</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-y border-[#EEF2F6] bg-[#F8FAFC] text-left text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="w-10 px-5 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      disabled={selectableVisible.length === 0}
                      className="h-4 w-4 cursor-pointer accent-[#1D4ED8]"
                    />
                  </th>
                  <th className="px-5 py-3">Listing Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">eBay Item ID</th>
                  <th className="px-5 py-3 text-right">Optimization</th>
                  <th className="px-5 py-3">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {listingsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
                    </td>
                  </tr>
                ) : displayedListings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-[14px] text-[#94A3B8]"
                    >
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  displayedListings.map((listing) => {
                    const status = readinessMap[String(listing.id)] ?? '';
                    const selectable = isSelectable(status);
                    return (
                      <tr
                        key={listing.id}
                        className="border-b border-[#F1F5F9] transition hover:bg-[#FAFBFD]"
                      >
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(String(listing.id))}
                            onChange={() => toggleOne(listing.id)}
                            disabled={!selectable}
                            className="h-4 w-4 cursor-pointer accent-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {listing.picture ? (
                              <img
                                src={listing.picture}
                                alt={listing.title ?? ''}
                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
                                <ImageIcon className="h-4 w-4 text-[#94A3B8]" />
                              </div>
                            )}
                            <span className="text-[14px] font-medium text-[#0F172A]">
                              {listing.title ?? '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#64748B]">
                          {listing.categoryTitle ?? '—'}
                        </td>
                        <td className="px-5 py-4 text-[14px] text-[#64748B]">
                          {listing.itemId ? (
                            <a
                              href={`https://ebay.com/itm/${listing.itemId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1D4ED8] hover:underline"
                            >
                              {listing.itemId ?? '—'}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-5 py-4 text-right text-[14px] text-[#64748B]">
                          {listing.optimizationPercent != null
                            ? `${listing.optimizationPercent}%`
                            : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <ReadinessBadge status={status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {validating && (
            <div className="flex items-center gap-2 px-5 py-3 text-[13px] text-[#64748B]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating readiness…
            </div>
          )}

          {/* Pagination */}
          {totalListings > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F6] px-5 py-4">
              <p className="text-[14px] text-[#64748B]">
                Showing {(page - 1) * LISTINGS_PAGE_SIZE + 1}–
                {Math.min(page * LISTINGS_PAGE_SIZE, totalListings)} of{' '}
                {totalListings.toLocaleString()} listings
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || listingsLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 text-[14px] text-[#64748B]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || listingsLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Selection action bar */}
          {selectedIds.length > 0 && (
            <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F6] bg-white px-5 py-4">
              <p className="text-[14px] text-[#334155]">
                <span className="font-semibold">{selectedIds.length}</span>{' '}
                listing{selectedIds.length > 1 ? 's' : ''} selected ·{' '}
                <span className="font-semibold text-[#1D4ED8]">
                  {formatGBP(cost.total)}
                </span>
                <span className="text-[#94A3B8]">
                  {' '}
                  ({formatGBP(marginalRate)}/listing)
                </span>
              </p>
              <button
                onClick={() => setPaymentOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1A45BE]"
              >
                <Rocket className="h-4 w-4" />
                Migrate selected
              </button>
            </div>
          )}
        </>
      )}

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        count={selectedIds.length}
        onConfirm={handleConfirmMigration}
        isSubmitting={creatingCheckout}
      />
    </div>
  );
};

export default MigrationReadinessPanel;
