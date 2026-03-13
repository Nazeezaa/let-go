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
          className="px-8 py-3 bg-white text-black rounded-full text-base font-medium tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          onClick={onKeep}
        >
          เก็บไว้
        </motion.button>
      )}
    </AnimatePresence>
  );
}
