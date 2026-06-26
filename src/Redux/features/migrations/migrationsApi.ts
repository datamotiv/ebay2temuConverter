/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// eBay2temu integration backend. VITE_LOCAL_TEMU_BASE_URL already ends in /api,
// so routes are referenced as /v1/... (matches the working accounts/summary call).
export const migrationsApi = createApi({
  reducerPath: "ebay2temuMigrations",
  tagTypes: ["Migrations", "MigrationItems", "ShippingTemplate", "AccountsSummary"],
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
    // POST /v1/migrations/validate — readiness check for a set of source listings.
    validateListings: builder.mutation<
      { items: { sourceListingId: string; status: string }[] },
      { sourceListingIds: (string | number)[] }
    >({
      query: ({ sourceListingIds }) => ({
        url: "/v1/migrations/validate",
        method: "POST",
        body: {
          listings: sourceListingIds.map((id) => ({
            sourceListingId: String(id),
          })),
        },
      }),
    }),

    // POST /v1/migrations — create a migration job (uses the TEMU target account).
    createMigration: builder.mutation<
      { migrationId: string },
      {
        accountId: number;
        sellerId: number;
        sourceListingIds: (string | number)[];
        orderId?: string;
      }
    >({
      query: ({ accountId, sellerId, sourceListingIds, orderId }) => ({
        url: "/v1/migrations",
        method: "POST",
        body: {
          accountId,
          sellerId,
          ...(orderId ? { orderId } : {}),
          listings: sourceListingIds.map((id) => ({
            sourceListingId: String(id),
          })),
        },
      }),
      invalidatesTags: ["Migrations"],
    }),

    // GET /v1/migrations — paginated job list (with meta).
    listMigrations: builder.query<
      { items: any[]; meta: { page: number; pages: number; hasPrev: boolean; hasNext: boolean } },
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => ({
        url: "/v1/migrations",
        params: {
          page,
          limit,
          ...(status && status !== "ALL" ? { status } : {}),
        },
      }),
      providesTags: ["Migrations"],
    }),

    // GET /v1/migrations/:id/items — items within a job.
    migrationItems: builder.query<
      { items: any[] },
      { migrationId: string; page?: number; limit?: number }
    >({
      query: ({ migrationId, page = 1, limit = 50 }) => ({
        url: `/v1/migrations/${migrationId}/items`,
        params: { page, limit },
      }),
      providesTags: ["MigrationItems"],
    }),

    // POST /v1/migrations/:id/retry — retry failed items.
    retryMigration: builder.mutation<any, { migrationId: string }>({
      query: ({ migrationId }) => ({
        url: `/v1/migrations/${migrationId}/retry`,
        method: "POST",
      }),
      invalidatesTags: ["Migrations", "MigrationItems"],
    }),

    // GET /v1/shipping-template — TEMU shipping templates + current selection.
    shippingTemplates: builder.query<
      {
        templates: { templateId: string; templateName: string }[];
        selectedShippingTemplate?: { templateId: string; templateName: string } | null;
      },
      void
    >({
      query: () => ({ url: "/v1/shipping-template" }),
      providesTags: ["ShippingTemplate"],
    }),

    // PATCH /v1/shipping-template/select/:templateId — set the active template.
    selectShippingTemplate: builder.mutation<any, { templateId: string }>({
      query: ({ templateId }) => ({
        url: `/v1/shipping-template/select/${templateId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ShippingTemplate"],
    }),

    // GET /v1/auth/accounts/summary — linked marketplace accounts for current user.
    getAccountsSummary: builder.query<
      {
        accounts: {
          accountId: number;
          sellerId: number | null;
          provider: "EBAY" | "TEMU";
          name: string | null;
          status: string | null;
        }[];
      },
      void
    >({
      query: () => ({ url: "/v1/auth/accounts/summary" }),
      providesTags: ["AccountsSummary"],
    }),

    // GET /v1/dashboard/listings — paginated eBay listings with category info.
    listDashboardListings: builder.query<
      {
        data: {
          id: number;
          itemId: string | null;
          title: string | null;
          categoryId: number | null;
          categoryTitle: string | null;
          price: string | null;
          currency: string | null;
          picture: string | null;
          sku: string | null;
          listingActive: boolean;
          listingStatus: string | null;
          hasFitments: boolean;
          fitmentCount: number | null;
          listedAt: string | null;
          optimizationPercent: number | null;
        }[];
        meta: { total: number; page: number; limit: number; pageCount: number };
      },
      { limit?: number; page?: number; search?: string; categoryId?: number; listingStatus?: string; hasFitments?: boolean }
    >({
      query: ({ limit = 500, page = 1, ...rest }) => ({
        url: "/v1/dashboard/listings",
        params: { limit, page, ...rest },
      }),
    }),
  }),
});

export const {
  useValidateListingsMutation,
  useCreateMigrationMutation,
  useListMigrationsQuery,
  useMigrationItemsQuery,
  useRetryMigrationMutation,
  useShippingTemplatesQuery,
  useSelectShippingTemplateMutation,
  useListDashboardListingsQuery,
  useLazyListDashboardListingsQuery,
  useGetAccountsSummaryQuery,
  useLazyGetAccountsSummaryQuery,
} = migrationsApi;
