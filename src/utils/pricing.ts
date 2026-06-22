// Migration pricing — volume tiers: the bracket the TOTAL listing count falls
// into sets a single per-listing rate applied to every listing.
// Kept as one function so switching to progressive/marginal pricing is trivial.

export interface PricingTier {
  upTo: number; // inclusive upper bound of the bracket
  rate: number; // £ per listing
  label: string;
}

export const PRICING_TIERS: PricingTier[] = [
  { upTo: 100, rate: 1.0, label: "1 – 100" },
  { upTo: 500, rate: 0.8, label: "101 – 500" },
  { upTo: 5000, rate: 0.5, label: "501 – 5,000" },
  { upTo: Infinity, rate: 0.3, label: "5,001+" },
];

export const ratePerListing = (count: number): number =>
  PRICING_TIERS.find((tier) => count <= tier.upTo)?.rate ?? 0.3;

export interface MigrationCost {
  count: number;
  rate: number;
  total: number;
}

export const calcMigrationCost = (count: number): MigrationCost => {
  const rate = ratePerListing(count);
  return { count, rate, total: Number((count * rate).toFixed(2)) };
};

export const formatGBP = (amount: number): string =>
  `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
