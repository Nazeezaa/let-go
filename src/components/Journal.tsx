import { useState, useEffect, useRef } from "react";
import { db, type JournalEntry } from "../lib/db";

// --- Icons ---

const InkStroke = () => (
  <svg viewBox="0 0 120 8" style={{ width: "60px", height: "6px", opacity: 0.18 }}>
    <path d="M2 4 Q30 1 60 4 Q90 7 118 4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const FeatherIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
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

// --- Styles ---

const styles = {
  root: {
    minHeight: "100vh",
    background: "var(--off-white)",
    fontFamily: "'DM Sans', 'IBM Plex Sans Thai', sans-serif",
    color: "var(--charcoal)",
    padding: "0 0 80px",
    position: "relative" as const,
    overflowX: "hidden" as const,
  },
  content: {
    position: "relative" as const,
    zIndex: 1,
    maxWidth: 600,
    margin: "0 auto",
    padding: "0 20px",
  },
  header: {
    padding: "48px 0 32px",
    textAlign: "center" as const,
  },
  headerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontSize: 64,
    letterSpacing: "0.08em",
    color: "var(--black)",
    marginBottom: 6,
    opacity: 0,
    animation: "fadeSlideDown 0.8s ease forwards",
  },
  headerSub: {
    fontSize: 15,
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: "var(--mid-gray)",
    fontWeight: 400,
    opacity: 0,
    animation: "fadeSlideDown 0.8s ease 0.15s forwards",
  },
  headerLine: {
    width: 48,
    height: 1,
    background: "var(--mid-gray)",
    margin: "16px auto 0",
    opacity: 0,
    animation: "fadeIn 1s ease 0.3s forwards",
  },
  statsBar: {
    display: "flex",
    justifyContent: "center",
    gap: 32,
    padding: "16px 0 24px",
    opacity: 0,
    animation: "fadeIn 0.8s ease 0.4s forwards",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "var(--dark-gray)",
    letterSpacing: "0.04em",
  },
  statNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32,
    fontWeight: 300,
    color: "var(--black)",
    lineHeight: 1,
  },
  statDivider: {
    width: 1,
    height: 20,
    background: "var(--light-gray)",
  },
  filterBar: {
    display: "flex",
    justifyContent: "center",
    gap: 4,
    marginBottom: 28,
    opacity: 0,
    animation: "fadeIn 0.8s ease 0.5s forwards",
  },
  filterBtn: {
    background: "none",
    border: "none",
    padding: "10px 22px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--mid-gray)",
    cursor: "pointer",
    borderRadius: 100,
    transition: "all 0.3s ease",
    fontWeight: 400,
  },
  filterBtnActive: {
    color: "var(--black)",
    background: "var(--white)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    fontWeight: 500,
  },
  card: {
    background: "var(--white)",
    borderRadius: 14,
    padding: "28px 28px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
    position: "relative" as const,
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: 0,
    animation: "cardIn 0.5s ease forwards",
    border: "1px solid rgba(0,0,0,0.03)",
  },
  cardFadeOut: {
    opacity: 0,
    transform: "translateY(-8px) scale(0.97)",
    transition: "all 0.4s ease",
  },
  cardTypeBar: {
    position: "absolute" as const,
    top: 12,
    left: 12,
    width: 3,
    height: 24,
    borderRadius: 3,
    opacity: 0.5,
    background: "#2a2a2a",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 100,
  },
  cardDelete: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--mid-gray)",
    padding: 4,
    borderRadius: 6,
    transition: "all 0.2s",
    opacity: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 21,
    lineHeight: 1.7,
    color: "var(--charcoal)",
    fontWeight: 400,
    marginBottom: 14,
    fontStyle: "italic" as const,
  },
  cardTextKeep: {
    fontStyle: "normal" as const,
    color: "var(--black)",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardDate: {
    fontSize: 12,
    color: "var(--mid-gray)",
    letterSpacing: "0.04em",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    opacity: 0,
    animation: "fadeIn 0.8s ease 0.3s forwards",
  },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 26,
    fontWeight: 300,
    color: "var(--charcoal)",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 15,
    color: "var(--mid-gray)",
  },
  fab: {
    position: "fixed" as const,
    bottom: 28,
    right: "calc(50% - 280px)",
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--black)",
    color: "var(--white)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 50,
    opacity: 0,
    animation: "fadeIn 0.6s ease 0.7s forwards",
  },
  fabOpen: {
    transform: "rotate(45deg)",
    background: "var(--charcoal)",
  },
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(26, 24, 22, 0.3)",
    backdropFilter: "blur(8px)",
    zIndex: 40,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    animation: "fadeIn 0.25s ease",
  },
  composeCard: {
    background: "var(--white)",
    borderRadius: "20px 20px 0 0",
    width: "100%",
    maxWidth: 600,
    padding: "28px 24px 32px",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.1)",
    animation: "slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  composeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  composeTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 24,
    fontWeight: 400,
    color: "var(--black)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  composeClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--mid-gray)",
    padding: 4,
    display: "flex",
    transition: "color 0.2s",
  },
  composeTextarea: {
    width: "100%",
    minHeight: 140,
    border: "1px solid var(--light-gray)",
    borderRadius: 12,
    padding: 18,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 19,
    lineHeight: 1.6,
    color: "var(--charcoal)",
    resize: "vertical" as const,
    outline: "none",
    background: "var(--off-white)",
    transition: "border-color 0.3s, background 0.3s",
  },
  composeActions: {
    display: "flex",
    gap: 10,
    marginTop: 18,
  },
  actionBtn: {
    flex: 1,
    padding: "16px 20px",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
    transition: "all 0.25s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  keepBtn: {
    background: "var(--black)",
    color: "var(--white)",
  },
  letgoBtn: {
    background: "var(--light-gray)",
    color: "var(--dark-gray)",
  },
} as const;

