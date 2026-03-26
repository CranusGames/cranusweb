"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { games } from "@/lib/games";

export default function GamesPage() {
  return (
    <main className="min-h-screen px-6 py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <Link
            href="/"
            className="text-xs uppercase tracking-widest mb-6 inline-block transition-colors duration-200"
            style={{ color: "var(--text-dim)", fontFamily: "monospace" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)")
            }
          >
            ← Ana Sayfa
          </Link>
          <h1
            className="text-6xl md:text-8xl font-bold mb-4"
            style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
          >
            OYUNLAR
          </h1>
          <div
            className="mx-auto mb-4"
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--accent), transparent)",
            }}
          />
          <p
            className="text-sm uppercase tracking-widest"
            style={{ color: "var(--text-dim)", fontFamily: "monospace" }}
          >
            {games.length} Oyun
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((game, i) => (
            <motion.div
              key={game.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <Link href={`/games/${game.slug}`}>
                <div
                  className="group relative overflow-hidden cursor-pointer"
                  style={{
                    border: "1px solid #1a1a1a",
                    background: "#0a0a0a",
                    transition: "border-color 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-dim)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a1a";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Cover image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "315/250", background: "#111" }}
                  >
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover"
                      style={{ transition: "opacity 0.5s, transform 0.5s", opacity: 0.75 }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = "1";
                        (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = "0.75";
                        (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                      }}
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 60%)",
                      }}
                    />
                    <span
                      className="absolute top-3 right-3 text-xs px-2 py-1 uppercase tracking-widest"
                      style={{
                        background: "rgba(0,0,0,0.8)",
                        color: "var(--accent)",
                        fontFamily: "monospace",
                        border: "1px solid var(--accent-dim)",
                      }}
                    >
                      {game.genre}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2
                      className="font-bold text-base mb-1 leading-tight"
                      style={{ color: "var(--text)" }}
                    >
                      {game.title}
                    </h2>
                    <p
                      className="text-xs leading-relaxed line-clamp-2"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {game.description}
                    </p>
                    <div className="mt-3">
                      <span
                        className="text-xs uppercase tracking-widest"
                        style={{ color: "var(--accent)", fontFamily: "monospace" }}
                      >
                        Oyna →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
