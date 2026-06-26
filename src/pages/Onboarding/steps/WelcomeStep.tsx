import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => (
  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF4FF]"
    >
      <Zap className="h-10 w-10 text-[#1D4ED8]" />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
    >
      <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">
        Welcome to eBay2Temu
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#64748B]">
        Let's get your stores connected. It only takes a couple of minutes to
        link your eBay source and Temu target accounts — then you're ready to
        migrate listings.
      </p>

      <div className="mt-6 space-y-2.5 text-left">
        {[
          "Connect your eBay store as the listing source",
          "Link your Temu store as the migration target",
          "Choose a shipping template for your Temu listings",
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF4FF] text-[12px] font-bold text-[#1D4ED8]">
              {i + 1}
            </span>
            <p className="text-[14px] text-[#475569]">{item}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] active:scale-[0.98]"
      >
        Let's get started
      </button>
    </motion.div>
  </div>
);

export default WelcomeStep;
