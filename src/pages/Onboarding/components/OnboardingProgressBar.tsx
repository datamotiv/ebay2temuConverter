import { motion } from "framer-motion";

interface OnboardingProgressBarProps {
  current: number;
  total: number;
}

const OnboardingProgressBar = ({ current, total }: OnboardingProgressBarProps) => {
  const pct = total <= 1 ? 100 : Math.round((current / (total - 1)) * 100);

  return (
    <div className="h-1 w-full bg-[#F1F5F9]">
      <motion.div
        className="h-full bg-[#1D4ED8]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
};

export default OnboardingProgressBar;
