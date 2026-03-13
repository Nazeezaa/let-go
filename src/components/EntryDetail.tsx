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
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <header className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <button
          className="text-muted hover:text-white transition-colors p-1.5 -ml-1.5 cursor-pointer"
          onClick={onBack}
          aria-label="กลับ"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-muted text-[11px] font-light">
          {formatDate(entry.createdAt)}
        </span>
        <button
          className="text-muted/50 hover:text-red-400/70 transition-colors p-1.5 -mr-1.5 text-[12px] cursor-pointer font-light"
          onClick={onDelete}
          aria-label="ลบ"
        >
          ลบ
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
        <p
          className="text-text/85 text-[17px] md:text-[19px] whitespace-pre-wrap break-words font-light"
          style={{ lineHeight: 2 }}
        >
          {entry.text}
        </p>
      </div>
    </motion.div>
  );
}
