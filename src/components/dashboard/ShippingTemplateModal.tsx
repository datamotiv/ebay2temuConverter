/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { X, Loader2, Truck, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  useShippingTemplatesQuery,
  useSelectShippingTemplateMutation,
} from "../../Redux/features/migrations/migrationsApi";

const ShippingTemplateModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { data, isFetching } = useShippingTemplatesQuery(undefined, {
    skip: !open,
  });
  const [selectTemplate, { isLoading: saving }] =
    useSelectShippingTemplateMutation();

  const currentId = data?.selectedShippingTemplate?.templateId ?? null;
  // Show the currently-selected template first.
  const templates = [...(data?.templates ?? [])].sort((a, b) => {
    if (a.templateId === currentId) return -1;
    if (b.templateId === currentId) return 1;
    return 0;
  });
  const [picked, setPicked] = useState<string | null>(null);

  // Default the radio to the currently-active template each time data loads.
  useEffect(() => {
    setPicked(currentId);
  }, [currentId, open]);

  const handleSave = async () => {
    if (!picked) {
      toast.error("Select a shipping template first.");
      return;
    }
    try {
      await selectTemplate({ templateId: picked }).unwrap();
      localStorage.setItem("shippingTemplateId", picked);
      toast.success("Shipping template saved.");
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save template.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 20px 60px -15px rgba(15,23,42,0.25)",
        },
      }}
    >
      <div className="font-poppins p-7 sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF2F2]">
              <Truck className="h-5 w-5 text-[#F0533B]" />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-[#0F172A]">
                Shipping template
              </h2>
              <p className="mt-0.5 text-[14px] text-[#64748B]">
                Choose the TEMU template applied to migrated listings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-md p-1 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 max-h-[320px] space-y-2 overflow-y-auto">
          {isFetching ? (
            <div className="py-10 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#94A3B8]" />
            </div>
          ) : templates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] py-10 text-center text-[14px] text-[#94A3B8]">
              No shipping templates found in your TEMU account.
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

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-[#475569] transition hover:bg-[#F1F5F9] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isFetching || templates.length === 0 || !picked}
            className="flex min-w-[140px] items-center justify-center rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : (
              "Save template"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ShippingTemplateModal;
