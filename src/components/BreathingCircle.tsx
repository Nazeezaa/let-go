import { motion } from "framer-motion";

interface Props {
  visible: boolean;
}

export default function BreathingCircle({ visible }: Props) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="breathing-circle w-24 h-24 rounded-full border border-white/40" />
    </motion.div>
  );
}
