import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { connectTemu } from "../../../services/temuService";

interface ConnectTemuStepProps {
  alreadyConnected: boolean;
  ebayConnected: boolean;
  onSkip: () => void;
  onContinue: () => void;
}

const ConnectTemuStep = ({
  alreadyConnected,
  ebayConnected,
  onSkip,
  onContinue,
}: ConnectTemuStepProps) => {
  const [launching, setLaunching] = useState(false);

  const handleConnect = async () => {
    setLaunching(true);
    try {
      const res = await connectTemu(0) as { authUrl?: string };
      if (res?.authUrl) {
        window.location.href = res.authUrl;
      } else {
        throw new Error("No auth URL returned");
      }
    } catch {
      toast.error("Could not start Temu connection. Please try again.");
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
          alreadyConnected ? "bg-[#DCFCE7]" : "bg-[#FEF2F2]"
        }`}
      >
        {alreadyConnected ? (
          <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
        ) : (
          <ShoppingBag className="h-10 w-10 text-[#F0533B]" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h1 className="text-[26px] font-bold tracking-tight text-[#0F172A]">
          {alreadyConnected ? "Temu Store Connected" : "Connect your Temu Store"}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#64748B]">
          {alreadyConnected
            ? "Your Temu store is linked and ready to receive migrated listings."
            : "Your migration target. Listings from eBay will be published directly to your Temu store."}
        </p>

        {!ebayConnected && !alreadyConnected && (
          <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left text-[13px] text-[#475569]">
            <span className="font-semibold text-[#334155]">Heads up:</span> You skipped the eBay
            connection. You can still connect Temu now, but migrations require
            both stores to be linked.
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
            disabled={launching}
            className="mt-8 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            {launching ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
              </span>
            ) : (
              "Connect Temu →"
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

export default ConnectTemuStep;
