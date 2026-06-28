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

// Flat list newest → oldest (by year desc, then month desc within year)
const sorted = [...games].sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return (b.month ?? 0) - (a.month ?? 0);
});

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

  return (
    <>
      {/* Year marker — only when year changes */}
      {yearChanged && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "32px",
            padding: isMobile ? "36px 0 12px" : "56px 0 16px",
          }}
        >
          {/* Year label */}
          <div
            style={{
              width: isMobile ? "52px" : "120px",
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "28px" : "56px",
                fontWeight: 900,
                color: "rgba(255,255,255,0.12)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {game.year}
            </span>
          </div>

          {/* Timeline dot + line */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          </div>

          {/* Year divider line */}
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(200,169,110,0.4), transparent)" }} />
        </div>
      )}

      {/* Game row */}
      <a
        href={`https://cranus.itch.io/${game.itchSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "12px" : "32px",
          padding: isMobile ? "12px 0" : "20px 0",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          textDecoration: "none",
          cursor: "pointer",
          transition: "background 0.2s",
          background: hovered ? "rgba(255,255,255,0.02)" : "transparent",
          borderRadius: "4px",
          marginLeft: isMobile ? "-8px" : "-16px",
          paddingLeft: isMobile ? "8px" : "16px",
          paddingRight: isMobile ? "8px" : "16px",
        }}
      >
        {/* Left: date label */}
        <div style={{ width: isMobile ? "52px" : "120px", flexShrink: 0, textAlign: "right" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: isMobile ? "8px" : "10px",
            letterSpacing: "0.12em",
            color: hovered ? "var(--accent)" : "rgba(255,255,255,0.22)",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}>
            {dateLabel}
          </span>
        </div>

        {/* Timeline line */}
        <div
          style={{
            width: "1px",
            alignSelf: "stretch",
            background: hovered ? "rgba(200,169,110,0.3)" : "rgba(255,255,255,0.07)",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        />

        {/* Cover image */}
        <div
          style={{
            width: isMobile ? "80px" : "200px",
            height: isMobile ? "64px" : "130px",
            flexShrink: 0,
            overflow: "hidden",
            border: `1px solid ${hovered ? color + "66" : "rgba(255,255,255,0.06)"}`,
            transition: "border-color 0.25s, box-shadow 0.25s",
            boxShadow: hovered ? `0 0 20px ${color}33` : "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.coverImage}
            alt={game.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease, opacity 0.25s",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              opacity: hovered ? 1 : 0.8,
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: isMobile ? "13px" : "18px",
              fontWeight: 700,
              letterSpacing: isMobile ? "0.04em" : "0.06em",
              textTransform: "uppercase",
              color: hovered ? "#fff" : "rgba(255,255,255,0.8)",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {game.title}
          </p>
          <p
            style={{
              margin: isMobile ? "3px 0 0" : "6px 0 0",
              fontFamily: "monospace",
              fontSize: isMobile ? "9px" : "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: color,
              opacity: 0.85,
            }}
          >
            {game.genre}
          </p>
          {!isMobile && (
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              {game.year} · itch.io →
            </p>
          )}
        </div>

        {/* Arrow on hover */}
        {!isMobile && (
          <div
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(-8px)",
              transition: "opacity 0.2s, transform 0.2s",
              color: color,
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "14px 20px" : "18px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(5,5,5,0.92)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-dim)",
            textDecoration: "none",
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
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

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontFamily: "monospace" }}>
          <span style={{ fontSize: isMobile ? "11px" : "13px", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text)" }}>
            CRANUS GAMES
          </span>
          {!isMobile && (
            <>
              <span style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.15)", display: "inline-block" }} />
              <span style={{ fontSize: "11px", letterSpacing: "0.2em", color: "var(--text-dim)", textTransform: "uppercase" }}>
                {games.length} TITLES
              </span>
            </>
          )}
        </div>
      </header>

      {/* ── Page Title ─────────────────────────────────────── */}
      <div
        style={{
          padding: isMobile ? "48px 20px 24px" : "80px 48px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p style={{ margin: "0 0 10px", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.4em", color: "var(--accent)", textTransform: "uppercase" }}>
          Game Library
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? "56px" : "108px",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "var(--text)",
            fontFamily: "monospace",
          }}
        >
          HISTORY
        </h1>
        <p style={{ margin: "14px 0 0", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.18em", color: "var(--text-dim)", textTransform: "uppercase" }}>
          2021 — 2026 &nbsp;·&nbsp; {games.length} Games &nbsp;·&nbsp; Cranus Games Studio
        </p>
      </div>

      {/* ── Timeline ───────────────────────────────────────── */}
      <div style={{ padding: isMobile ? "0 20px 80px" : "0 48px 120px" }}>
        {sorted.map((game, i) => (
          <GameRow
            key={game.slug}
            game={game}
            prevYear={i === 0 ? null : sorted[i - 1].year}
            isMobile={isMobile}
          />
        ))}

        {/* End of timeline */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "32px", paddingTop: "40px" }}>
          <div style={{ width: isMobile ? "52px" : "120px", flexShrink: 0, textAlign: "right" }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
              Origin
            </span>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: isMobile ? "24px 20px" : "28px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontFamily: "monospace",
        }}
      >
        <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--text-dim)", textTransform: "uppercase" }}>
          © 2021–2026 Cranus Games Studio
        </span>
        <Link
          href="/"
          style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--text-dim)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)")}
        >
          cranusgames.github.io/cranusweb
        </Link>
      </div>
    </div>
  );
}
