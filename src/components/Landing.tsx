import { motion } from "framer-motion";

interface Props {
  onSelect: (mode: "letgo" | "keep") => void;
}

const container = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Landing({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center overflow-y-auto px-6 py-12">
      <div className="w-full max-w-[520px]">
        <motion.div
          className="w-full"
          variants={container}
          initial="initial"
          animate="animate"
        >
          {/* Title */}
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h1 className="font-serif text-5xl md:text-6xl font-medium italic text-black leading-none mb-2.5">
              let go.
            </h1>
            <p className="text-[#999] text-sm">พื้นที่สำหรับความคิดของคุณ</p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              className="bg-white rounded-2xl p-6 pt-8 pb-7 text-center cursor-pointer transition-shadow duration-200 hover:shadow-lg active:scale-[0.98]"
              variants={fadeUp}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect("letgo")}
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 8h10a3 3 0 1 0-3-3" />
                    <path d="M5 12h14a4 4 0 1 1-4 4" />
                    <path d="M5 16h7a2.5 2.5 0 1 0-2.5-2.5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-black text-base font-medium mb-1">ระบายทิ้ง</h2>
              <p className="text-[#999] text-xs leading-relaxed">
                เขียน แล้วปล่อยให้หายไป
              </p>
            </motion.button>

            <motion.button
              className="bg-white rounded-2xl p-6 pt-8 pb-7 text-center cursor-pointer transition-shadow duration-200 hover:shadow-lg active:scale-[0.98]"
              variants={fadeUp}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect("keep")}
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  >
                    <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4.5L5 21V5a1 1 0 0 1 1-1z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-black text-base font-medium mb-1">เก็บไว้</h2>
              <p className="text-[#999] text-xs leading-relaxed">
                เขียน แล้วเก็บไว้อ่านทีหลัง
              </p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
