/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  ListFilter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSm,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Store,
  ClipboardList,
  Rocket,
} from "lucide-react";
import {
  useSummaryFitmentDetailsMutation,
  useSummaryFitmentQuery,
} from "../../Redux/features/summary/summaryApi";
import {
  useValidateListingsMutation,
} from "../../Redux/features/migrations/migrationsApi";
import {
  useCreateCheckoutMutation,
  savePendingMigration,
} from "../../Redux/features/payments/paymentsApi";
import { calcMigrationCost, formatGBP } from "../../utils/pricing";
import PaymentModal from "./PaymentModal";
import MigrationsTab from "./MigrationsTab";

interface Account {
  accountId: number;
  sellerId: number;
  provider: string;
  name: string | null;
  status: string;
}

type Readiness =
  | "READY"
  | "READY_WITH_WARNINGS"
  | "PUBLISHED"
  | "NOT_READY"
  | "";

const READINESS_META: Record<
  Exclude<Readiness, "">,
  { label: string; cls: string; Icon: any }
> = {
  READY: { label: "Ready", cls: "bg-[#ECFDF5] text-[#059669]", Icon: CheckCircle2 },
  READY_WITH_WARNINGS: {
    label: "Ready (warnings)",
    cls: "bg-[#FFF4E5] text-[#B58900]",
    Icon: AlertTriangle,
  },
  PUBLISHED: {
    label: "Published",
    cls: "bg-[#E8EDFF] text-[#2563EB]",
    Icon: CheckCircle2,
  },
  NOT_READY: {
    label: "Not Ready",
    cls: "bg-[#FDECEA] text-[#DC2626]",
    Icon: AlertCircle,
  },
};

// Page size kept ≤ the backend's 100/request validate cap, so each listings page
// is one safe validate call. Paging covers categories with more than this many listings.
const LISTINGS_PAGE_SIZE = 50;

