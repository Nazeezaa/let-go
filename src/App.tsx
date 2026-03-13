import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./components/Landing";
import WritingPage from "./components/WritingPage";
import Archive from "./components/Archive";

type Screen = "landing" | "writing" | "archive";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [mode, setMode] = useState<"letgo" | "keep">("letgo");

  const handleSelect = (m: "letgo" | "keep") => {
    setMode(m);
    setScreen("writing");
  };

  return (
    <div className="h-full w-full bg-bg">
      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <motion.div
            key="landing"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Landing onSelect={handleSelect} />
          </motion.div>
        )}

        {screen === "writing" && (
          <motion.div
            key="writing"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WritingPage
              mode={mode}
              onBack={() => setScreen("landing")}
              onArchive={mode === "keep" ? () => setScreen("archive") : undefined}
            />
          </motion.div>
        )}

        {screen === "archive" && (
          <motion.div
            key="archive"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Archive onBack={() => setScreen("writing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
