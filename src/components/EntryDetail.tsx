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
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          className="text-secondary hover:text-white transition-colors text-2xl p-2 cursor-pointer"
          onClick={onBack}
          aria-label="กลับ"
        >
          ←
        </button>
        <span className="text-secondary text-xs">
          {formatDate(entry.createdAt)}
        </span>
        <button
          className="text-secondary hover:text-red-400 transition-colors p-2 text-sm cursor-pointer"
          onClick={onDelete}
          aria-label="ลบ"
        >
          ลบ
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-text text-lg leading-relaxed whitespace-pre-wrap break-words"
           style={{ lineHeight: 1.8 }}>
          {entry.text}
        </p>
      </div>
    </div>
  );
}
