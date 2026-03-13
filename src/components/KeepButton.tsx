import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
  onKeep: () => void;
}

export default function KeepButton({ visible, onKeep }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="h-12 px-8 bg-black text-white rounded-full text-sm font-medium cursor-pointer hover:bg-black/85 transition-colors focus:outline-none"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          onClick={onKeep}
        >
          เก็บไว้
        </motion.button>
      )}
    </AnimatePresence>
  );
}
