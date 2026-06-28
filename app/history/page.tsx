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

const MAX_W   = 960;
const YEAR_W  = 88;   // left column for year label
const HEADER_H = 50;

/* ─── Single game entry ──────────────────────────── */
function GameEntry({ game, isMobile }: { game: (typeof games)[0]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const color = gc(game.genre);
  const dateStr = game.month ? MONTHS[game.month - 1] : String(game.year);
  const IMG_H = isMobile ? 160 : 300;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: isMobile ? "24px" : "36px" }}>

      {/* Dot + date — sits against the left border line */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        paddingTop: isMobile ? "20px" : "28px",
        marginLeft: "-5px",   // center the dot on the 1px border line
        gap: "6px",
      }}>
        {/* Dot */}
        <div style={{
          width: isMobile ? "8px" : "10px",
          height: isMobile ? "8px" : "10px",
          borderRadius: "50%",
          background: hovered ? "var(--accent)" : "rgba(255,255,255,0.35)",
          boxShadow: hovered ? "0 0 10px var(--accent)" : "none",
          flexShrink: 0,
          transition: "background 0.25s, box-shadow 0.25s",
          zIndex: 1,
        }} />
        {/* Horizontal connector */}
        <div style={{ width: isMobile ? "8px" : "16px", height: "1px", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
        {/* Date text */}
        <span style={{
          fontFamily: "monospace",
          fontSize: isMobile ? "9px" : "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: hovered ? "var(--accent)" : "rgba(255,255,255,0.4)",
          whiteSpace: "nowrap",
          transition: "color 0.25s",
        }}>
          {dateStr}
        </span>
        {/* Connector to image */}
        <div style={{ width: isMobile ? "8px" : "16px", height: "1px", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
      </div>

      {/* Large cover image with title overlay */}
      <a
        href={`https://cranus.itch.io/${game.itchSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ flex: 1, display: "block", textDecoration: "none", position: "relative", overflow: "hidden" }}
      >
        <div style={{
          position: "relative",
          height: IMG_H,
          overflow: "hidden",
          border: `1px solid ${hovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`,
          transition: "border-color 0.3s",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.coverImage}
            alt={game.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              opacity: hovered ? 1 : 0.85,
              transition: "transform 0.5s ease, opacity 0.3s",
              display: "block",
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          }} />

          {/* Title + genre on image */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: isMobile ? "16px 14px" : "24px 28px",
          }}>
            <p style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: isMobile ? "16px" : "26px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#ffffff",
              lineHeight: 1.1,
            }}>
              {game.title}
            </p>
            <p style={{
              margin: isMobile ? "5px 0 0" : "7px 0 0",
              fontFamily: "monospace",
              fontSize: isMobile ? "10px" : "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: color,
            }}>
              {game.genre}
            </p>
          </div>

          {/* Hover: view on itch */}
          {!isMobile && (
            <div style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}>
              itch.io →
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

/* ─── Year section ───────────────────────────────── */
function YearSection({ year, list, isMobile }: { year: number; list: typeof games; isMobile: boolean }) {
  return (
    <div style={{ display: "flex", gap: 0, marginTop: isMobile ? "48px" : "72px" }}>

      {/* Left: sticky year label */}
      <div style={{ width: YEAR_W, flexShrink: 0, paddingRight: isMobile ? "12px" : "20px", textAlign: "right" }}>
        <div style={{ position: "sticky", top: HEADER_H + 20, paddingTop: isMobile ? "10px" : "14px" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: isMobile ? "22px" : "52px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            {year}
          </span>
        </div>
      </div>

      {/* Right: vertical line + game entries */}
      <div style={{
        flex: 1,
        borderLeft: "1px solid rgba(255,255,255,0.12)",
        paddingLeft: 0,
      }}>
        {/* Year start dot */}
        <div style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 10px var(--accent)",
          marginLeft: "-5px",
          marginBottom: isMobile ? "16px" : "24px",
          marginTop: isMobile ? "10px" : "16px",
        }} />

        {list.map((game) => (
          <GameEntry key={game.slug} game={game} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────── */
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

  const px = isMobile ? "16px" : "40px";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>

      {/* ── Header ──────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, height: HEADER_H,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(5,5,5,0.93)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", width: "100%", padding: `0 ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: "8px",
            color: "#7a7470", textDecoration: "none",
            fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase",
            transition: "color 0.2s",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#7a7470")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {isMobile ? "Back" : "Back to Main"}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "monospace" }}>
            <span style={{ fontSize: isMobile ? "11px" : "13px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#d8d0c4" }}>
              CRANUS GAMES
            </span>
            {!isMobile && (
              <>
                <span style={{ width: "1px", height: "13px", background: "rgba(255,255,255,0.14)", display: "inline-block" }} />
                <span style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#7a7470", textTransform: "uppercase" }}>
                  {games.length} TITLES
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Title ───────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: isMobile ? `44px ${px} 28px` : `68px ${px} 40px` }}>
          <p style={{ margin: "0 0 10px", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.4em", color: "var(--accent)", textTransform: "uppercase" }}>
            Game Library
          </p>
          <h1 style={{ margin: 0, fontSize: isMobile ? "52px" : "96px", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "#e8e0d0", fontFamily: "monospace" }}>
            HISTORY
          </h1>
          <p style={{ margin: "14px 0 0", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#7a7470", textTransform: "uppercase" }}>
            2021 — 2026 &nbsp;·&nbsp; {games.length} Games &nbsp;·&nbsp; Cranus Games Studio
          </p>
        </div>
      </div>

      {/* ── Timeline ────────────────────────── */}
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: `0 ${px} 120px` }}>
        {yearGroups.map(({ year, list }) => (
          <YearSection key={year} year={year} list={list} isMobile={isMobile} />
        ))}
        {/* End */}
        <div style={{ display: "flex", gap: 0, marginTop: "40px" }}>
          <div style={{ width: YEAR_W, flexShrink: 0 }} />
          <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: 0 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", marginLeft: "-4px" }} />
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: `22px ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", fontFamily: "monospace" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#7a7470", textTransform: "uppercase" }}>© 2021–2026 Cranus Games Studio</span>
          <Link href="/" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#7a7470", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
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