// --- CSS Variables + Keyframes injected once ---

const cssVars = `
  :root {
    --white: #fafafa;
    --off-white: #f3f2ef;
    --light-gray: #e8e6e1;
    --mid-gray: #b5b0a8;
    --dark-gray: #6b6560;
    --charcoal: #3a3632;
    --black: #1a1816;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .card:hover .card-delete-btn { opacity: 1 !important; }
  .card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05); transform: translateY(-1px); }
  .card-delete-btn:hover { color: var(--charcoal); background: rgba(0,0,0,0.04); }
  .filter-btn:hover { color: var(--charcoal); background: rgba(0,0,0,0.03); }
  .fab-btn:hover { transform: scale(1.06); box-shadow: 0 6px 24px rgba(0,0,0,0.24); }
  .fab-btn.open:hover { transform: rotate(45deg) scale(1.06); }
  .compose-close:hover { color: var(--charcoal); }
  .compose-textarea:focus { border-color: var(--mid-gray); background: var(--white); }
  .action-btn-keep:hover:not(:disabled) { background: var(--charcoal); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .action-btn-letgo:hover:not(:disabled) { background: var(--mid-gray); color: white; transform: translateY(-1px); }
  .action-btn-keep:disabled, .action-btn-letgo:disabled { opacity: 0.35; cursor: not-allowed; }
  @media (max-width: 560px) {
    .fab-btn { right: 24px !important; }
  }
`;