const isSelectable = (status: Readiness) =>
  status === "READY" || status === "READY_WITH_WARNINGS";

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
  const ebayAccounts = useMemo(
    () => accounts.filter((a) => a.provider?.toUpperCase() === "EBAY"),
    [accounts]
  );
  const temuAccount = useMemo(
    () => accounts.find((a) => a.provider?.toUpperCase() === "TEMU"),
    [accounts]
  );

  const [tab, setTab] = useState<"readiness" | "migrations">("readiness");
  const [view, setView] = useState<"categories" | "listings">("categories");
  const [page, setPage] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState<number | "">("");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsTotal, setListingsTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Exclude<Readiness, "">>(
    "all"
  );
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    if (selectedAccountId === "" && ebayAccounts.length) {
      setSelectedAccountId(ebayAccounts[0].accountId);
    }
  }, [ebayAccounts, selectedAccountId]);

  const { data: fitmentData, isFetching: categoriesLoading } =
    useSummaryFitmentQuery({ pageNumber: page, pageSize: 50 });

  const categories = useMemo(
    () =>
      [...(fitmentData?.categories ?? [])].sort(
        (a: any, b: any) => (b.percentage ?? 0) - (a.percentage ?? 0)
      ),
    [fitmentData]
  );
  const totalPages = fitmentData?.fitmentCount || 1;

  const [getFitmentDetails, { isLoading: listingsLoading }] =
    useSummaryFitmentDetailsMutation();
  const [validateListings, { isLoading: validating }] =
    useValidateListingsMutation();
  const [createCheckout, { isLoading: creatingCheckout }] =
    useCreateCheckoutMutation();

  const openCategory = (category: any) => {
    setSelectedCategory(category);
    setView("listings");
    setSelectedIds([]);
    setQuery("");
    setStatusFilter("all");
    setListingsPage(1);
    loadListingsPage(category, 1);
  };

  // Load + validate ONE page of listings (≤ LISTINGS_PAGE_SIZE, within the backend cap).
  const loadListingsPage = async (category: any, pageNo: number) => {
    setListings([]);
    try {
      const detail = await getFitmentDetails({
        searchResultId: category.searchResultId,
        pageNo,
        pageSize: LISTINGS_PAGE_SIZE,
        categoryId: category.categoryId,
        site: category.site,
      }).unwrap();

      const items: any[] = Array.isArray(detail) ? detail : detail?.items ?? [];
      setListingsTotal(
        detail?.totalItems ?? category.amountOfListings ?? items.length
      );
      setListings(items.map((i) => ({ ...i, status: "" })));

      if (items.length) {
        const res = await validateListings({
          sourceListingIds: items.map((i) => i.id),
        }).unwrap();

        const statusMap: Record<string, string> = {};
        res.items?.forEach((it) => {
          statusMap[String(it.sourceListingId).trim()] = it.status;
        });

        setListings(
          items.map((i) => ({
            ...i,
            status: statusMap[String(i.id).trim()] || "NOT_READY",
          }))
        );
      }
    } catch (err) {
      console.error("Error loading category listings:", err);
    }
  };

  const goToListingsPage = (pageNo: number) => {
    if (!selectedCategory) return;
    setListingsPage(pageNo);
    loadListingsPage(selectedCategory, pageNo);
  };

  const backToCategories = () => {
    setView("categories");
    setSelectedCategory(null);
    setListings([]);
    setSelectedIds([]);
    setListingsTotal(0);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesQuery =
      !query.trim() ||
      [listing.title, listing.itemID]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const selectableVisible = filteredListings.filter((l) =>
    isSelectable(l.status)
  );
  const allSelected =
    selectableVisible.length > 0 &&
    selectableVisible.every((l) => selectedIds.includes(l.id));

  const toggleOne = (id: string | number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : selectableVisible.map((l) => l.id));

  const handleConfirmMigration = async () => {
    if (!temuAccount) {
      toast.error("Connect a TEMU store before migrating.");
      return;
    }
    try {
      const result = await createCheckout({ listingCount: selectedIds.length }).unwrap();
      // Persist selected listings across the Stripe redirect so the success
      // page can create the migration job once payment is confirmed.
      savePendingMigration({
        orderId: result.orderId,
        selectedIds,
        accountId: temuAccount.accountId,
        sellerId: temuAccount.sellerId,
      });
      window.location.href = result.checkoutUrl;
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to create checkout session.");
    }
  };

  const cost = calcMigrationCost(selectedIds.length);

  return (
    <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#EEF2F6] px-5 pt-4">
        {[
          { key: "readiness", label: "Listings Readiness", Icon: ClipboardList },
          { key: "migrations", label: "Migrations", Icon: Rocket },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex items-center gap-2 border-b-2 px-3 pb-3 text-[14px] font-semibold transition ${
              tab === key
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#64748B] hover:text-[#334155]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "migrations" ? (
        <MigrationsTab active={tab === "migrations"} />
      ) : (
        <>
          {/* Readiness header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              {view === "listings" ? (
                <div className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
                  <button
                    onClick={backToCategories}
                    className="inline-flex items-center gap-1 font-medium text-[#1D4ED8] hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Categories
                  </button>
                  <ChevronRightSm className="h-3.5 w-3.5 text-[#94A3B8]" />
                  <span className="font-medium text-[#334155]">
                    {selectedCategory?.category}
                  </span>
                </div>
              ) : (
                <p className="text-[14px] text-[#64748B]">
                  Pick a category to see its eBay listings and migration
                  readiness.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {view === "categories" ? (
                <div className="relative">
                  <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" />
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                    disabled={!ebayAccounts.length}
                    className="appearance-none rounded-lg border border-[#E2E8F0] bg-white py-2 pl-9 pr-8 text-[14px] font-medium text-[#334155] outline-none transition focus:border-[#1D4ED8] disabled:opacity-60"
                  >
                    {ebayAccounts.length === 0 && (
                      <option value="">No eBay store</option>
                    )}
                    {ebayAccounts.map((acc) => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.name || `eBay Store #${acc.accountId}`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Filter SKU or Name..."
                      className="w-[240px] rounded-lg border border-[#E2E8F0] bg-white py-2 pl-9 pr-3 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
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
                  <button className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-[14px] font-medium text-[#334155] transition hover:bg-[#F8FAFC]">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Categories view */}
          {view === "categories" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-y border-[#EEF2F6] bg-[#F8FAFC] text-left text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Site</th>
                      <th className="px-5 py-3 text-right">Listings</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesLoading ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-10 text-center text-[14px] text-[#94A3B8]"
                        >
                          No eBay categories found for this store.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat: any) => (
                        <tr
                          key={cat.id ?? `${cat.categoryId}-${cat.searchResultId}`}
                          onClick={() => openCategory(cat)}
                          className="cursor-pointer border-b border-[#F1F5F9] transition hover:bg-[#FAFBFD]"
                        >
                          <td className="px-5 py-4 text-[14px] font-medium text-[#1D4ED8]">
                            {cat.category}
                          </td>
                          <td className="px-5 py-4">
                            {cat.icon ? (
                              <img
                                src={cat.icon}
                                alt={cat.site}
                                title={cat.site}
                                className="h-6 w-6 object-contain"
                              />
                            ) : (
                              <span className="text-[14px] text-[#64748B]">
                                {cat.site}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right text-[14px] text-[#64748B]">
                            {cat.amountOfListings}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1D4ED8]">
                              View listings
                              <ChevronRightSm className="h-4 w-4" />
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-1.5 px-5 py-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 text-[14px] text-[#64748B]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Listings view */}
          {view === "listings" && (
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
                    <th className="px-5 py-3">eBay Item ID</th>
                    <th className="px-5 py-3 text-right">Optimization</th>
                    <th className="px-5 py-3">Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {listingsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
                      </td>
                    </tr>
                  ) : filteredListings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-[14px] text-[#94A3B8]"
                      >
                        No listings match your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map((listing) => {
                      const selectable = isSelectable(listing.status);
                      return (
                        <tr
                          key={listing.id}
                          className="border-b border-[#F1F5F9] transition hover:bg-[#FAFBFD]"
                        >
                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(listing.id)}
                              onChange={() => toggleOne(listing.id)}
                              disabled={!selectable}
                              className="h-4 w-4 cursor-pointer accent-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-40"
                            />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9]">
                                <ImageIcon className="h-4 w-4 text-[#94A3B8]" />
                              </div>
                              <span className="text-[14px] font-medium text-[#0F172A]">
                                {listing.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[14px] text-[#64748B]">
                            {listing.itemID}
                          </td>
                          <td className="px-5 py-4 text-right text-[14px] text-[#64748B]">
                            {listing.optimizationPercent != null
                              ? `${listing.optimizationPercent}%`
                              : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <ReadinessBadge status={listing.status as Readiness} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {validating && (
                <div className="flex items-center gap-2 px-5 py-3 text-[13px] text-[#64748B]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating readiness…
                </div>
              )}

              {/* Listings pagination + count notice */}
              {listingsTotal > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F6] px-5 py-4">
                  <p className="text-[14px] text-[#64748B]">
                    Showing{" "}
                    {(listingsPage - 1) * LISTINGS_PAGE_SIZE + 1}–
                    {Math.min(listingsPage * LISTINGS_PAGE_SIZE, listingsTotal)} of{" "}
                    {listingsTotal.toLocaleString()} listings
                  </p>
                  {listingsTotal > LISTINGS_PAGE_SIZE && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToListingsPage(listingsPage - 1)}
                        disabled={listingsPage <= 1 || listingsLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="px-2 text-[14px] text-[#64748B]">
                        Page {listingsPage} of{" "}
                        {Math.ceil(listingsTotal / LISTINGS_PAGE_SIZE)}
                      </span>
                      <button
                        onClick={() => goToListingsPage(listingsPage + 1)}
                        disabled={
                          listingsPage >=
                            Math.ceil(listingsTotal / LISTINGS_PAGE_SIZE) ||
                          listingsLoading
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selection action bar */}
          {view === "listings" && selectedIds.length > 0 && (
            <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F6] bg-white px-5 py-4">
              <p className="text-[14px] text-[#334155]">
                <span className="font-semibold">{selectedIds.length}</span>{" "}
                listing{selectedIds.length > 1 ? "s" : ""} selected ·{" "}
                <span className="font-semibold text-[#1D4ED8]">
                  {formatGBP(cost.total)}
                </span>
                <span className="text-[#94A3B8]"> ({formatGBP(cost.rate)}/listing)</span>
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
