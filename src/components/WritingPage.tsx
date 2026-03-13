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
    textareaRef.current?.focus();
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
    setTimeout(() => {
      setFeedback(null);
    }, 1500);
  };

  const handleAction = useCallback(async () => {
    if (!hasText || dissolving) return;

    if (mode === "letgo") {
      setDissolving(true);
      // Haptic feedback if supported
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
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          className="text-secondary hover:text-white transition-colors text-2xl p-2 cursor-pointer"
          onClick={onBack}
          aria-label="กลับ"
        >
          ←
        </button>
        <span className="text-secondary text-xs tracking-widest uppercase">
          {mode === "letgo" ? "ระบายทิ้ง" : "เก็บไว้"}
        </span>
        {mode === "keep" && onArchive ? (
          <button
            className="text-secondary hover:text-white transition-colors p-2 cursor-pointer"
            onClick={onArchive}
            aria-label="Archive"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Writing area */}
      <div className="flex-1 relative px-4 pb-4 overflow-hidden">
        <BreathingCircle visible={!hasText && !dissolving && !feedback} />

        <AnimatePresence>
          {dissolving && (
            <motion.div
              className="absolute inset-0 px-4 pt-2 text-lg leading-relaxed text-text whitespace-pre-wrap"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0, y: -30, filter: "blur(6px)" }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              {text}
            </motion.div>
          )}
        </AnimatePresence>

        {!dissolving && (
          <textarea
            ref={textareaRef}
            className="w-full h-full bg-transparent text-white resize-none text-lg md:text-xl leading-relaxed"
            style={{ lineHeight: 1.8 }}
            placeholder="เขียนอะไรก็ได้..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </div>

      {/* Action button */}
      <div className="flex justify-center pb-8 pt-2 shrink-0">
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
            transition={{ duration: 0.4 }}
          >
            <span className="text-white/70 text-lg font-light">{feedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
