import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BreathingCircle from "./BreathingCircle";
import LetGoButton from "./LetGoButton";
import KeepButton from "./KeepButton";
import { db } from "../lib/db";

interface Props {
  mode: "letgo" | "keep";
  onBack: () => void;
  onArchive?: () => void;
}

export default function WritingPage({ mode, onBack, onArchive }: Props) {
  const [text, setText] = useState("");
  const [dissolving, setDissolving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasText = text.trim().length > 0;

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && hasText && !dissolving) {
        e.preventDefault();
        handleAction();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 1800);
  };

  const handleAction = useCallback(async () => {
    if (!hasText || dissolving) return;

    if (mode === "letgo") {
      setDissolving(true);
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => {
        setText("");
        setDissolving(false);
        showFeedback("ปล่อยไปแล้ว");
        textareaRef.current?.focus();
      }, 2500);
    } else {
      await db.entries.add({ text: text.trim(), createdAt: new Date() });
      if (navigator.vibrate) navigator.vibrate(30);
      setText("");
      showFeedback("เก็บไว้แล้ว");
      textareaRef.current?.focus();
    }
  }, [hasText, dissolving, mode, text]);

  return (
    <div className="h-full flex flex-col">
      {/* White card container */}
      <div className="flex-1 flex flex-col bg-white m-3 md:m-5 rounded-2xl overflow-hidden relative">
        {/* Header */}
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
            {mode === "letgo" ? "ระบายทิ้ง" : "เก็บไว้"}
          </span>

          {mode === "keep" && onArchive ? (
            <button
              className="w-10 h-10 flex items-center justify-center text-[#bbb] hover:text-black transition-colors cursor-pointer rounded-full hover:bg-black/5"
              onClick={onArchive}
              aria-label="Archive"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </button>
          ) : (
            <div className="w-10" />
          )}
        </header>

        {/* Writing area */}
        <div className="flex-1 relative px-7 md:px-10 pt-2 pb-2 overflow-hidden">
          <BreathingCircle visible={!hasText && !dissolving && !feedback} />

          <AnimatePresence>
            {dissolving && (
              <motion.div
                className="absolute inset-0 px-7 md:px-10 pt-2 text-lg text-[#333] whitespace-pre-wrap"
                style={{ lineHeight: 1.9 }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 2.5, ease: "easeOut" }}
              >
                {text}
              </motion.div>
            )}
          </AnimatePresence>

          {!dissolving && (
            <textarea
              ref={textareaRef}
              className="w-full h-full bg-transparent text-[#222] resize-none text-lg"
              style={{ lineHeight: 1.9 }}
              placeholder="เขียนอะไรก็ได้..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}
        </div>

        {/* Action button */}
        <div className="flex justify-center py-5 shrink-0">
          {mode === "letgo" ? (
            <LetGoButton visible={hasText && !dissolving} onLetGo={handleAction} />
          ) : (
            <KeepButton visible={hasText} onKeep={handleAction} />
          )}
        </div>

        {/* Feedback toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black rounded-full px-6 py-3">
                <span className="text-white text-sm">{feedback}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
