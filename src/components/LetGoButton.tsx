import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
  onLetGo: () => void;
}

export default function LetGoButton({ visible, onLetGo }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="px-8 py-3 border border-white/80 rounded-full text-white bg-transparent text-base font-light tracking-wide cursor-pointer hover:border-white hover:bg-white/5 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          onClick={onLetGo}
        >
          ปล่อยไป
        </motion.button>
      )}
    </AnimatePresence>
  );
}
