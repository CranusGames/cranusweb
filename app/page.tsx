"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { games } from "@/lib/games";

/* ─── Typewriter Hook ─────────────────────────────────────── */
function useTypewriter(words: string[], speed = 75, pauseMs = 2200) {
  const [displayed, setDisplayed] = useState("");
  const state = useRef({ word: 0, char: 0, deleting: false, paused: false });

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = state.current;
      const current = words[s.word % words.length];
      if (s.paused) {
        s.paused = false;
        s.deleting = true;
        id = setTimeout(tick, speed);
        return;
      }
      if (!s.deleting) {
        s.char++;
        setDisplayed(current.slice(0, s.char));
        if (s.char === current.length) {
          s.paused = true;
          id = setTimeout(tick, pauseMs);
        } else {
          id = setTimeout(tick, speed);
        }
      } else {
        s.char--;
        setDisplayed(current.slice(0, s.char));
        if (s.char === 0) {
          s.deleting = false;
          s.word = (s.word + 1) % words.length;
        }
        id = setTimeout(tick, speed / 2);
      }
    };
    id = setTimeout(tick, 1200);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

/* ─── Shared UI ───────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center justify-center py-2" style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111" }}>
      <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
      <div className="mx-4 text-xs uppercase tracking-widest" style={{ color: "var(--accent-dim)", fontFamily: "monospace" }}>✦</div>
      <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
    </div>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
      className="flex flex-col items-center text-center">
      <p className="text-xs uppercase tracking-[0.45em] mb-3" style={{ color: "var(--accent)", fontFamily: "monospace" }}>{label}</p>
      <h2 className="font-bold mb-4" style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>{title}</h2>
      <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)" }} />
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* 3-D tilt on photo */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(sx, [-400, 400], [-18, 18]);
  const rotateX = useTransform(sy, [-400, 400], [14, -14]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - (rect.left + rect.width / 2));
    my.set(e.clientY - (rect.top + rect.height / 2));
  };
  const handleHeroMouseLeave = () => { mx.set(0); my.set(0); };

  /* Typewriter */
  const title = useTypewriter(["Indie Game Developer", "Unity Developer", "Game Designer", "Creative Developer"]);

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    type P = { x: number; y: number; r: number; dx: number; dy: number; a: number; c: string };
    const cols = ["rgba(200,169,110,", "rgba(240,200,120,", "rgba(170,130,70,"];
    const pts: P[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -Math.random() * 0.45 - 0.08,
      a: Math.random() * 0.65 + 0.15,
      c: cols[Math.floor(Math.random() * cols.length)],
    }));

    let id: number;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.c}${p.a})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -2) { p.y = canvas.height + 2; p.x = Math.random() * canvas.width; }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  const featuredGames = games.slice(0, 9);

  const skills = ["Unity", "C#", "Blender", "Game Design", "Pixel Art", "Level Design", "Narrative", "UI/UX", "Horror", "Survival"];

  return (
    <main style={{ background: "var(--bg)" }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.85 }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.9) 100%)" }} />

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)" }} />

        {/* Border lines */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6 }}
          className="absolute top-0 left-0 right-0 h-px" style={{ background: "var(--accent-dim)", transformOrigin: "left" }} />
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--accent-dim)", transformOrigin: "right" }} />

        <div className="relative z-10 flex flex-col items-center px-6 max-w-5xl mx-auto w-full">

          {/* Studio tag */}
          <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="text-xs uppercase tracking-[0.55em] mb-10" style={{ color: "var(--accent)", fontFamily: "monospace" }}>
            Cranus Games Studio
          </motion.p>

          {/* ── Photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.6, type: "spring", stiffness: 90, damping: 14 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "800px" }}
            className="relative mb-10 select-none"
          >
            {/* Pulsing glow behind */}
            <div className="absolute rounded-full" style={{ inset: "-20px", borderRadius: "50%", animation: "pulse-glow 3s ease-in-out infinite" }} />

            {/* Outer rotating ring */}
            <div className="absolute" style={{ inset: "-24px", borderRadius: "50%", border: "1px dashed rgba(200,169,110,0.45)", animation: "spin-slow 14s linear infinite" }} />

            {/* Middle counter-ring */}
            <div className="absolute" style={{ inset: "-36px", borderRadius: "50%", border: "1px solid rgba(200,169,110,0.18)", animation: "spin-slow 24s linear infinite reverse" }} />

            {/* Inner solid ring */}
            <div className="absolute" style={{ inset: "-5px", borderRadius: "50%", border: "2px solid var(--accent)" }} />

            {/* Photo */}
            <div style={{ width: 210, height: 210, borderRadius: "50%", overflow: "hidden", position: "relative", boxShadow: "0 0 0 2px rgba(200,169,110,0.2)" }}>
              <img src="/cranusweb/foto.jpeg" alt="Emirhan Aycib" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>

            {/* Shine */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 55%)", borderRadius: "50%" }} />
          </motion.div>

          {/* Name */}
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}
            className="font-bold mb-3"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)", color: "var(--text)", letterSpacing: "-0.02em", textShadow: "0 0 80px rgba(200,169,110,0.28)" }}>
            EMİRHAN AYCİBİN
          </motion.h1>

          {/* Typewriter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="flex items-center justify-center mb-8 h-7">
            <span className="text-base tracking-[0.3em]" style={{ color: "var(--accent)", fontFamily: "monospace" }}>
              {title}<span style={{ animation: "blink-cursor 1.1s step-end infinite" }}>|</span>
            </span>
          </motion.div>

          {/* Divider line */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 1.6 }}
            className="mb-10" style={{ width: "90px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), transparent)" }} />

          {/* Social icons */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.8 }}
            className="flex items-center gap-8 mb-10 flex-wrap justify-center">
            {[
              { href: "https://cranus.itch.io/", label: "itch.io", sym: "⚡" },
              { href: "https://www.youtube.com/@cranuss/videos", label: "YouTube", sym: "▶" },
              { href: "https://www.instagram.com/cranusgamess/", label: "Instagram", sym: "◈" },
              { href: "https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi", label: "Play Store", sym: "◉" },
            ].map((s) => (
              <motion.a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.18, y: -4 }} whileTap={{ scale: 0.93 }}
                className="flex flex-col items-center gap-1.5">
                <span className="text-xl transition-colors duration-300" style={{ color: "var(--accent-dim)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-dim)")}>
                  {s.sym}
                </span>
                <span style={{ color: "var(--text-dim)", fontFamily: "monospace", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {s.label}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/games">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="px-10 py-4 text-sm uppercase tracking-widest border cursor-pointer"
                style={{ borderColor: "var(--accent)", color: "var(--accent)", background: "transparent", fontFamily: "monospace", transition: "all 0.3s" }}
                onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "var(--accent)"; b.style.color = "#050505"; }}
                onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "var(--accent)"; }}>
                Oyunları Keşfet
              </motion.button>
            </Link>
            <a href="https://cranus.itch.io/" target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="px-10 py-4 text-sm uppercase tracking-widest cursor-pointer"
                style={{ color: "var(--text-dim)", background: "transparent", border: "1px solid #2a2a2a", fontFamily: "monospace", transition: "all 0.3s" }}
                onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "var(--text-dim)"; b.style.color = "var(--text)"; }}
                onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#2a2a2a"; b.style.color = "var(--text-dim)"; }}>
                itch.io →
              </motion.button>
            </a>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>Aşağı Kaydır</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="w-px h-8" style={{ background: "var(--accent-dim)" }} />
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section className="px-6 py-28" style={{ background: "#060606" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="Hakkımda" title="Kim Olduğum" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20 items-start">

            {/* Bio + Stats */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <p className="leading-relaxed mb-5" style={{ color: "var(--text-dim)", fontSize: "1.05rem", lineHeight: 1.85 }}>
                Karanlık atmosferler, derin hikayeler ve yaratıcı oyun mekanikleri üzerine çalışan bağımsız bir oyun geliştiriciyim.
                Cranus Games çatısı altında 30&apos;u aşkın oyun yayınladım.
              </p>
              <p className="leading-relaxed" style={{ color: "var(--text-dim)", fontSize: "1.05rem", lineHeight: 1.85 }}>
                Horror, adventure ve survival türlerine özel bir tutkum var. Her proje, farklı bir evrenin kapısını aralıyor.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  { num: "30+", label: "Oyun" },
                  { num: "3+", label: "Yıl" },
                  { num: "∞", label: "Fikir" },
                ].map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex flex-col items-center p-5 text-center"
                    style={{ border: "1px solid #1a1a1a", background: "#0a0a0a" }}>
                    <span className="text-3xl font-bold mb-1" style={{ color: "var(--accent)", textShadow: "0 0 20px rgba(200,169,110,0.4)" }}>{s.num}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}>
              <p className="text-xs uppercase tracking-[0.45em] mb-8" style={{ color: "var(--accent)", fontFamily: "monospace" }}>Araçlar &amp; Yetenekler</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span key={skill}
                    initial={{ opacity: 0, scale: 0.75 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 text-xs uppercase tracking-wider cursor-default"
                    style={{ border: "1px solid #252525", color: "var(--text-dim)", fontFamily: "monospace", transition: "all 0.25s" }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)"; el.style.background = "rgba(200,169,110,0.06)"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#252525"; el.style.color = "var(--text-dim)"; el.style.background = "transparent"; }}>
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════ */}
      <section className="px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="Koleksiyon" title="Projeler" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-16">
            {featuredGames.map((game, i) => (
              <motion.div key={game.slug}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <Link href={`/games/${game.slug}`}>
                  <motion.div whileHover={{ y: -7 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="group overflow-hidden cursor-pointer relative"
                    style={{ border: "1px solid #1a1a1a", background: "#0a0a0a" }}>

                    <div style={{ aspectRatio: "315/250", background: "#111", overflow: "hidden", position: "relative" }}>
                      <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover"
                        loading="lazy"
                        style={{ opacity: 0.72, transition: "opacity 0.4s, transform 0.55s" }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLImageElement; el.style.opacity = "1"; el.style.transform = "scale(1.09)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLImageElement; el.style.opacity = "0.72"; el.style.transform = "scale(1)"; }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 60%)" }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "rgba(200,169,110,0.04)" }}>
                        <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "monospace" }}>İncele →</span>
                      </div>
                    </div>

                    <div className="p-3 text-center">
                      <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{game.title}</p>
                      <p className="text-xs uppercase mt-1" style={{ color: "var(--accent)", fontFamily: "monospace" }}>{game.genre}</p>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ borderTop: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)" }} />
                    <div className="absolute bottom-0 right-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ borderBottom: "1px solid var(--accent)", borderRight: "1px solid var(--accent)" }} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mt-14">
            <Link href="/games">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 text-sm uppercase tracking-widest border cursor-pointer"
                style={{ borderColor: "#2a2a2a", color: "var(--text-dim)", background: "transparent", fontFamily: "monospace", transition: "all 0.3s" }}
                onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "var(--accent)"; b.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#2a2a2a"; b.style.color = "var(--text-dim)"; }}>
                Tüm {games.length} Oyunu Gör →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          PLAY STORE
      ══════════════════════════════════════ */}
      <section className="px-6 py-28" style={{ background: "#070707" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader label="Mobile" title="Google Play" />

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-8 p-10 mt-16"
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
                  className="px-10 py-4 text-sm uppercase tracking-widest border cursor-pointer"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)", background: "transparent", fontFamily: "monospace", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "var(--accent)"; b.style.color = "#050505"; }}
                  onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "var(--accent)"; }}>
                  Google Play&apos;de İndir
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          SOSYAL MEDYA
      ══════════════════════════════════════ */}
      <section className="px-6 py-28">
        <div className="max-w-4xl mx-auto">
          <SectionHeader label="Takip Et" title="Sosyal Medya" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {/* YouTube */}
            <motion.a href="https://www.youtube.com/@cranuss/videos" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center p-10 cursor-pointer"
              style={{ border: "1px solid #1a1a1a", background: "#0a0a0a", transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#ff0000"; el.style.transform = "translateY(-5px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#1a1a1a"; el.style.transform = "translateY(0)"; }}>
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
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#e1306c"; el.style.transform = "translateY(-5px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#1a1a1a"; el.style.transform = "translateY(0)"; }}>
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

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="flex flex-col items-center justify-center py-12 gap-4" style={{ borderTop: "1px solid #111" }}>
        <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
        <p className="text-xs uppercase tracking-widest text-center" style={{ color: "var(--text-dim)", fontFamily: "monospace" }}>
          © 2025 Emirhan Aycib — Cranus Games
        </p>
      </footer>
    </main>
  );
}
