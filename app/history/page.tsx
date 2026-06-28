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
  Adventure:    "#aaa",
};
const gc = (genre: string) => GENRE_COLORS[genre] ?? "#aaa";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Group by year, newest first; within each year sort by month desc
const yearGroups = Object.entries(
  games.reduce<Record<number, typeof games>>((acc, g) => {
    if (!acc[g.year]) acc[g.year] = [];
    acc[g.year].push(g);
    return acc;
  }, {})
)
  .sort(([a], [b]) => Number(b) - Number(a))
  .map(([year, list]) => ({
    year: Number(year),
    list: [...list].sort((a, b) => (b.month ?? 0) - (a.month ?? 0)),
  }));

const MAX_W = 920;
const HEADER_H = 50; // sticky header height

/* ─── Single game entry ─────────────────────────── */
function GameEntry({ game, isMobile }: { game: (typeof games)[0]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const color = gc(game.genre);
  const dateStr = game.month ? `${MONTHS[game.month - 1]} ${game.year}` : null;

  const IMG_W = isMobile ? 96 : 210;
  const IMG_H = isMobile ? 74 : 142;

  return (
    <a
      href={`https://cranus.itch.io/${game.itchSlug}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "14px" : "24px",
        padding: isMobile ? "12px 8px" : "20px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        textDecoration: "none",
        background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
        borderRadius: "4px",
        margin: "0 -12px",
        transition: "background 0.2s",
      }}
    >
      {/* Cover */}
      <div style={{
        width: IMG_W, height: IMG_H, flexShrink: 0, overflow: "hidden",
        border: `1px solid ${hovered ? color + "66" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hovered ? `0 0 28px ${color}44` : "none",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.coverImage} alt={game.title} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          opacity: hovered ? 1 : 0.88,
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
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: hovered ? "#ffffff" : "#d8d0c4",
          transition: "color 0.2s",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {game.title}
        </p>
        <p style={{
          margin: isMobile ? "5px 0 0" : "7px 0 0",
          fontFamily: "monospace",
          fontSize: isMobile ? "11px" : "13px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: color,
        }}>
          {game.genre}
        </p>
        {dateStr && !isMobile && (
          <p style={{
            margin: "6px 0 0",
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}>
            {dateStr}
          </p>
        )}
      </div>

      {/* Arrow */}
      {!isMobile && (
        <div style={{
          flexShrink: 0, color: color, fontSize: "20px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-10px)",
          transition: "opacity 0.2s, transform 0.2s",
        }}>
          →
        </div>
      )}
    </a>
  );
}

/* ─── Year section with sticky label ───────────── */
function YearSection({ year, list, isMobile }: { year: number; list: (typeof games); isMobile: boolean }) {
  const YEAR_W = isMobile ? 44 : 100;
  const GAP    = isMobile ? 12 : 28;

  return (
    <div style={{ display: "flex", gap: GAP, marginTop: isMobile ? "44px" : "64px" }}>

      {/* Left: sticky year */}
      <div style={{ width: YEAR_W, flexShrink: 0 }}>
        <div style={{
          position: "sticky",
          top: HEADER_H + 16,
          textAlign: "right",
          paddingTop: isMobile ? "10px" : "18px",
        }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: isMobile ? "20px" : "52px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            writingMode: isMobile ? "vertical-rl" : "horizontal-tb",
          }}>
            {year}
          </span>
        </div>
      </div>

      {/* Middle: timeline line + dot */}
      <div style={{ position: "relative", flexShrink: 0, width: "1px" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.1)" }} />
        <div style={{
          position: "sticky",
          top: HEADER_H + 28,
          width: "9px", height: "9px",
          borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 10px var(--accent)",
          marginLeft: "-4px",
        }} />
      </div>

      {/* Right: games */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {list.map((game) => (
          <GameEntry key={game.slug} game={game} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────── */
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

      {/* ── Header ──────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, height: HEADER_H,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(5,5,5,0.93)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", width: "100%", padding: `0 ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: "8px",
            color: "#8a8480", textDecoration: "none",
            fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase",
            transition: "color 0.2s",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#8a8480")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {isMobile ? "Back" : "Back to Main"}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "monospace" }}>
            <span style={{ fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#d8d0c4" }}>
              CRANUS GAMES
            </span>
            {!isMobile && (
              <>
                <span style={{ width: "1px", height: "13px", background: "rgba(255,255,255,0.15)", display: "inline-block" }} />
                <span style={{ fontSize: "12px", letterSpacing: "0.18em", color: "#8a8480", textTransform: "uppercase" }}>
                  {games.length} TITLES
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Title ──────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: isMobile ? `44px ${px} 28px` : `68px ${px} 40px` }}>
          <p style={{ margin: "0 0 10px", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.4em", color: "var(--accent)", textTransform: "uppercase" }}>
            Game Library
          </p>
          <h1 style={{
            margin: 0, fontSize: isMobile ? "52px" : "96px",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1,
            color: "#e8e0d0", fontFamily: "monospace",
          }}>
            HISTORY
          </h1>
          <p style={{ margin: "14px 0 0", fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.16em", color: "#7a7470", textTransform: "uppercase" }}>
            2021 — 2026 &nbsp;·&nbsp; {games.length} Games &nbsp;·&nbsp; Cranus Games Studio
          </p>
        </div>
      </div>

      {/* ── Timeline ────────────────────────────── */}
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: `0 ${px} 120px` }}>
        {yearGroups.map(({ year, list }) => (
          <YearSection key={year} year={year} list={list} isMobile={isMobile} />
        ))}

        {/* End dot */}
        <div style={{ display: "flex", gap: isMobile ? "12px" : "28px", alignItems: "center", marginTop: "48px" }}>
          <div style={{ width: isMobile ? 44 : 100, flexShrink: 0 }} />
          <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", flexShrink: 0, marginLeft: "-4px" }} />
          <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            Origin
          </span>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          maxWidth: MAX_W, margin: "0 auto", padding: `22px ${px}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
          fontFamily: "monospace",
        }}>
          <span style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#7a7470", textTransform: "uppercase" }}>
            © 2021–2026 Cranus Games Studio
          </span>
          <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#7a7470", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#7a7470")}
          >
            cranusgames.github.io/cranusweb
          </Link>
        </div>
      </div>
    </div>
  );
}
