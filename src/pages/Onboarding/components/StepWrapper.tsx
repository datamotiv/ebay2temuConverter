import { motion } from "framer-motion";
import { ReactNode } from "react";

const variants = {
  enter: (direction: "forward" | "back") => ({
    x: direction === "forward" ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "back") => ({
    x: direction === "forward" ? -60 : 60,
    opacity: 0,
  }),
};

interface StepWrapperProps {
  children: ReactNode;
  direction: "forward" | "back";
}

const StepWrapper = ({ children, direction }: StepWrapperProps) => (
  <motion.div
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    className="w-full max-w-[520px]"
  >
    {children}
  </motion.div>
);

export default StepWrapper;
