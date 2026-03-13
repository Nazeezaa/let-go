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
          className="h-12 px-10 bg-white text-black rounded-full text-sm font-normal tracking-wide cursor-pointer hover:bg-[#e5e5e5] transition-all duration-200 focus:outline-none"
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
