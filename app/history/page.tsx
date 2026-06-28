"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { games } from "@/lib/games";

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

const GENRE_COLORS: Record<string, string> = {
  Horror:       "#ff4444",
  "Action RPG": "#ff6ec7",
  Action:       "#ff6ec7",
  Survival:     "#00d4ff",
  Puzzle:       "#a855f7",
  Simulation:   "#c8a96e",
  RPG:          "#ff6ec7",
  Platformer:   "#00d4ff",
  Adventure:    "#888",
};
const gc = (genre: string) => GENRE_COLORS[genre] ?? "#888";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
function formatDate(year: number, month?: number) {
  if (month) return `${MONTHS[month - 1]} ${year}`;
  return `${year}`;
}

const sorted = [...games].sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return (b.month ?? 0) - (a.month ?? 0);
});

/* ─── Centered wrapper ─────────────────────── */
const MAX_W = 900;

function GameRow({
  game,
  prevYear,
  isMobile,
}: {
  game: (typeof games)[0];
  prevYear: number | null;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const yearChanged = game.year !== prevYear;
  const color = gc(game.genre);
  const dateLabel = formatDate(game.year, game.month);

  const DATE_W  = isMobile ? 60  : 110;
  const IMG_W   = isMobile ? 100 : 220;
  const IMG_H   = isMobile ? 78  : 148;
  const GAP     = isMobile ? 14  : 28;

  return (
    <>
      {/* ── Year marker ─────────────────────────── */}
      {yearChanged && (
        <div style={{ display: "flex", alignItems: "center", gap: GAP, padding: isMobile ? "36px 0 10px" : "52px 0 14px" }}>
          <div style={{ width: DATE_W, flexShrink: 0, textAlign: "right" }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: isMobile ? "30px" : "60px",
              fontWeight: 900,
              color: "rgba(255,255,255,0.1)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              {game.year}
            </span>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(200,169,110,0.4), transparent)" }} />
        </div>
      )}

      {/* ── Game row ────────────────────────────── */}
      <a
        href={`https://cranus.itch.io/${game.itchSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: GAP,
          padding: isMobile ? "10px 8px" : "18px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          textDecoration: "none",
          background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
          borderRadius: "4px",
          margin: "0 -12px",
          transition: "background 0.2s",
        }}
      >
        {/* Date */}
        <div style={{ width: DATE_W, flexShrink: 0, textAlign: "right" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: isMobile ? "10px" : "13px",
            letterSpacing: "0.08em",
            color: hovered ? "var(--accent)" : "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}>
            {dateLabel}
          </span>
        </div>

        {/* Timeline line */}
        <div style={{
          width: "1px",
          alignSelf: "stretch",
          flexShrink: 0,
          background: hovered ? "rgba(200,169,110,0.35)" : "rgba(255,255,255,0.08)",
          transition: "background 0.2s",
        }} />

        {/* Cover */}
        <div style={{
          width: IMG_W,
          height: IMG_H,
          flexShrink: 0,
          overflow: "hidden",
          border: `1px solid ${hovered ? color + "55" : "rgba(255,255,255,0.07)"}`,
          boxShadow: hovered ? `0 0 24px ${color}33` : "none",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={game.coverImage} alt={game.title} style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            opacity: hovered ? 1 : 0.82,
            transition: "transform 0.4s ease, opacity 0.25s",
          }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontFamily: "monospace",
            fontSize: isMobile ? "15px" : "22px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: hovered ? "#fff" : "rgba(255,255,255,0.85)",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {game.title}
          </p>
          <p style={{
            margin: isMobile ? "4px 0 0" : "7px 0 0",
            fontFamily: "monospace",
            fontSize: isMobile ? "11px" : "13px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: color,
            opacity: 0.9,
          }}>
            {game.genre}
          </p>
        </div>

        {/* Arrow */}
        {!isMobile && (
          <div style={{
            flexShrink: 0,
            color: color,
            fontSize: "20px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-10px)",
            transition: "opacity 0.2s, transform 0.2s",
          }}>
            →
          </div>
        )}
      </a>
    </>
  );
}

export default function HistoryPage() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "hidden"; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const px = isMobile ? "20px" : "40px";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,5,5,0.92)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: `14px ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: "8px",
            color: "var(--text-dim)", textDecoration: "none",
            fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase",
            transition: "color 0.2s",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {isMobile ? "Back" : "Back to Main"}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "monospace" }}>
            <span style={{ fontSize: isMobile ? "12px" : "14px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--text)" }}>
              CRANUS GAMES
            </span>
            {!isMobile && (
              <>
                <span style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.15)", display: "inline-block" }} />
                <span style={{ fontSize: "12px", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase" }}>
                  {games.length} TITLES
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Title ──────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: isMobile ? `48px ${px} 28px` : `72px ${px} 40px` }}>
          <p style={{ margin: "0 0 10px", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.4em", color: "var(--accent)", textTransform: "uppercase" }}>
            Game Library
          </p>
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? "56px" : "100px",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1,
            color: "var(--text)", fontFamily: "monospace",
          }}>
            HISTORY
          </h1>
          <p style={{ margin: "14px 0 0", fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.16em", color: "var(--text-dim)", textTransform: "uppercase" }}>
            2021 — 2026 &nbsp;·&nbsp; {games.length} Games &nbsp;·&nbsp; Cranus Games Studio
          </p>
        </div>
      </div>

      {/* ── Timeline ────────────────────────────────────── */}
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: `0 ${px} 100px` }}>
        {sorted.map((game, i) => (
          <GameRow key={game.slug} game={game} prevYear={i === 0 ? null : sorted[i - 1].year} isMobile={isMobile} />
        ))}

        {/* End marker */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "14px" : "28px", paddingTop: "40px" }}>
          <div style={{ width: isMobile ? 60 : 110, flexShrink: 0, textAlign: "right" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>Start</span>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          maxWidth: MAX_W, margin: "0 auto", padding: `24px ${px}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
          fontFamily: "monospace",
        }}>
          <span style={{ fontSize: "11px", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase" }}>
            © 2021–2026 Cranus Games Studio
          </span>
          <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.18em", color: "var(--text-dim)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)")}
          >
            cranusgames.github.io/cranusweb
          </Link>
        </div>
      </div>
    </div>
  );
}
