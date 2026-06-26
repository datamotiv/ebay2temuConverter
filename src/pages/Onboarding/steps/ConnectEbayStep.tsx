import { motion } from "framer-motion";
import { Store, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ConnectEbayStepProps {
  alreadyConnected: boolean;
  isPolling: boolean;
  onConnect: () => void;
  onSkip: () => void;
  onContinue: () => void;
}

const ConnectEbayStep = ({
  alreadyConnected,
  isPolling,
  onConnect,
  onSkip,
  onContinue,
}: ConnectEbayStepProps) => {
  const [launching, setLaunching] = useState(false);

  const handleConnect = async () => {
    setLaunching(true);
    try {
      const token = localStorage.getItem("accessToken");
      const resp = await fetch(
        "https://api.help-on-time.com/api/datacube/public/ebayauth",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resp.ok) throw new Error("Failed to get eBay auth URL");
      const url = await resp.text();
      window.open(url.replace(/^"|"$/g, ""), "_blank");
      onConnect();
    } catch {
      toast.error("Could not start eBay connection. Please try again.");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
          alreadyConnected ? "bg-[#DCFCE7]" : "bg-[#EFF4FF]"
        }`}
      >
        {alreadyConnected ? (
          <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
        ) : (
          <Store className="h-10 w-10 text-[#1D4ED8]" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h1 className="text-[26px] font-bold tracking-tight text-[#0F172A]">
          {alreadyConnected ? "eBay Store Connected" : "Connect your eBay Store"}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#64748B]">
          {alreadyConnected
            ? "Your eBay store is already linked. We'll pull your active listings for migration."
            : "We'll pull your active eBay listings so you can review and migrate them to Temu."}
        </p>

        {isPolling && !alreadyConnected && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#475569]">
            <Loader2 className="h-4 w-4 animate-spin text-[#1D4ED8]" />
            <span>Waiting for eBay to confirm your connection…</span>
          </div>
        )}

        {alreadyConnected ? (
          <button
            onClick={onContinue}
            className="mt-8 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] active:scale-[0.98]"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={launching || isPolling}
            className="mt-8 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            {launching ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Opening eBay…
              </span>
            ) : isPolling ? (
              "Connecting…"
            ) : (
              "Connect eBay →"
            )}
          </button>
        )}

        {!alreadyConnected && (
          <button
            onClick={onSkip}
            className="mt-3 w-full text-[14px] font-medium text-[#94A3B8] transition hover:text-[#64748B]"
          >
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectEbayStep;
