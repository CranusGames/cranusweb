"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { games } from "@/lib/games";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }
    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 110, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, []);

  const featuredGames = games.slice(0, 8);

  return (
    <main style={{ background: "var(--bg)" }}>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.88) 100%)" }} />
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4 }} className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--accent-dim)", transformOrigin: "left" }} />
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 0.2 }} className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--accent-dim)", transformOrigin: "right" }} />

        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto w-full">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
            className="text-xs uppercase tracking-[0.4em] mb-8" style={{ color: "var(--accent)", fontFamily: "monospace" }}>
            Cranus Games Studio
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
            className="font-bold leading-none mb-6 text-center"
            style={{ fontSize: "clamp(4rem, 14vw, 11rem)", color: "var(--text)", textShadow: "0 0 80px rgba(200,169,110,0.15)", letterSpacing: "-0.02em" }}>
            CRANUS
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 1 }}
            className="mb-6" style={{ width: "120px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)" }} />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}
            className="mb-12 max-w-lg text-center leading-relaxed"
            style={{ color: "var(--text-dim)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", letterSpacing: "0.05em" }}>
            Karanlıktan doğan hikayeler.<br />Her oyun, farklı bir evrenin kapısı.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/games">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 text-sm uppercase tracking-widest border cursor-pointer transition-colors duration-300"
                style={{ borderColor: "var(--accent)", color: "var(--accent)", background: "transparent", fontFamily: "monospace" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "#050505"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}>
                Oyunları Keşfet
              </motion.button>
            </Link>
            <a href="https://cranus.itch.io/" target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 text-sm uppercase tracking-widest cursor-pointer transition-colors duration-300"
                style={{ color: "var(--text-dim)", background: "transparent", border: "1px solid #2a2a2a", fontFamily: "monospace" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-dim)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}>
                itch.io
              </motion.button>
            </a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>Aşağı Kaydır</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-8" style={{ background: "var(--accent-dim)" }} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          DIVIDER
      ════════════════════════════════════════ */}
      <div className="flex items-center justify-center py-2" style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
        <div className="mx-4 text-xs uppercase tracking-widest" style={{ color: "var(--accent-dim)", fontFamily: "monospace" }}>✦</div>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
      </div>

      {/* ════════════════════════════════════════
          FEATURED GAMES
      ════════════════════════════════════════ */}
      <section className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "var(--accent)", fontFamily: "monospace" }}>Koleksiyon</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>Son Yapımlar</h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)", margin: "0 auto" }} />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredGames.map((game, i) => (
              <motion.div key={game.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <Link href={`/games/${game.slug}`}>
                  <div className="group overflow-hidden cursor-pointer" style={{ border: "1px solid #1a1a1a", background: "#0a0a0a", transition: "border-color 0.3s, transform 0.3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-dim)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a1a"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                    <div style={{ aspectRatio: "315/250", background: "#111", overflow: "hidden", position: "relative" }}>
                      <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" loading="lazy"
                        style={{ opacity: 0.75, transition: "opacity 0.4s, transform 0.4s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.75"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 60%)" }} />
                    </div>
                    <div className="p-3 text-center">
                      <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{game.title}</p>
                      <p className="text-xs uppercase mt-1" style={{ color: "var(--accent)", fontFamily: "monospace" }}>{game.genre}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-12">
            <Link href="/games">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 text-sm uppercase tracking-widest border cursor-pointer transition-colors duration-300"
                style={{ borderColor: "#2a2a2a", color: "var(--text-dim)", background: "transparent", fontFamily: "monospace" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}>
                Tüm {games.length} Oyunu Gör →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="flex items-center justify-center py-2" style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
        <div className="mx-4 text-xs uppercase tracking-widest" style={{ color: "var(--accent-dim)", fontFamily: "monospace" }}>✦</div>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
      </div>

      {/* ════════════════════════════════════════
          PLAY STORE
      ════════════════════════════════════════ */}
      <section className="px-6 py-32" style={{ background: "#070707" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "var(--accent)", fontFamily: "monospace" }}>Mobile</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>Google Play</h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)", margin: "0 auto" }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-8 p-10"
            style={{ border: "1px solid #1a1a1a", background: "#0a0a0a" }}>
            <div style={{ border: "1px solid #2a2a2a", padding: "6px", background: "#111" }}>
              <img src="https://play-lh.googleusercontent.com/tS8rp0bZ9S4SNaryOpRr3XC92ta3osaxhPWzLTFZXFwOo2shIkpp__tUX7QWPoNy_a0MG0C8uCmNc4e831BG=w240-h480-rw"
                alt="Den Den Mushi" style={{ width: "120px", height: "120px", objectFit: "cover", display: "block" }} />
            </div>

            <div className="flex flex-col items-center text-center max-w-md">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>Android Oyunu</p>
              <h3 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>Den Den Mushi</h3>
              <div style={{ width: "40px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)", margin: "0 auto 1rem" }} />
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Ana odada sadece bir buton var. Bu butona basarsanız rastgele birisi sizi arayacak. Ama arayanlar normal insanlar değil...
              </p>
              <div className="flex items-center gap-3 mb-8">
                <span style={{ color: "var(--accent)", fontSize: "1.1rem" }}>★★★★★</span>
                <span className="text-sm" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>5.0 / 5.0</span>
              </div>
              <a href="https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi" target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 text-sm uppercase tracking-widest border cursor-pointer transition-colors duration-300"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)", background: "transparent", fontFamily: "monospace" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "#050505"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}>
                  Google Play&apos;de İndir
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="flex items-center justify-center py-2" style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
        <div className="mx-4 text-xs uppercase tracking-widest" style={{ color: "var(--accent-dim)", fontFamily: "monospace" }}>✦</div>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
      </div>

      {/* ════════════════════════════════════════
          SOSYAL MEDYA
      ════════════════════════════════════════ */}
      <section className="px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "var(--accent)", fontFamily: "monospace" }}>Takip Et</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>Sosyal Medya</h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)", margin: "0 auto" }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YouTube */}
            <motion.a href="https://www.youtube.com/@cranuss/videos" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center p-10 cursor-pointer"
              style={{ border: "1px solid #1a1a1a", background: "#0a0a0a", transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ff0000"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1a1a1a"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: "#ff0000" }}>
                <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
                  <path d="M23.5 6.2s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-.1.3C16.6 3 12 3 12 3s-4.6 0-7.3.3c-.6.1-1.9.1-3 1.3C.8 5.4.5 7.2.5 7.2S.2 9.4.2 11.6v2.1c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7 22.3 12 22.3 12 22.3s4.6 0 7.3-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.4v-2.1c0-2.2-.3-4.4-.3-4.4zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/>
                </svg>
              </div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>YouTube</p>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>@cranuss</h3>
              <div style={{ width: "40px", height: "1px", background: "linear-gradient(to right, transparent, #ff0000, transparent)", margin: "0 auto 1rem" }} />
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Oyun videoları, devlog&apos;lar ve geliştirme süreçleri.
              </p>
              <span className="text-xs uppercase tracking-widest" style={{ color: "#ff0000", fontFamily: "monospace" }}>Kanala Git →</span>
            </motion.a>

            {/* Instagram */}
            <motion.a href="https://www.instagram.com/cranusgamess/" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center text-center p-10 cursor-pointer"
              style={{ border: "1px solid #1a1a1a", background: "#0a0a0a", transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e1306c"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1a1a1a"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>Instagram</p>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>@cranusgamess</h3>
              <div style={{ width: "40px", height: "1px", background: "linear-gradient(to right, transparent, #e1306c, transparent)", margin: "0 auto 1rem" }} />
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>
                Oyun görselleri, duyurular ve anlık güncellemeler.
              </p>
              <span className="text-xs uppercase tracking-widest" style={{ color: "#e1306c", fontFamily: "monospace" }}>Profile Git →</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="flex flex-col items-center justify-center py-12 gap-4" style={{ borderTop: "1px solid #111" }}>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
        <p className="text-xs uppercase tracking-widest text-center" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>
          © 2025 Cranus Games — Tüm hakları saklıdır.
        </p>
      </footer>

    </main>
  );
}
