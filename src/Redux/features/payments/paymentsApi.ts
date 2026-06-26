/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CheckoutResponse {
  orderId: string;
  checkoutUrl: string;
  listingCount: number;
  unitPence: number;
  totalPence: number;
}

export interface PaymentOrder {
  id: string;
  listingCount: number;
  unitPence: number;
  totalPence: number;
  currency: string;
  status: "PENDING" | "PAID" | "PARTIALLY_REFUNDED" | "REFUNDED" | "EXPIRED";
  migrationJobId: string | null;
  refundedPence: number | null;
  createdAt: string;
  paidAt: string | null;
  refundedAt: string | null;
}

export interface PaymentStats {
  totalChargedPence: number;
  totalRefundedPence: number;
  totalListings: number;
  totalOrders: number;
}

export const paymentsApi = createApi({
  reducerPath: "ebay2temuPayments",
  tagTypes: ["PaymentHistory", "PaymentStats"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_LOCAL_TEMU_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createCheckout: builder.mutation<CheckoutResponse, { listingCount: number }>({
      query: ({ listingCount }) => ({
        url: "/v1/payments/checkout",
        method: "POST",
        body: { listingCount },
      }),
    }),

    getPaymentHistory: builder.query<
      { orders: PaymentOrder[]; total: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/v1/payments/history",
        params: { page, limit },
      }),
      providesTags: ["PaymentHistory"],
    }),

    getPaymentStats: builder.query<PaymentStats, void>({
      query: () => "/v1/payments/stats",
      providesTags: ["PaymentStats"],
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentStatsQuery,
} = paymentsApi;

// ---------------------------------------------------------------------------
// Pending migration stored in localStorage across the Stripe redirect
// ---------------------------------------------------------------------------

export const PENDING_MIGRATION_KEY = "pendingMigration";

export interface PendingMigration {
  orderId: string;
  selectedIds: (string | number)[];
  accountId: number;
  sellerId: number;
}

export const savePendingMigration = (data: PendingMigration) =>
  localStorage.setItem(PENDING_MIGRATION_KEY, JSON.stringify(data));

export const loadPendingMigration = (): PendingMigration | null => {
  try {
    const raw = localStorage.getItem(PENDING_MIGRATION_KEY);
    return raw ? (JSON.parse(raw) as PendingMigration) : null;
  } catch {
    return null;
  }
};

export const clearPendingMigration = () =>
  localStorage.removeItem(PENDING_MIGRATION_KEY);
