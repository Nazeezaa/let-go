import { motion } from "framer-motion";

interface Props {
  onSelect: (mode: "letgo" | "keep") => void;
}

function FeatherIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 36L36 12" />
      <path d="M36 12C36 12 30 14 24 20C18 26 16 32 16 32" />
      <path d="M36 12C36 12 34 18 28 24C22 30 16 32 16 32" />
      <path d="M20 28L12 36" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 38V10C8 10 12 8 18 8C24 8 24 12 24 12C24 12 24 8 30 8C36 8 40 10 40 10V38C40 38 36 36 30 36C24 36 24 40 24 40C24 40 24 36 18 36C12 36 8 38 8 38Z" />
      <path d="M24 12V40" />
    </svg>
  );
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.03, borderColor: "rgba(255,255,255,0.5)" },
  tap: { scale: 0.98 },
};

export default function Landing({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight text-white mb-3">
          Let Go
        </h1>
        <p className="text-secondary text-sm md:text-base">
          พื้นที่สำหรับความคิดของคุณ
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-lg md:max-w-2xl">
        <motion.button
          className="bg-[#111111] border border-border rounded-2xl p-8 md:p-10 text-left cursor-pointer transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => onSelect("letgo")}
        >
          <div className="text-white mb-5">
            <FeatherIcon />
          </div>
          <h2 className="text-white text-xl font-medium mb-2">ระบายทิ้ง</h2>
          <p className="text-secondary text-sm">เขียน แล้วปล่อยให้หายไป</p>
        </motion.button>

        <motion.button
          className="bg-[#111111] border border-border rounded-2xl p-8 md:p-10 text-left cursor-pointer transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => onSelect("keep")}
        >
          <div className="text-white mb-5">
            <BookIcon />
          </div>
          <h2 className="text-white text-xl font-medium mb-2">เก็บไว้</h2>
          <p className="text-secondary text-sm">เขียน แล้วเก็บไว้อ่านทีหลัง</p>
        </motion.button>
      </div>
    </div>
  );
}
