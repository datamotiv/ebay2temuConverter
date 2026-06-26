// Progressive (marginal) pricing: each band's rate applies only to listings within it.
// e.g. 110 listings → first 100 @ £1.00 + next 10 @ £0.80 = £108

export interface PricingTier {
  from: number;
  upTo: number;    // inclusive upper bound (Infinity for the last band)
  rate: number;    // £ per listing
  label: string;
}

export const PRICING_TIERS: PricingTier[] = [
  { from: 0,    upTo: 100,      rate: 1.0, label: "1 – 100"      },
  { from: 100,  upTo: 500,      rate: 0.8, label: "101 – 500"    },
  { from: 500,  upTo: 5000,     rate: 0.5, label: "501 – 5,000"  },
  { from: 5000, upTo: Infinity, rate: 0.3, label: "5,001+"       },
];

export interface TierCharge {
  label: string;
  qty: number;
  rate: number;
  subtotal: number;
}

export interface MigrationCost {
  count: number;
  breakdown: TierCharge[]; // one entry per band that contributes to the total
  marginalRate: number;    // rate for the band the last listing falls into
  total: number;
}

export const calcMigrationCost = (count: number): MigrationCost => {
  if (count <= 0) {
    return { count: 0, breakdown: [], marginalRate: PRICING_TIERS[0].rate, total: 0 };
  }

  const breakdown: TierCharge[] = [];
  let remaining = count;

  for (const tier of PRICING_TIERS) {
    if (remaining <= 0) break;
    const bandSize = tier.upTo === Infinity ? remaining : tier.upTo - tier.from;
    const qty = Math.min(remaining, bandSize);
    breakdown.push({ label: tier.label, qty, rate: tier.rate, subtotal: qty * tier.rate });
    remaining -= qty;
  }

  const total = Number(breakdown.reduce((s, b) => s + b.subtotal, 0).toFixed(2));
  const marginalRate = breakdown[breakdown.length - 1]?.rate ?? PRICING_TIERS[0].rate;
  return { count, breakdown, marginalRate, total };
};

export const formatGBP = (amount: number): string =>
  `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
