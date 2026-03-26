"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Game, games } from "@/lib/games";

export default function GameClient({ game }: { game: Game }) {
  const itchUrl = `https://cranus.itch.io/${game.itchSlug}`;
  const embedUrl = `https://itch.io/embed-upload/${game.itchSlug}?color=050505`;

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid #111" }}
      >
        <Link
          href="/games"
          className="text-xs uppercase tracking-widest transition-colors duration-200"
          style={{ color: "var(--text-dim)", fontFamily: "monospace" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--accent)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--text-dim)")
          }
        >
          ← Oyunlar
        </Link>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--accent)", fontFamily: "monospace" }}
        >
          Cranus Games
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)", fontFamily: "monospace" }}
          >
            {game.genre}
          </p>
          <h1
            className="font-bold mb-4 leading-none"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            {game.title}
          </h1>
          <div
            className="mb-4"
            style={{
              width: "60px",
              height: "1px",
              background:
                "linear-gradient(to right, var(--accent), transparent)",
            }}
          />
          <p
            className="max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--text-dim)" }}
          >
            {game.description}
          </p>
        </motion.div>

        {/* Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
          style={{ border: "1px solid #1a1a1a" }}
        >
          <iframe
            src={embedUrl}
            allowFullScreen
            className="w-full"
            style={{ height: "600px", border: "none", display: "block" }}
            title={game.title}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <a href={itchUrl} target="_blank" rel="noopener noreferrer">
            <button
              className="px-8 py-3 text-sm uppercase tracking-widest border cursor-pointer transition-colors duration-300"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                background: "transparent",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color = "#050505";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--accent)";
              }}
            >
              itch.io&apos;da Aç
            </button>
          </a>

          <div className="flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 uppercase tracking-widest"
                style={{
                  background: "#111",
                  color: "var(--text-dim)",
                  border: "1px solid #1a1a1a",
                  fontFamily: "monospace",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Other games */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20"
        >
          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ color: "var(--text-dim)", fontFamily: "monospace" }}
          >
            Diğer Oyunlar
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {games
              .filter((g) => g.slug !== game.slug)
              .slice(0, 6)
              .map((g) => (
                <Link key={g.slug} href={`/games/${g.slug}`}>
                  <div
                    className="p-3 cursor-pointer transition-all duration-200"
                    style={{
                      border: "1px solid #1a1a1a",
                      background: "#080808",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "var(--accent-dim)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "#1a1a1a";
                    }}
                  >
                    <p
                      className="text-xs font-bold truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {g.title}
                    </p>
                    <p
                      className="text-xs mt-1 uppercase"
                      style={{
                        color: "var(--text-dim)",
                        fontFamily: "monospace",
                      }}
                    >
                      {g.genre}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
