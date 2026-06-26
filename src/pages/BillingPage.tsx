import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ExternalLink,
  ListOrdered,
  Loader2,
  Receipt,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  useGetPaymentHistoryQuery,
  useGetPaymentStatsQuery,
  PaymentOrder,
} from "../Redux/features/payments/paymentsApi";
import { formatGBP, PRICING_TIERS } from "../utils/pricing";
import AppSidebar from "../components/AppSidebar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip);

function statusBadge(status: PaymentOrder["status"]) {
  switch (status) {
    case "PAID":
      return { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500", label: "Paid" };
    case "PENDING":
      return { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-400", label: "Pending" };
    case "PARTIALLY_REFUNDED":
      return { cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", dot: "bg-blue-500", label: "Partial Refund" };
    case "REFUNDED":
      return { cls: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400", label: "Refunded" };
    case "EXPIRED":
      return { cls: "bg-red-50 text-red-600 ring-1 ring-red-200", dot: "bg-red-400", label: "Expired" };
  }
}

const SETTLED = new Set<PaymentOrder["status"]>(["PAID", "PARTIALLY_REFUNDED", "REFUNDED"]);

function orderDate(order: PaymentOrder): string {
  const src = SETTLED.has(order.status) ? (order.paidAt ?? order.createdAt) : order.createdAt;
  return new Date(src).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const LIMIT = 10;

// ---------------------------------------------------------------------------
// Spend-over-time chart
// ---------------------------------------------------------------------------

function useSpendChartData(allOrders: PaymentOrder[]) {
  return useMemo(() => {
    const paid = allOrders
      .filter((o) => o.status === "PAID" || o.status === "PARTIALLY_REFUNDED")
      .filter((o) => o.paidAt)
      .sort((a, b) => new Date(a.paidAt!).getTime() - new Date(b.paidAt!).getTime());

    if (paid.length === 0) return null;

    // Group by calendar day — daily spend (not cumulative)
    const byDay = new Map<string, number>();
    for (const o of paid) {
      const day = new Date(o.paidAt!).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      });
      byDay.set(day, (byDay.get(day) ?? 0) + (o.totalPence - (o.refundedPence ?? 0)));
    }

    // Fill in zero-spend days between first and last date so the line drops naturally
    const sortedDates = [...byDay.keys()];
    if (sortedDates.length < 2) {
      // Single day — just return it without gap-fill
      return {
        labels: sortedDates,
        values: sortedDates.map((d) => (byDay.get(d) ?? 0) / 100),
      };
    }

    const first = new Date(paid[0].paidAt!);
    const last = new Date(paid[paid.length - 1].paidAt!);
    const labels: string[] = [];
    const values: number[] = [];
    const cursor = new Date(first);
    cursor.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);

    while (cursor <= last) {
      const label = cursor.toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      });
      labels.push(label);
      values.push((byDay.get(label) ?? 0) / 100);
      cursor.setDate(cursor.getDate() + 1);
    }

    return { labels, values };
  }, [allOrders]);
}

const CHART_OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0F172A",
      titleColor: "#94A3B8",
      bodyColor: "#F8FAFC",
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => ` £${(ctx.parsed.y as number).toFixed(2)} spent`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94A3B8", font: { size: 11, family: "Poppins, sans-serif" }, maxTicksLimit: 7 },
      border: { display: false },
    },
    y: {
      grid: { color: "#F1F5F9" },
      ticks: {
        color: "#94A3B8",
        font: { size: 11, family: "Poppins, sans-serif" },
        callback: (v) => `£${v}`,
      },
      border: { display: false },
    },
  },
};

