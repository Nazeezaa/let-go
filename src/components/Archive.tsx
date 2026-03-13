import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, type JournalEntry } from "../lib/db";
import EntryDetail from "./EntryDetail";

interface Props {
  onBack: () => void;
}

export default function Archive({ onBack }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const loadEntries = async () => {
    const all = await db.entries.orderBy("createdAt").reverse().toArray();
    setEntries(all);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("ลบรายการนี้?")) return;
    await db.entries.delete(id);
    if (selected?.id === id) setSelected(null);
    loadEntries();
  };

  const handleDeleteAll = async () => {
    if (!confirmDeleteAll) {
      setConfirmDeleteAll(true);
      return;
    }
    await db.entries.clear();
    setEntries([]);
    setConfirmDeleteAll(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const previewText = (text: string) => {
    const lines = text.split("\n").slice(0, 3);
    const preview = lines.join("\n");
    return preview.length > 150 ? preview.slice(0, 150) + "..." : preview;
  };

  if (selected) {
    return (
      <EntryDetail
        entry={selected}
        onBack={() => setSelected(null)}
        onDelete={() => {
          if (selected.id) handleDelete(selected.id);
        }}
      />
    );
  }

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
        <span className="text-secondary text-xs tracking-widest uppercase">
          รายการที่เก็บ
        </span>
        <div className="w-10" />
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-secondary text-sm">ยังไม่มีรายการ</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  className="bg-[#111111] border border-border rounded-xl p-4 cursor-pointer hover:border-white/30 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setSelected(entry)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary text-xs mb-2">
                        {formatDate(entry.createdAt)}
                      </p>
                      <p className="text-text text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {previewText(entry.text)}
                      </p>
                    </div>
                    <button
                      className="text-secondary hover:text-red-400 transition-colors p-1 shrink-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (entry.id) handleDelete(entry.id);
                      }}
                      aria-label="ลบ"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Delete all */}
            {entries.length > 0 && (
              <div className="pt-8 pb-4 text-center">
                <button
                  className={`text-xs cursor-pointer transition-colors ${
                    confirmDeleteAll
                      ? "text-red-400"
                      : "text-secondary hover:text-red-400"
                  }`}
                  onClick={handleDeleteAll}
                >
                  {confirmDeleteAll
                    ? "กดอีกครั้งเพื่อยืนยันลบทั้งหมด"
                    : "ลบทั้งหมด"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
