import { useState, useEffect, useRef } from "react";
import { db, type JournalEntry } from "../lib/db";

type FilterType = "all" | "keep" | "letgo";

// --- Icons ---

const InkStroke = () => (
  <svg viewBox="0 0 120 8" style={{ width: "60px", height: "6px", opacity: 0.18 }}>
    <path d="M2 4 Q30 1 60 4 Q90 7 118 4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
  </svg>
);

const FeatherIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, ...style }}>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

const WindIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

const AnchorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- Main Component ---

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [fadeOutId, setFadeOutId] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load entries from Dexie
  const loadEntries = async () => {
    const all = await db.entries.orderBy("createdAt").reverse().toArray();
    setEntries(all);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const addEntry = async (type: "keep" | "letgo") => {
    if (!composeText.trim()) return;
    await db.entries.add({
      text: composeText.trim(),
      type,
      createdAt: new Date(),
    });
    setComposeText("");
    setShowCompose(false);
    loadEntries();
  };

  const removeEntry = (id: number) => {
    setFadeOutId(id);
    setTimeout(async () => {
      await db.entries.delete(id);
      setFadeOutId(null);
      loadEntries();
    }, 400);
  };

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);
  const keepCount = entries.filter((e) => e.type === "keep").length;
  const letgoCount = entries.filter((e) => e.type === "letgo").length;

  useEffect(() => {
    if (showCompose && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showCompose]);

  return (
    <div className="min-h-screen pb-20">
      <div className="relative z-1 max-w-[520px] mx-auto px-5">
        {/* Header */}
        <header className="pt-12 pb-8 text-center">
          <h1 className="font-serif font-light text-[38px] tracking-[0.08em] text-[#1a1816] mb-1.5 anim-fade-slide-down">
            let go.
          </h1>
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#b5b0a8] font-normal anim-fade-slide-down" style={{ animationDelay: "0.15s" }}>
            พื้นที่สำหรับความคิดของคุณ
          </p>
          <div className="w-10 h-px bg-[#b5b0a8] mx-auto mt-4 anim-fade-in" style={{ animationDelay: "0.3s" }} />
        </header>

        {/* Stats */}
        <div className="flex justify-center gap-8 py-4 pb-6 anim-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-xs text-[#6b6560] tracking-wide">
            <AnchorIcon />
            <span className="font-serif text-[22px] font-light text-[#1a1816] leading-none">{keepCount}</span>
            <span>kept</span>
          </div>
          <div className="w-px h-5 bg-[#e8e6e1]" />
          <div className="flex items-center gap-2 text-xs text-[#6b6560] tracking-wide">
            <WindIcon />
            <span className="font-serif text-[22px] font-light text-[#1a1816] leading-none">{letgoCount}</span>
            <span>released</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-1 mb-7 anim-fade-in" style={{ animationDelay: "0.5s" }}>
          {(["all", "keep", "letgo"] as const).map((key) => (
            <button
              key={key}
              className={`px-[18px] py-2 rounded-full text-xs tracking-[0.1em] uppercase cursor-pointer border-none transition-all duration-300 ${
                filter === key
                  ? "text-[#1a1816] bg-[#fafafa] shadow-[0_1px_4px_rgba(0,0,0,0.06)] font-medium"
                  : "text-[#b5b0a8] bg-transparent hover:text-[#3a3632] hover:bg-black/[0.03]"
              }`}
              onClick={() => setFilter(key)}
            >
              {key === "all" ? "All" : key === "keep" ? "Kept" : "Let Go"}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 anim-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="mb-4 opacity-20">
              <FeatherIcon style={{ opacity: 1, width: 24, height: 24 }} />
            </div>
            <div className="font-serif text-[22px] font-light text-[#3a3632] mb-2">
              {filter === "all"
                ? "เริ่มเขียนความคิดของคุณ"
                : filter === "keep"
                ? "ยังไม่มีสิ่งที่เก็บไว้"
                : "ยังไม่มีสิ่งที่ปล่อยไป"}
            </div>
            <div className="text-[13px] text-[#b5b0a8]">
              {filter === "all"
                ? "กดปุ่ม + เพื่อเริ่มต้น"
                : "เริ่มเขียนแล้วเลือกสิ่งที่ต้องการ"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filtered.map((entry, i) => (
              <div
                key={entry.id}
                className={`bg-[#fafafa] rounded-xl px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] border border-black/[0.03] relative transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07),0_8px_24px_rgba(0,0,0,0.05)] hover:-translate-y-px anim-card-in group ${
                  fadeOutId === entry.id ? "!opacity-0 !-translate-y-2 !scale-[0.97]" : ""
                }`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Type bar */}
                <div
                  className={`absolute top-3 left-3 w-[3px] h-6 rounded-full opacity-50 ${
                    entry.type === "keep" ? "bg-[#2a2a2a]" : "bg-[#9e9890]"
                  }`}
                />

                {/* Card header */}
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-full ${
                      entry.type === "keep"
                        ? "text-[#1a1816] bg-black/5"
                        : "text-[#6b6560] bg-black/[0.03]"
                    }`}
                  >
                    {entry.type === "keep" ? <><AnchorIcon /> Keep</> : <><WindIcon /> Let Go</>}
                  </span>
                  <button
                    className="bg-transparent border-none cursor-pointer text-[#b5b0a8] p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:text-[#3a3632] hover:bg-black/[0.04] flex items-center justify-center"
                    onClick={() => entry.id && removeEntry(entry.id)}
                  >
                    <XIcon size={13} />
                  </button>
                </div>

                {/* Card text */}
                <div
                  className={`font-serif text-[18px] leading-[1.65] mb-3.5 ${
                    entry.type === "keep"
                      ? "text-[#1a1816] not-italic"
                      : "text-[#3a3632] italic"
                  }`}
                >
                  {entry.type === "letgo" && <QuoteIcon />}
                  {entry.text}
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#b5b0a8] tracking-wide">
                    {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                  </span>
                  <InkStroke />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        className={`fixed bottom-7 right-[calc(50%-240px)] w-[52px] h-[52px] rounded-full bg-[#1a1816] text-[#fafafa] border-none cursor-pointer flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 anim-fade-in hover:scale-105 hover:shadow-[0_6px_24px_rgba(0,0,0,0.24)] max-[560px]:right-6 ${
          showCompose ? "rotate-45 bg-[#3a3632]" : ""
        }`}
        style={{ animationDelay: "0.7s" }}
        onClick={() => setShowCompose(!showCompose)}
      >
        <PlusIcon />
      </button>

      {/* Compose Modal */}
      {showCompose && (
        <div
          className="fixed inset-0 bg-[#1a1816]/30 backdrop-blur-sm z-40 flex items-end justify-center anim-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCompose(false);
          }}
        >
          <div className="bg-[#fafafa] rounded-t-[20px] w-full max-w-[520px] px-6 pt-7 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.1)] anim-slide-up">
            {/* Compose header */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-serif text-xl text-[#1a1816] flex items-center gap-2">
                <FeatherIcon style={{ opacity: 0.5 }} />
                เขียนความคิดของคุณ
              </span>
              <button
                className="bg-transparent border-none cursor-pointer text-[#b5b0a8] p-1 flex transition-colors duration-200 hover:text-[#3a3632]"
                onClick={() => setShowCompose(false)}
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="w-full min-h-[120px] border border-[#e8e6e1] rounded-[10px] p-4 font-serif text-[17px] leading-[1.6] text-[#3a3632] resize-y bg-[#f3f2ef] transition-all duration-300 focus:border-[#b5b0a8] focus:bg-[#fafafa]"
              value={composeText}
              onChange={(e) => setComposeText(e.target.value)}
              placeholder="สิ่งที่อยู่ในใจตอนนี้..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addEntry("keep");
              }}
            />

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-[18px]">
              <button
                className="flex-1 py-3.5 px-5 border-none rounded-[10px] cursor-pointer text-[13px] tracking-[0.12em] uppercase font-medium transition-all duration-[250ms] flex items-center justify-center gap-2 bg-[#e8e6e1] text-[#6b6560] hover:bg-[#b5b0a8] hover:text-white hover:-translate-y-px disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!composeText.trim()}
                onClick={() => addEntry("letgo")}
              >
                <WindIcon /> Let Go
              </button>
              <button
                className="flex-1 py-3.5 px-5 border-none rounded-[10px] cursor-pointer text-[13px] tracking-[0.12em] uppercase font-medium transition-all duration-[250ms] flex items-center justify-center gap-2 bg-[#1a1816] text-[#fafafa] hover:bg-[#3a3632] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!composeText.trim()}
                onClick={() => addEntry("keep")}
              >
                <AnchorIcon /> Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
