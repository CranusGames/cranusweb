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
  Adventure:    "var(--text-dim)",
};

function genreColor(genre: string) {
  return GENRE_COLORS[genre] ?? "var(--text-dim)";
}

// Group games by year, newest first
const grouped = games.reduce<Record<number, typeof games>>((acc, g) => {
  if (!acc[g.year]) acc[g.year] = [];
  acc[g.year].push(g);
  return acc;
}, {});
const yearGroups = Object.entries(grouped)
  .sort(([a], [b]) => Number(b) - Number(a))
  .map(([year, list]) => ({ year: Number(year), list }));

function GameCard({ game, isMobile }: { game: (typeof games)[0]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const color = genreColor(game.genre);

  return (
    <a
      href={`https://cranus.itch.io/${game.itchSlug}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Image container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "79%", // 315:250 aspect ratio
          overflow: "hidden",
          background: "#0a0a0a",
          border: `1px solid ${hovered ? color : "rgba(255,255,255,0.07)"}`,
          transition: "border-color 0.3s ease",
          boxShadow: hovered ? `0 0 24px ${color}33` : "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.coverImage}
          alt={game.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease, opacity 0.3s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            opacity: hovered ? 1 : 0.85,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)"
              : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            transition: "background 0.3s ease",
          }}
        />
        {/* Genre badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: "3px 8px",
            background: "rgba(0,0,0,0.75)",
            border: `1px solid ${color}55`,
            color: color,
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            backdropFilter: "blur(4px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {game.genre}
        </div>
      </div>

      {/* Title */}
      <div style={{ paddingTop: "12px" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "monospace",
            fontSize: isMobile ? "11px" : "12px",
            letterSpacing: "0.05em",
            color: hovered ? "var(--text)" : "rgba(255,255,255,0.75)",
            transition: "color 0.2s ease",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {game.title}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: color,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {game.genre}
        </p>
      </div>
    </a>
  );
}

export default function HistoryPage() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cols = isMobile ? 2 : 4;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "monospace",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: isMobile ? "11px" : "13px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--text)",
            }}
          >
            CRANUS GAMES
          </span>
          {!isMobile && (
            <span
              style={{
                width: "1px",
                height: "14px",
                background: "rgba(255,255,255,0.15)",
                display: "inline-block",
              }}
            />
          )}
          {!isMobile && (
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "var(--text-dim)",
                textTransform: "uppercase",
              }}
            >
              {games.length} TITLES
            </span>
          )}
        </div>
      </header>

      {/* ── Page Title ─────────────────────────────── */}
      <div
        style={{
          padding: isMobile ? "48px 20px 32px" : "80px 48px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "10px",
            letterSpacing: "0.4em",
            color: "var(--accent)",
            textTransform: "uppercase",
          }}
        >
          Game Library
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? "52px" : "96px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "var(--text)",
            fontFamily: "monospace",
          }}
        >
          HISTORY
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: "12px",
            letterSpacing: "0.15em",
            color: "var(--text-dim)",
            textTransform: "uppercase",
          }}
        >
          2021 — 2026 &nbsp;·&nbsp; {games.length} Games &nbsp;·&nbsp; Cranus Games Studio
        </p>
      </div>

      {/* ── Year Sections ──────────────────────────── */}
      <div style={{ padding: isMobile ? "0 20px 80px" : "0 48px 120px" }}>
        {yearGroups.map(({ year, list }, yi) => (
          <div
            key={year}
            style={{
              paddingTop: isMobile ? "48px" : "72px",
              borderTop: yi === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
              marginTop: yi === 0 ? "0" : "0",
            }}
          >
            {/* Year row */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: isMobile ? "16px" : "24px",
                marginBottom: isMobile ? "28px" : "40px",
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "48px" : "80px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "rgba(255,255,255,0.08)",
                  lineHeight: 1,
                  userSelect: "none",
                  fontFamily: "monospace",
                }}
              >
                {year}
              </span>
              <div
                style={{
                  height: "1px",
                  flex: 1,
                  background: "linear-gradient(to right, rgba(200,169,110,0.3), transparent)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {list.length} {list.length === 1 ? "title" : "titles"}
              </span>
            </div>

            {/* Game grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: isMobile ? "20px 16px" : "32px 24px",
              }}
            >
              {list.map((game) => (
                <GameCard key={game.slug} game={game} isMobile={isMobile} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: isMobile ? "24px 20px" : "32px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "var(--text-dim)", textTransform: "uppercase" }}>
          © 2021–2026 Cranus Games Studio
        </span>
        <Link
          href="/"
          style={{
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "var(--text-dim)",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)")}
        >
          cranusgames.github.io/cranusweb
        </Link>
      </div>
    </div>
  );
}
