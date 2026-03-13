import { motion } from "framer-motion";

interface Props {
  onSelect: (mode: "letgo" | "keep") => void;
}

const container = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Landing({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-[420px]"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {/* Title */}
        <motion.div className="text-center mb-12" variants={fadeUp}>
          <h1 className="font-serif text-5xl md:text-6xl font-normal italic text-white leading-none mb-2">
            let go.
          </h1>
          <p className="text-[#666] text-sm">พื้นที่สำหรับความคิดของคุณ</p>
        </motion.div>

        {/* Cards */}
        <motion.button
          className="w-full bg-[#111] border border-[#222] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-[#444] mb-3.5"
          variants={fadeUp}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("letgo")}
        >
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center">
              <svg
                width="24"
                height="24"
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
          <h2 className="text-white text-lg font-normal mb-1">ระบายทิ้ง</h2>
          <p className="text-[#666] text-sm">เขียน แล้วปล่อยให้หายไป</p>
        </motion.button>

        <motion.button
          className="w-full bg-[#111] border border-[#222] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-[#444]"
          variants={fadeUp}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("keep")}
        >
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center">
              <svg
                width="22"
                height="22"
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
          <h2 className="text-white text-lg font-normal mb-1">เก็บไว้</h2>
          <p className="text-[#666] text-sm">เขียน แล้วเก็บไว้อ่านทีหลัง</p>
        </motion.button>
      </motion.div>
    </div>
  );
}
