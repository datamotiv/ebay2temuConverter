import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { StepDef } from "../useOnboardingState";

interface StepIndicatorProps {
  steps: StepDef[];
  current: number;
}

const StepIndicator = ({ steps, current }: StepIndicatorProps) => (
  <div className="flex items-center justify-center gap-2 py-5">
    {steps.map((step, i) => {
      const isActive = i === current;
      const isDone = step.completed;

      return (
        <div key={step.key} className="flex items-center">
          <motion.div
            animate={{
              scale: isActive ? 1 : 0.85,
              backgroundColor: isDone
                ? "#10B981"
                : isActive
                ? "#1D4ED8"
                : "#E2E8F0",
            }}
            transition={{ duration: 0.2 }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white"
          >
            {isDone ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
          </motion.div>
          {i < steps.length - 1 && (
            <div className="mx-1.5 h-px w-6 bg-[#E2E8F0]" />
          )}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
