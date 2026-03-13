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
          className="px-10 py-3.5 bg-white text-black rounded-full text-[15px] font-normal tracking-wider cursor-pointer hover:bg-white/90 transition-all duration-300"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          onClick={onKeep}
        >
          เก็บไว้
        </motion.button>
      )}
    </AnimatePresence>
  );
}
