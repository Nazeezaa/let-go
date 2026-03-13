import { motion } from "framer-motion";

interface Props {
  visible: boolean;
}

export default function BreathingCircle({ visible }: Props) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <div className="breathing-circle w-20 h-20 rounded-full border border-black/10" />
    </motion.div>
  );
}
