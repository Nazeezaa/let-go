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
    <div className="h-full flex flex-col relative">
      {/* Header */}
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

        <span className="text-muted text-[11px] tracking-[0.2em] uppercase font-light">
          {mode === "letgo" ? "ระบายทิ้ง" : "เก็บไว้"}
        </span>

        {mode === "keep" && onArchive ? (
          <button
            className="text-muted hover:text-white transition-colors p-1.5 -mr-1.5 cursor-pointer"
            onClick={onArchive}
            aria-label="Archive"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </button>
        ) : (
          <div className="w-8" />
        )}
      </header>

      {/* Writing area */}
      <div className="flex-1 relative px-6 md:px-10 pb-4 overflow-hidden">
        <BreathingCircle visible={!hasText && !dissolving && !feedback} />

        <AnimatePresence>
          {dissolving && (
            <motion.div
              className="absolute inset-0 px-6 md:px-10 pt-2 text-[17px] md:text-[19px] text-text whitespace-pre-wrap font-light"
              style={{ lineHeight: 2 }}
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
            className="w-full h-full bg-transparent text-white/90 resize-none text-[17px] md:text-[19px] font-light"
            style={{ lineHeight: 2 }}
            placeholder="เขียนอะไรก็ได้..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </div>

      {/* Action button */}
      <div className="flex justify-center pb-10 pt-3 shrink-0">
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-white/50 text-base font-light tracking-wide">
              {feedback}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
