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
    const lines = text.split("\n").slice(0, 2);
    const preview = lines.join("\n");
    return preview.length > 120 ? preview.slice(0, 120) + "..." : preview;
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
      {/* White card container */}
      <div className="flex-1 flex flex-col bg-white m-3 md:m-5 rounded-2xl overflow-hidden">
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
          <span className="text-[#bbb] text-xs tracking-[0.15em] uppercase">
            รายการที่เก็บ
          </span>
          <div className="w-10" />
        </header>

        {entries.length > 0 && (
          <div className="px-6 pb-2">
            <span className="text-[#bbb] text-xs">{entries.length} รายการ</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
              <p className="text-[#bbb] text-sm">ยังไม่มีรายการ</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    className="bg-[#F7F7F7] rounded-xl p-5 cursor-pointer transition-colors duration-150 hover:bg-[#EFEFEF]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(entry)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#aaa] text-[11px] mb-1.5">
                          {formatDate(entry.createdAt)}
                        </p>
                        <p className="text-[#444] text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {previewText(entry.text)}
                        </p>
                      </div>
                      <button
                        className="text-[#ccc] hover:text-red-400 transition-colors p-1 shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (entry.id) handleDelete(entry.id);
                        }}
                        aria-label="ลบ"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {entries.length > 0 && (
                <div className="pt-8 pb-4 text-center">
                  <button
                    className={`text-xs cursor-pointer transition-colors ${
                      confirmDeleteAll
                        ? "text-red-400"
                        : "text-[#ccc] hover:text-red-400"
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
    </div>
  );
}
