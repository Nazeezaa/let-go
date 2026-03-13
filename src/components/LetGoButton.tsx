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
          className="h-12 px-10 border border-[#444] rounded-full text-white bg-transparent text-sm tracking-wide cursor-pointer hover:border-[#888] hover:bg-white/5 transition-all duration-200 focus:outline-none"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          onClick={onLetGo}
        >
          ปล่อยไป
        </motion.button>
      )}
    </AnimatePresence>
  );
}
