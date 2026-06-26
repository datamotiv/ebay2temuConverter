import { motion } from "framer-motion";

interface DoneStepProps {
  onComplete: () => void;
}

const DoneStep = ({ onComplete }: DoneStepProps) => (
  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
      className="relative mx-auto mb-6 h-20 w-20"
    >
      {/* Pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#DCFCE7]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* SVG checkmark */}
      <svg
        className="relative h-20 w-20"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="40" r="36" fill="#DCFCE7" stroke="#10B981" strokeWidth="3" />
        <motion.path
          d="M24 40 L35 51 L56 29"
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">
        You're all set!
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#64748B]">
        Your accounts are configured. Head to your dashboard to browse your eBay
        listings and start your first migration to Temu.
      </p>

      <button
        onClick={onComplete}
        className="mt-8 w-full rounded-lg bg-[#1D4ED8] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1A45BE] active:scale-[0.98]"
      >
        Go to Dashboard →
      </button>
    </motion.div>
  </div>
);

export default DoneStep;
