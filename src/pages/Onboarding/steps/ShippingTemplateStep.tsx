import { motion } from "framer-motion";
import { Truck, Check, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useShippingTemplatesQuery,
  useSelectShippingTemplateMutation,
} from "../../../Redux/features/migrations/migrationsApi";

interface ShippingTemplateStepProps {
  alreadySelected: boolean;
  temuConnected: boolean;
  onSave: () => void;
  onSkip: () => void;
}

const ShippingTemplateStep = ({
  alreadySelected,
  temuConnected,
  onSave,
  onSkip,
}: ShippingTemplateStepProps) => {
  const { data, isFetching } = useShippingTemplatesQuery(undefined, {
    skip: !temuConnected,
  });
  const [selectTemplate, { isLoading: saving }] = useSelectShippingTemplateMutation();

  const currentId = data?.selectedShippingTemplate?.templateId ?? null;
  const templates = [...(data?.templates ?? [])].sort((a, b) => {
    if (a.templateId === currentId) return -1;
    if (b.templateId === currentId) return 1;
    return 0;
  });

  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    setPicked(currentId);
  }, [currentId]);

  const handleSave = async () => {
    if (!picked) {
      toast.error("Select a shipping template first.");
      return;
    }
    try {
      await selectTemplate({ templateId: picked }).unwrap();
      localStorage.setItem("shippingTemplateId", picked);
      toast.success("Shipping template saved.");
      onSave();
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to save template.");
    }
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
          alreadySelected ? "bg-[#DCFCE7]" : "bg-[#FEF2F2]"
        }`}
      >
        {alreadySelected ? (
          <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
        ) : (
          <Truck className="h-10 w-10 text-[#F0533B]" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h1 className="text-center text-[26px] font-bold tracking-tight text-[#0F172A]">
          {alreadySelected ? "Shipping Template Set" : "Choose a Shipping Template"}
        </h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-[#64748B]">
          {alreadySelected
            ? "A shipping template is already configured for your Temu listings."
            : "Select the Temu shipping template that will apply to all migrated listings."}
        </p>

        {!temuConnected && (
          <div className="mt-5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#475569]">
            <span className="font-semibold text-[#334155]">Temu not connected.</span> Connect
            your Temu store first to load shipping templates. You can skip this
            step and configure it later from the dashboard.
          </div>
        )}

        {temuConnected && !alreadySelected && (
          <div className="mt-5 max-h-[280px] space-y-2 overflow-y-auto">
            {isFetching ? (
              <div className="py-10 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
              </div>
            ) : templates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#CBD5E1] py-10 text-center text-[14px] text-[#94A3B8]">
                No shipping templates found in your Temu account.
              </div>
            ) : (
              templates.map((tpl) => {
                const active = picked === tpl.templateId;
                return (
                  <button
                    key={tpl.templateId}
                    type="button"
                    onClick={() => setPicked(tpl.templateId)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-[#1D4ED8] bg-[#EFF4FF]"
                        : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-[#0F172A]">
                        {tpl.templateName}
                      </p>
                      <p className="truncate text-[12px] text-[#94A3B8]">
                        ID: {tpl.templateId}
                        {currentId === tpl.templateId && " · current"}
                      </p>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-[#1D4ED8] bg-[#1D4ED8] text-white"
                          : "border-[#CBD5E1]"
                      }`}
                    >
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {alreadySelected || !temuConnected ? (
            <button
              onClick={alreadySelected ? onSave : onSkip}
              className="w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] active:scale-[0.98]"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || isFetching || !picked}
              className="w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </span>
              ) : (
                "Save & Continue"
              )}
            </button>
          )}

          {!alreadySelected && (
            <button
              onClick={onSkip}
              className="w-full text-[14px] font-medium text-[#94A3B8] transition hover:text-[#64748B]"
            >
              Skip for now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ShippingTemplateStep;