const SpendChart = ({ orders }: { orders: PaymentOrder[] }) => {
  const chart = useSpendChartData(orders);

  if (!chart) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-[#CBD5E1]">
        <TrendingUp className="h-6 w-6" />
        <span className="text-sm">Spend data will appear after your first payment</span>
      </div>
    );
  }

  const gradient = (ctx: CanvasRenderingContext2D) => {
    const g = ctx.createLinearGradient(0, 0, 0, 260);
    g.addColorStop(0, "rgba(29, 78, 216, 0.22)");
    g.addColorStop(1, "rgba(29, 78, 216, 0)");
    return g;
  };

  const data = {
    labels: chart.labels,
    datasets: [
      {
        data: chart.values,
        borderColor: "#1D4ED8",
        borderWidth: 2.5,
        pointRadius: chart.values.length > 20 ? 0 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#1D4ED8",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        fill: true,
        backgroundColor: (ctx: { chart: ChartJS }) =>
          gradient(ctx.chart.ctx as CanvasRenderingContext2D),
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} options={CHART_OPTIONS} />;
};

// ---------------------------------------------------------------------------

const BillingPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useGetPaymentStatsQuery();
  const { data, isLoading, isError } = useGetPaymentHistoryQuery({ page, limit: LIMIT });
  // Fetch all orders for the chart (up to 500; separate RTK cache entry)
  const { data: allData } = useGetPaymentHistoryQuery({ page: 1, limit: 500 });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const netPaidPence = (stats?.totalChargedPence ?? 0) - (stats?.totalRefundedPence ?? 0);

  return (
    <div className="flex min-h-screen bg-[#F7F9FC] font-poppins text-[#0F172A]">
      <AppSidebar active="billing" />

      <main className="flex-1 px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Usage &amp; Billing</h1>
          <p className="mt-1 text-sm text-[#64748B]">Track your migration spend and payment history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="h-1 rounded-t-2xl bg-gradient-to-r from-[#1D4ED8] to-[#6366F1]" />
            <div className="p-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF4FF]">
                <CreditCard className="h-5 w-5 text-[#1D4ED8]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#64748B]">Net Paid</p>
                {statsLoading ? (
                  <div className="mt-2 h-7 w-24 animate-pulse rounded-lg bg-[#E5E7EB]" />
                ) : (
                  <p className="mt-0.5 text-2xl font-bold tracking-tight text-[#0F172A]">
                    {formatGBP(netPaidPence / 100)}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-[#94A3B8]">After refunds · all time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="h-1 rounded-t-2xl bg-gradient-to-r from-[#16A34A] to-[#4ADE80]" />
            <div className="p-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4]">
                <ListOrdered className="h-5 w-5 text-[#16A34A]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#64748B]">Listings Migrated</p>
                {statsLoading ? (
                  <div className="mt-2 h-7 w-20 animate-pulse rounded-lg bg-[#E5E7EB]" />
                ) : (
                  <p className="mt-0.5 text-2xl font-bold tracking-tight text-[#0F172A]">
                    {(stats?.totalListings ?? 0).toLocaleString("en-GB")}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-[#94A3B8]">Across paid migrations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="h-1 rounded-t-2xl bg-gradient-to-r from-[#EA580C] to-[#FBBF24]" />
            <div className="p-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED]">
                <RotateCcw className="h-5 w-5 text-[#EA580C]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#64748B]">Refunds Received</p>
                {statsLoading ? (
                  <div className="mt-2 h-7 w-20 animate-pulse rounded-lg bg-[#E5E7EB]" />
                ) : (
                  <p className="mt-0.5 text-2xl font-bold tracking-tight text-[#0F172A]">
                    {formatGBP((stats?.totalRefundedPence ?? 0) / 100)}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-[#94A3B8]">For failed listings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Pricing Tiers + Chart */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F1F5F9]">
                <h2 className="text-[15px] font-semibold text-[#0F172A]">Volume Pricing</h2>
                <p className="mt-0.5 text-xs text-[#94A3B8]">Each band's rate applies only to its listings</p>
              </div>
              <div className="p-4">
                <div className="space-y-1">
                  {PRICING_TIERS.map((tier) => (
                    <div
                      key={tier.label}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <span className="text-sm text-[#334155]">{tier.label} listings</span>
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {formatGBP(tier.rate)}
                        <span className="ml-1 text-xs font-normal text-[#94A3B8]">/ each</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cumulative Spend Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex-1">
              <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#0F172A]">Daily Spend</h2>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">Spend per day (GBP)</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF4FF]">
                  <TrendingUp className="h-4 w-4 text-[#1D4ED8]" />
                </div>
              </div>
              <div className="px-5 py-5" style={{ height: 220 }}>
                <SpendChart orders={allData?.orders ?? []} />
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden lg:col-span-2">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-[15px] font-semibold text-[#0F172A]">Payment History</h2>
              {!isLoading && !isError && total > 0 && (
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  {total} order{total !== 1 ? "s" : ""} total
                </p>
              )}
            </div>

            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#CBD5E1]" />
              </div>
            )}

            {isError && (
              <div className="py-12 text-center">
                <p className="text-sm text-red-500">Failed to load payment history.</p>
              </div>
            )}

            {!isLoading && !isError && orders.length === 0 && (
              <div className="flex flex-col items-center py-14 gap-3 px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9]">
                  <Receipt className="h-7 w-7 text-[#CBD5E1]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#334155]">No payments yet</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Start your first migration to see billing history here
                  </p>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A45BE]"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {!isLoading && !isError && orders.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Date
                        </th>
                        <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Listings
                        </th>
                        <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Charged
                        </th>
                        <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Refunded
                        </th>
                        <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Net
                        </th>
                        <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Status
                        </th>
                        <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                          Job
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {orders.map((order) => {
                        const badge = statusBadge(order.status);
                        const netPence = order.totalPence - (order.refundedPence ?? 0);
                        const isUnsettled =
                          order.status === "PENDING" || order.status === "EXPIRED";
                        return (
                          <tr
                            key={order.id}
                            className="hover:bg-[#F8FAFC] transition-colors"
                          >
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className="text-[#334155]">{orderDate(order)}</span>
                              {isUnsettled && (
                                <span className="ml-1.5 text-[10px] uppercase tracking-wide text-[#CBD5E1]">
                                  {order.status === "PENDING" ? "pending" : "expired"}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-3.5 text-right text-[#334155]">
                              {order.listingCount.toLocaleString("en-GB")}
                            </td>
                            <td className="px-3 py-3.5 text-right text-[#334155]">
                              {formatGBP(order.totalPence / 100)}
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              {order.refundedPence ? (
                                <span className="text-[#EA580C]">
                                  {formatGBP(order.refundedPence / 100)}
                                </span>
                              ) : (
                                <span className="text-[#CBD5E1]">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <span className="font-semibold text-[#0F172A]">
                                {formatGBP(netPence / 100)}
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badge.cls}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              {order.migrationJobId ? (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard?tab=migrations&highlight=${order.migrationJobId}`,
                                    )
                                  }
                                  title="View migration"
                                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#EFF4FF] hover:text-[#1D4ED8]"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              ) : (
                                <span className="text-[#CBD5E1]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F1F5F9]">
                  <p className="text-xs text-[#94A3B8]">Page {page} of {totalPages}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-lg border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-medium text-[#334155] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="min-w-[40px] text-center text-xs tabular-nums text-[#64748B]">
                      {page} / {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-lg border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-medium text-[#334155] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default BillingPage;