// --- Main Component ---

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  // no filter needed — letgo entries are never saved
  const [fadeOutId, setFadeOutId] = useState<number | null>(null);
  const [letGoTotal, setLetgoCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadEntries = async () => {
    const all = await db.entries.orderBy("createdAt").reverse().toArray();
    setEntries(all);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(date);

  const addEntry = async (type: "keep" | "letgo") => {
    if (!composeText.trim()) return;
    if (type === "keep") {
      await db.entries.add({ text: composeText.trim(), type, createdAt: new Date() });
    }
    // letgo: don't save — just let it disappear
    setComposeText("");
    setShowCompose(false);
    setLetgoCount((c) => (type === "letgo" ? c + 1 : c));
    if (type === "keep") loadEntries();
  };

  const removeEntry = (id: number) => {
    setFadeOutId(id);
    setTimeout(async () => {
      await db.entries.delete(id);
      setFadeOutId(null);
      loadEntries();
    }, 400);
  };

  const filtered = entries; // all kept entries (letgo entries are never stored)
  const keepCount = entries.length;

  useEffect(() => {
    if (showCompose && textareaRef.current) textareaRef.current.focus();
  }, [showCompose]);

  return (
    <>
      <style>{cssVars}</style>
      <div style={styles.root}>
        <div style={styles.content}>
          {/* Header */}
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>let go.</h1>
            <p style={styles.headerSub}>พื้นที่สำหรับความคิดของคุณ</p>
            <div style={styles.headerLine} />
          </header>

          {/* Stats */}
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <AnchorIcon />
              <span style={styles.statNum}>{keepCount}</span>
              <span>kept</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <WindIcon />
              <span style={styles.statNum}>{letGoTotal}</span>
              <span>released</span>
            </div>
          </div>

          {/* Cards / Empty */}
          {filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "center", opacity: 0.2 }}>
                <FeatherIcon size={28} />
              </div>
              <div style={styles.emptyTitle}>เริ่มเขียนความคิดของคุณ</div>
              <div style={styles.emptySub}>กดปุ่ม + เพื่อเริ่มต้น</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map((entry, i) => (
                <div
                  key={entry.id}
                  className="card"
                  style={{
                    ...styles.card,
                    ...(fadeOutId === entry.id ? styles.cardFadeOut : {}),
                    animationDelay: `${i * 0.06}s`,
                  }}
                >
                  <div style={styles.cardTypeBar} />
                  <div style={styles.cardHeader}>
                    <span style={{ ...styles.cardTag, color: "var(--black)", background: "rgba(0,0,0,0.05)" }}>
                      <AnchorIcon /> Kept
                    </span>
                    <button
                      className="card-delete-btn"
                      style={styles.cardDelete}
                      onClick={() => entry.id && removeEntry(entry.id)}
                    >
                      <XIcon size={13} />
                    </button>
                  </div>
                  <div style={{ ...styles.cardText, ...styles.cardTextKeep }}>
                    {entry.text}
                  </div>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardDate}>{formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}</span>
                    <InkStroke />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAB */}
        <button
          className={`fab-btn ${showCompose ? "open" : ""}`}
          style={{
            ...styles.fab,
            ...(showCompose ? styles.fabOpen : {}),
          }}
          onClick={() => setShowCompose(!showCompose)}
        >
          <PlusIcon />
        </button>

        {/* Compose Modal */}
        {showCompose && (
          <div
            style={styles.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCompose(false); }}
          >
            <div style={styles.composeCard}>
              <div style={styles.composeHeader}>
                <span style={styles.composeTitle}>
                  <FeatherIcon /> เขียนความคิดของคุณ
                </span>
                <button className="compose-close" style={styles.composeClose} onClick={() => setShowCompose(false)}>
                  <XIcon size={18} />
                </button>
              </div>
              <textarea
                ref={textareaRef}
                className="compose-textarea"
                style={styles.composeTextarea}
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="สิ่งที่อยู่ในใจตอนนี้..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addEntry("keep");
                }}
              />
              <div style={styles.composeActions}>
                <button
                  className="action-btn-letgo"
                  style={{ ...styles.actionBtn, ...styles.letgoBtn }}
                  disabled={!composeText.trim()}
                  onClick={() => addEntry("letgo")}
                >
                  <WindIcon /> Let Go
                </button>
                <button
                  className="action-btn-keep"
                  style={{ ...styles.actionBtn, ...styles.keepBtn }}
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
    </>
  );
}
