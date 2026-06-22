/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// eBay2temu integration backend. VITE_LOCAL_TEMU_BASE_URL already ends in /api,
// so routes are referenced as /v1/... (matches the working accounts/summary call).
export const migrationsApi = createApi({
  reducerPath: "ebay2temuMigrations",
  tagTypes: ["Migrations", "MigrationItems"],
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
      }
    >({
      query: ({ accountId, sellerId, sourceListingIds }) => ({
        url: "/v1/migrations",
        method: "POST",
        body: {
          accountId,
          sellerId,
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
  }),
});

export const {
  useValidateListingsMutation,
  useCreateMigrationMutation,
  useListMigrationsQuery,
  useMigrationItemsQuery,
  useRetryMigrationMutation,
} = migrationsApi;
