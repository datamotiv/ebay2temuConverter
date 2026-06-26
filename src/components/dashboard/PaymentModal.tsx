import { Dialog } from "@mui/material";
import { X, Loader2, Lock } from "lucide-react";
import {
  PRICING_TIERS,
  calcMigrationCost,
  formatGBP,
} from "../../utils/pricing";

const PaymentModal = ({
  open,
  onClose,
  count,
  onConfirm,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  count: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}) => {
  const { breakdown, marginalRate, total } = calcMigrationCost(count);

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxWidth: "460px",
          width: "100%",
          boxShadow: "0 20px 60px -15px rgba(15,23,42,0.25)",
        },
      }}
    >
      <div className="font-poppins p-7 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#0F172A]">
              Confirm migration
            </h2>
            <p className="mt-1.5 text-[15px] text-[#64748B]">
              Review the cost before publishing to TEMU.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-md p-1 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cost summary */}
        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
          {breakdown.map((band, i) => (
            <div
              key={band.label}
              className={`flex items-center justify-between text-[14px] text-[#334155] ${i > 0 ? "mt-2" : ""}`}
            >
              <span>
                {band.qty.toLocaleString()} listing{band.qty !== 1 ? "s" : ""}
                <span className="ml-1.5 text-[#94A3B8]">@ {formatGBP(band.rate)}</span>
              </span>
              <span className="font-medium">{formatGBP(band.subtotal)}</span>
            </div>
          ))}
          <div className="mt-4 border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#0F172A]">Total</span>
            <span className="text-[24px] font-bold text-[#1D4ED8]">{formatGBP(total)}</span>
          </div>
        </div>

        {/* Tier reference */}
        <div className="mt-4 rounded-xl border border-[#E5E7EB] p-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">
            Volume pricing
          </p>
          <div className="space-y-1.5">
            {PRICING_TIERS.map((tier) => {
              const active = tier.rate === marginalRate;
              return (
                <div
                  key={tier.label}
                  className={`flex items-center justify-between rounded-md px-2 py-1 text-[14px] ${
                    active
                      ? "bg-[#EFF4FF] font-semibold text-[#1D4ED8]"
                      : "text-[#475569]"
                  }`}
                >
                  <span>{tier.label} listings</span>
                  <span>{formatGBP(tier.rate)} each</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-[13px] text-[#94A3B8]">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Secure payment via Stripe. You'll be redirected to complete checkout.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-[#475569] transition hover:bg-[#F1F5F9] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting || count === 0}
            className="flex min-w-[200px] items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pay with Stripe
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentModal;
