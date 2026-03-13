import { motion } from "framer-motion";
import type { JournalEntry } from "../lib/db";

interface Props {
  entry: JournalEntry;
  onBack: () => void;
  onDelete: () => void;
}

export default function EntryDetail({ entry, onBack, onDelete }: Props) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="flex-1 flex flex-col bg-white m-3 md:m-5 rounded-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <header className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <button
            className="w-10 h-10 flex items-center justify-center text-[#bbb] hover:text-black transition-colors cursor-pointer rounded-full hover:bg-black/5"
            onClick={onBack}
            aria-label="กลับ"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[#aaa] text-[11px]">
            {formatDate(entry.createdAt)}
          </span>
          <button
            className="w-10 h-10 flex items-center justify-center text-[#ccc] hover:text-red-400 transition-colors cursor-pointer rounded-full hover:bg-black/5 text-xs"
            onClick={onDelete}
            aria-label="ลบ"
          >
            ลบ
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-7 md:px-10 py-6">
          <p
            className="text-[#333] text-[17px] md:text-[19px] whitespace-pre-wrap break-words"
            style={{ lineHeight: 2 }}
          >
            {entry.text}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
