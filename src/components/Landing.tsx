import { motion } from "framer-motion";

interface Props {
  onSelect: (mode: "letgo" | "keep") => void;
}

function WindIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="27" stroke="white" strokeWidth="1" opacity="0.15" />
      <g stroke="white" strokeWidth="1.2" strokeLinecap="round">
        <path d="M14 22h18a4 4 0 1 0-4-4" opacity="0.9" />
        <path d="M14 28h24a5 5 0 1 1-5 5" opacity="0.7" />
        <path d="M14 34h14a3 3 0 1 0-3-3" opacity="0.5" />
      </g>
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="27" stroke="white" strokeWidth="1" opacity="0.15" />
      <path
        d="M20 16h16a1 1 0 0 1 1 1v24l-9-6-9 6V17a1 1 0 0 1 1-1z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const container = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Landing({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 md:px-8">
      <motion.div
        className="w-full max-w-md md:max-w-2xl"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="mb-14 md:mb-16" variants={fadeUp}>
          <h1 className="font-serif text-[2.75rem] md:text-6xl font-normal italic tracking-tight text-white leading-none mb-3">
            let go.
          </h1>
          <p className="text-secondary text-[15px] font-light">
            พื้นที่สำหรับความคิดของคุณ
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <motion.button
            className="group bg-surface border border-border rounded-2xl p-7 md:p-8 text-left cursor-pointer transition-all duration-300 hover:border-border-hover"
            variants={fadeUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect("letgo")}
          >
            <div className="mb-6">
              <WindIcon />
            </div>
            <h2 className="text-white text-lg font-normal mb-1.5 tracking-tight">
              ระบายทิ้ง
            </h2>
            <p className="text-secondary text-[13px] font-light leading-relaxed">
              เขียน แล้วปล่อยให้หายไป
            </p>
          </motion.button>

          <motion.button
            className="group bg-surface border border-border rounded-2xl p-7 md:p-8 text-left cursor-pointer transition-all duration-300 hover:border-border-hover"
            variants={fadeUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect("keep")}
          >
            <div className="mb-6">
              <BookmarkIcon />
            </div>
            <h2 className="text-white text-lg font-normal mb-1.5 tracking-tight">
              เก็บไว้
            </h2>
            <p className="text-secondary text-[13px] font-light leading-relaxed">
              เขียน แล้วเก็บไว้อ่านทีหลัง
            </p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
