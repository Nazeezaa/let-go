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
          className="px-10 py-3.5 border border-white/30 rounded-full text-white/90 bg-transparent text-[15px] font-light tracking-wider cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all duration-300"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          onClick={onLetGo}
        >
          ปล่อยไป
        </motion.button>
      )}
    </AnimatePresence>
  );
}
