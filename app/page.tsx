"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { games } from "@/lib/games";

/* ─── Typewriter ─────────────────────────────────────────── */
function useTypewriter(words: string[], speed = 75, pauseMs = 2200) {
  const [displayed, setDisplayed] = useState("");
  const s = useRef({ word: 0, char: 0, del: false, paused: false });
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const st = s.current;
      const cur = words[st.word % words.length];
      if (st.paused) { st.paused = false; st.del = true; id = setTimeout(tick, speed); return; }
      if (!st.del) {
        st.char++; setDisplayed(cur.slice(0, st.char));
        if (st.char === cur.length) { st.paused = true; id = setTimeout(tick, pauseMs); }
        else id = setTimeout(tick, speed);
      } else {
        st.char--; setDisplayed(cur.slice(0, st.char));
        if (st.char === 0) { st.del = false; st.word = (st.word + 1) % words.length; }
        id = setTimeout(tick, speed / 2);
      }
    };
    id = setTimeout(tick, 1400);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line
  return displayed;
}

/* ─── Synthwave Grid ─────────────────────────────────────── */
function SynthGrid({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <div style={{ position: "absolute", [flip ? "top" : "bottom"]: 0, left: 0, right: 0, height: "50%", overflow: "hidden", pointerEvents: "none", transform: flip ? "scaleY(-1)" : undefined }}>
      <div style={{
        position: "absolute", bottom: 0, left: "-60%", right: "-60%", height: "220%",
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "70px 70px",
        transform: "perspective(500px) rotateX(65deg)",
        transformOrigin: "bottom center",
      }} />
    </div>
  );
}

/* ─── Nav Dots ───────────────────────────────────────────── */
const SECTIONS = ["Hero", "Biyografi", "Oyunlar", "Bağlantı"];
const COLORS   = ["var(--accent)", "#ff6ec7", "#00d4ff", "#ff0080"];

function NavDots({ active }: { active: number }) {
  return (
    <div style={{ position: "fixed", right: "1.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 200, display: "flex", flexDirection: "column", gap: "14px" }}>
      {SECTIONS.map((_, i) => (
        <button key={i} onClick={() => {
          const el = document.getElementById(`section-${i}`);
          el?.scrollIntoView({ behavior: "smooth" });
        }}
          title={SECTIONS[i]}
          style={{ width: active === i ? "28px" : "8px", height: "8px", borderRadius: "4px", border: "none", cursor: "pointer", padding: 0,
            background: active === i ? COLORS[i] : "#2a2a2a", transition: "all 0.4s", boxShadow: active === i ? `0 0 12px ${COLORS[i]}` : "none" }} />
      ))}
    </div>
  );
}

/* ─── GitHub Calendar ───────────────────────────────────── */
type ContribDay = { date: string; count: number; level: number };

function GitHubCalendar({ username, year }: { username: string; year: number }) {
  const [weeks, setWeeks] = useState<ContribDay[][]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`)
      .then(r => r.json())
      .then(data => {
        const contribs: ContribDay[] = data.contributions;
        setTotal(data.total?.[year] ?? 0);
        const ws: ContribDay[][] = [];
        let week: ContribDay[] = [];
        contribs.forEach((d, i) => {
          const dow = new Date(d.date).getDay();
          if (i === 0 && dow > 0) for (let k = 0; k < dow; k++) week.push({ date: "", count: 0, level: 0 });
          week.push(d);
          if (week.length === 7) { ws.push(week); week = []; }
        });
        if (week.length > 0) ws.push(week);
        setWeeks(ws);
      })
      .catch(() => {});
  }, [username, year]);

  const COLORS = [
    "rgba(121,40,202,0.1)",
    "rgba(121,40,202,0.35)",
    "rgba(121,40,202,0.6)",
    "rgba(255,110,200,0.7)",
    "#ff6ec7",
  ];

  if (weeks.length === 0) return (
    <div style={{ textAlign: "center", padding: "1rem", color: "rgba(220,200,230,0.4)", fontFamily: "monospace", fontSize: "0.65rem" }}>
      YÜKLENİYOR...
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
        <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(220,200,230,0.4)", fontFamily: "monospace" }}>
          GitHub · {year} katkıları
        </span>
        <span style={{ fontSize: "0.75rem", color: "#ff6ec7", fontFamily: "monospace", textShadow: "0 0 12px rgba(255,110,200,0.5)" }}>
          {total.toLocaleString()} commit
        </span>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
        <div style={{ display: "flex", gap: "3px", minWidth: "max-content" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {week.map((day, di) => (
                <div key={di}
                  title={day.date ? `${day.date}: ${day.count} commit` : ""}
                  style={{
                    width: "10px", height: "10px",
                    background: COLORS[day.level] ?? COLORS[0],
                    borderRadius: "2px",
                    transition: "transform 0.12s",
                    cursor: day.count > 0 ? "crosshair" : "default",
                  }}
                  onMouseEnter={e => { if (day.count > 0) (e.currentTarget as HTMLElement).style.transform = "scale(1.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px", alignItems: "center", marginTop: "8px" }}>
        <span style={{ fontSize: "0.52rem", color: "rgba(220,200,230,0.35)", fontFamily: "monospace" }}>az</span>
        {COLORS.map((c, i) => <div key={i} style={{ width: "8px", height: "8px", background: c, borderRadius: "2px" }} />)}
        <span style={{ fontSize: "0.52rem", color: "rgba(220,200,230,0.35)", fontFamily: "monospace" }}>çok</span>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bioCanvasRef = useRef<HTMLCanvasElement>(null);
  const arcadeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [photoHovered, setPhotoHovered] = useState(false);

  /* Mouse → 3-D tilt */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });
  const rotY = useTransform(sx, [-600, 600], [-16, 16]);
  const rotX = useTransform(sy, [-600, 600], [12, -12]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX - window.innerWidth / 2);
      my.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  /* Particles */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    type P = { x: number; y: number; r: number; dx: number; dy: number; a: number; c: string };
    const cols = ["rgba(200,169,110,", "rgba(255,110,200,", "rgba(0,212,255,", "rgba(121,40,202,"];
    const pts: P[] = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2, dx: (Math.random() - 0.5) * 0.3, dy: -Math.random() * 0.45 - 0.06,
      a: Math.random() * 0.6 + 0.12, c: cols[Math.floor(Math.random() * cols.length)],
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

  /* Bio code rain */
  useEffect(() => {
    const canvas = bioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const chars = "01アイウエオカキ!@#%^&*<>{}[]ΨΩ∞";
    const fontSize = 13;
    const drops: number[] = [];
    const initDrops = () => {
      const cols = Math.floor(window.innerWidth / fontSize);
      drops.length = 0;
      for (let i = 0; i < cols; i++) drops.push(Math.floor(Math.random() * window.innerHeight / fontSize));
    };
    initDrops();
    let id: number;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(12,0,24,0.13)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cols = Math.floor(canvas.width / fontSize);
      for (let i = 0; i < cols; i++) {
        if (drops[i] === undefined) drops[i] = 0;
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const isHead = Math.random() > 0.85;
        ctx.font = `${isHead ? "bold " : ""}${fontSize}px monospace`;
        ctx.fillStyle = isHead ? "#ff6ec7" : "rgba(121,40,202,0.6)";
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) drops[i] = 0;
        else drops[i]++;
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    const handleResize = () => { resize(); initDrops(); };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", handleResize); };
  }, []);

  /* Arcade — Space Invader sprites + bullets + sparks */
  useEffect(() => {
    const canvas = arcadeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const SP_A = [
      [0,0,1,0,0,0,1,0,0],
      [1,0,0,1,0,1,0,0,1],
      [1,0,1,1,1,1,1,0,1],
      [1,1,1,0,1,0,1,1,1],
      [1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,0],
      [0,0,1,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,1,0],
    ];
    const SP_B = [
      [0,0,0,1,1,1,0,0,0],
      [0,1,1,1,1,1,1,1,0],
      [1,1,0,1,1,1,0,1,1],
      [1,1,1,1,1,1,1,1,1],
      [0,0,1,0,1,0,1,0,0],
      [0,1,0,1,0,1,0,1,0],
      [1,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0],
    ];
    const SP_C = [
      [0,1,0,0,1,0,0,1,0],
      [0,0,1,0,1,0,1,0,0],
      [0,0,1,1,1,1,1,0,0],
      [0,1,1,0,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1],
      [1,0,1,1,1,1,1,0,1],
      [0,0,1,0,0,0,1,0,0],
      [0,1,0,1,0,1,0,1,0],
    ];

    const palette = ["#00ffff","#ff00ff","#ffff00","#00ff88","#ff6ec7"];
    const spritePool = [SP_A, SP_B, SP_C];

    type Inv = { x:number; y:number; vx:number; sprite:number[][]; color:string; sc:number };
    const invaders: Inv[] = [];
    const ROWS = 4, PER = 7;

    for (let r = 0; r < ROWS; r++) {
      const sc = r < 2 ? 4 : 3;
      const spr = spritePool[r % spritePool.length];
      const sw = spr[0].length * sc;
      const gap = (canvas.width - PER * sw) / (PER + 1);
      const vx = (r % 2 === 0 ? 0.5 : -0.5);
      for (let c = 0; c < PER; c++) {
        invaders.push({
          x: gap + c * (sw + gap),
          y: (r + 1) * (canvas.height / (ROWS + 2)),
          vx, sprite: spr, color: palette[r % palette.length], sc,
        });
      }
    }

    type Bullet = { x:number; y:number };
    type Spark  = { x:number; y:number; vx:number; vy:number; life:number; c:string };
    const bullets: Bullet[] = [];
    const sparks:  Spark[]  = [];
    let lastShot = 0;

    let id: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0,13,26,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      invaders.forEach(inv => {
        inv.x += inv.vx;
        const sw = inv.sprite[0].length * inv.sc;
        if (inv.x > canvas.width + 20) inv.x = -sw;
        if (inv.x < -sw - 20)          inv.x = canvas.width + 20;
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = inv.color;
        inv.sprite.forEach((row, ry) =>
          row.forEach((px, rx) => {
            if (px) ctx.fillRect(
              Math.floor(inv.x + rx * inv.sc),
              Math.floor(inv.y + ry * inv.sc),
              inv.sc, inv.sc);
          })
        );
      });

      const now = Date.now();
      if (now - lastShot > 400 && invaders.length) {
        const s = invaders[Math.floor(Math.random() * invaders.length)];
        bullets.push({ x: s.x + (s.sprite[0].length * s.sc) / 2, y: s.y + s.sprite.length * s.sc });
        lastShot = now;
      }

      ctx.fillStyle = "#ffff44";
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y += 5;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(Math.floor(b.x - 1), Math.floor(b.y), 3, 10);
        if (b.y > canvas.height) {
          for (let s = 0; s < 8; s++)
            sparks.push({ x: b.x, y: canvas.height - 8,
              vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1,
              life: 1, c: palette[Math.floor(Math.random() * palette.length)] });
          bullets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= 0.035;
        ctx.globalAlpha = Math.max(0, s.life * 0.85);
        ctx.fillStyle = s.c;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 4, 4);
        if (s.life <= 0) sparks.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);

  /* Intersection → active dot */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx));
      });
    }, { threshold: 0.55 });
    for (let i = 0; i < 4; i++) {
      const el = document.getElementById(`section-${i}`);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const title = useTypewriter(["Indie Game Developer", "Unity Developer", "Game Designer", "Creative Developer"]);
  const featured = games.slice(0, 12);
  const skills = ["Unity", "C#", "Blender", "Game Design", "Pixel Art", "Level Design", "Narrative", "UI/UX"];

  const scrollTo = (i: number) => document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
      <NavDots active={active} />

      {/* ════════════════════════════════════════
          BOYUT 0 — HERO
      ════════════════════════════════════════ */}
      <section id="section-0" data-idx="0"
        style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center" }}>

        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.9 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.92) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px)", pointerEvents: "none" }} />
        <SynthGrid color="rgba(121,40,202,0.2)" />

        {/* Border lines */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, var(--accent), #ff6ec7, transparent)", transformOrigin: "left" }} />
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, delay: 0.3 }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #7928ca, #ff6ec7, transparent)", transformOrigin: "right" }} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px", maxWidth: "860px", margin: "0 auto", width: "100%" }}>

          <motion.p initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
            style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.55em", color: "var(--accent)", fontFamily: "monospace", marginBottom: "2.5rem" }}>
            Cranus Games Studio
          </motion.p>

          {/* ── Photo + 3-D tilt + Coin flip ── */}
          <motion.div initial={{ opacity: 0, scale: 0.35 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.6, type: "spring", stiffness: 85, damping: 13 }}
            style={{ marginBottom: "2.2rem" }}>
            <div style={{ perspective: "1000px" }}>
              <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className="select-none">
                <div
                  onMouseEnter={() => setPhotoHovered(true)}
                  onMouseLeave={() => setPhotoHovered(false)}
                  style={{ position: "relative", display: "inline-block", transformStyle: "preserve-3d", cursor: "pointer" }}>
                  {/* Glow */}
                  <div style={{ position: "absolute", inset: "-22px", borderRadius: "50%", animation: "pulse-glow 3.2s ease-in-out infinite", pointerEvents: "none" }} />
                  {/* Outer dashed ring */}
                  <div style={{ position: "absolute", inset: "-28px", borderRadius: "50%", border: "1px dashed rgba(200,169,110,0.5)", animation: "spin-slow 14s linear infinite", pointerEvents: "none" }} />
                  {/* Outer glow ring */}
                  <div style={{ position: "absolute", inset: "-40px", borderRadius: "50%", border: "1px solid rgba(255,110,200,0.22)", animation: "spin-slow 22s linear infinite reverse", pointerEvents: "none" }} />
                  {/* Solid gradient ring */}
                  <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", padding: "2px", background: "linear-gradient(135deg, var(--accent), #ff6ec7, #7928ca)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
                  {/* Coin flip card — pointer-events none, parent handles hover */}
                  <div
                    style={{
                      width: 200, height: 200,
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.75s cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: photoHovered ? "rotateY(180deg)" : "rotateY(0deg)",
                      pointerEvents: "none",
                    }}
                  >
                    {/* Front: Photo */}
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
                      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                    }}>
                      <img src="/cranusweb/foto.jpeg" alt="Emirhan Aycibin"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 55%)", pointerEvents: "none" }} />
                    </div>
                    {/* Back: Duck GIF — sürekli çalışır, hover'da görünür */}
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
                      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}>
                      <img src="/cranusweb/duck.gif" alt="🦆"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}
            style={{ fontSize: "clamp(1.9rem, 5vw, 4.8rem)", fontWeight: "bold", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.6rem",
              textShadow: "0 0 60px rgba(200,169,110,0.3), 0 0 120px rgba(121,40,202,0.2)" }}>
            EMİRHAN AYCİBİN
          </motion.h1>

          {/* Typewriter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
            style={{ height: "26px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.4rem" }}>
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.3em", color: "var(--accent)", fontFamily: "monospace" }}>
              {title}<span style={{ animation: "blink-cursor 1.1s step-end infinite" }}>|</span>
            </span>
          </motion.div>

          {/* Gradient line */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 1.6 }}
            style={{ width: "100px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), #ff6ec7, transparent)", marginBottom: "1.8rem" }} />

          {/* Social icons */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.8 }}
            style={{ display: "flex", gap: "2.2rem", marginBottom: "1.8rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { href: "https://cranus.itch.io/", label: "itch.io", sym: "⚡", hc: "#ff6ec7" },
              { href: "https://www.youtube.com/@cranuss/videos", label: "YouTube", sym: "▶", hc: "#ff4444" },
              { href: "https://www.instagram.com/cranusgamess/", label: "Instagram", sym: "◈", hc: "#e1306c" },
              { href: "https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi", label: "Play", sym: "◉", hc: "#00d4ff" },
            ].map(s => (
              <motion.a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.92 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", textDecoration: "none" }}>
                <span style={{ fontSize: "1.2rem", color: "var(--accent-dim)", transition: "color 0.3s, text-shadow 0.3s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = s.hc; el.style.textShadow = `0 0 14px ${s.hc}`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--accent-dim)"; el.style.textShadow = "none"; }}>
                  {s.sym}
                </span>
                <span style={{ color: "var(--text-dim)", fontFamily: "monospace", fontSize: "0.52rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.8 }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/games">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{ padding: "13px 36px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", border: "1px solid var(--accent)", color: "var(--accent)", background: "transparent", fontFamily: "monospace", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "var(--accent)"; b.style.color = "#050505"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "var(--accent)"; }}>
                Oyunları Keşfet
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo(1)}
              style={{ padding: "13px 36px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#ff6ec7", background: "transparent", border: "1px solid rgba(255,110,200,0.35)", fontFamily: "monospace", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#ff6ec7"; b.style.boxShadow = "0 0 20px rgba(255,110,200,0.3)"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,110,200,0.35)"; b.style.boxShadow = "none"; }}>
              Hakkımda →
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}
          onClick={() => scrollTo(1)}
          style={{ position: "absolute", bottom: "1.8rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-dim)", fontFamily: "monospace" }}>Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: "1px", height: "30px", background: "linear-gradient(to bottom, var(--accent), #ff6ec7)" }} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          BOYUT 1 — BİYOGRAFİ
      ════════════════════════════════════════ */}
      <section id="section-1" data-idx="1"
        style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: "linear-gradient(160deg, #0c0018 0%, #18002e 55%, #080012 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center" }}>

        <canvas ref={bioCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.38 }} />
        <SynthGrid color="rgba(121,40,202,0.35)" />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to bottom, #0c0018, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #7928ca, #ff6ec7, transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #ff6ec7, #7928ca, transparent)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "820px", margin: "0 auto", padding: "0 24px", width: "100%" }}>

          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ marginBottom: "2.8rem" }}>
            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.55em", color: "#ff6ec7", fontFamily: "monospace", marginBottom: "0.8rem", textShadow: "0 0 18px rgba(255,110,200,0.8)" }}>
              Boyut 01
            </p>
            <h2 style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: "bold", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.6rem",
              textShadow: "0 0 40px rgba(121,40,202,0.6), 0 0 80px rgba(255,110,200,0.25)" }}>
              Biyografi
            </h2>
            <div style={{ width: "80px", height: "2px", background: "linear-gradient(to right, #7928ca, #ff6ec7)", margin: "0 auto" }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ marginBottom: "2rem" }}>
            <p style={{ color: "rgba(220,200,230,0.75)", fontSize: "1.05rem", lineHeight: 1.9, marginBottom: "1rem" }}>
              Karanlık atmosferler, derin hikayeler ve yaratıcı oyun mekanikleri üzerine çalışan bağımsız bir oyun geliştiriciyim.
              Cranus Games çatısı altında 30&apos;u aşkın oyun yayınladım.
            </p>
            <p style={{ color: "rgba(220,200,230,0.6)", fontSize: "0.95rem", lineHeight: 1.9 }}>
              Horror, adventure ve survival türlerine özel bir tutkum var. Her proje, farklı bir evrenin kapısını aralıyor.
            </p>
          </motion.div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "2.2rem", flexWrap: "wrap" }}>
            {[{ num: "33", label: "Oyun" }, { num: "21", label: "Game Jam" }, { num: "5+", label: "Yıl" }, { num: "∞", label: "Fikir" }].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{ padding: "16px 28px", textAlign: "center", border: "1px solid rgba(121,40,202,0.4)", background: "rgba(121,40,202,0.08)", backdropFilter: "blur(6px)", minWidth: "110px" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff6ec7", textShadow: "0 0 20px rgba(255,110,200,0.6)", marginBottom: "3px" }}>{s.num}</div>
                <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(220,200,230,0.5)", fontFamily: "monospace" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "2rem" }}>
            {skills.map((skill, i) => (
              <motion.span key={skill}
                initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{ padding: "8px 18px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", border: "1px solid rgba(121,40,202,0.4)", color: "rgba(220,180,255,0.7)", fontFamily: "monospace", background: "rgba(121,40,202,0.07)", cursor: "default", transition: "all 0.25s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#ff6ec7"; el.style.color = "#ff6ec7"; el.style.boxShadow = "0 0 16px rgba(255,110,200,0.35)"; el.style.background = "rgba(255,110,200,0.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(121,40,202,0.4)"; el.style.color = "rgba(220,180,255,0.7)"; el.style.boxShadow = "none"; el.style.background = "rgba(121,40,202,0.07)"; }}>
                {skill}
              </motion.span>
            ))}
          </div>

          {/* GitHub Contribution Calendar */}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }}
            style={{ padding: "16px 20px", border: "1px solid rgba(121,40,202,0.3)", background: "rgba(12,0,24,0.5)", backdropFilter: "blur(8px)" }}>
            <GitHubCalendar username="CranusGames" year={2026} />
          </motion.div>
        </div>

        {/* Next arrow */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          onClick={() => scrollTo(2)}
          style={{ position: "absolute", bottom: "1.5rem", cursor: "pointer", color: "rgba(255,110,200,0.4)", fontSize: "1.2rem", fontFamily: "monospace", userSelect: "none" }}>▼</motion.div>
      </section>

      {/* ════════════════════════════════════════
          BOYUT 2 — OYUNLAR
      ════════════════════════════════════════ */}
      <section id="section-2" data-idx="2"
        style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: "#000d1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center" }}>

        <canvas ref={arcadeCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.85 }} />
        {/* CRT scanlines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)", pointerEvents: "none", zIndex: 1 }} />
        <SynthGrid color="rgba(0,180,255,0.15)" flip />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: "linear-gradient(to top, #000d1a, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #00d4ff, transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #7928ca, #00d4ff, transparent)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1080px", margin: "0 auto", padding: "0 24px", width: "100%" }}>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.55em", color: "#00d4ff", fontFamily: "monospace", marginBottom: "0.8rem", textShadow: "0 0 18px rgba(0,212,255,0.8)" }}>
              Boyut 02
            </p>
            <h2 style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: "bold", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.5rem",
              textShadow: "0 0 40px rgba(0,180,255,0.5), 0 0 80px rgba(0,100,200,0.3)" }}>
              Oyunlar
            </h2>
            <div style={{ width: "80px", height: "2px", background: "linear-gradient(to right, #00d4ff, #7928ca)", margin: "0 auto" }} />
          </motion.div>

          {/* Game grid — 4×3 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "7px", marginBottom: "1.2rem" }}>
            {featured.map((game, i) => (
              <motion.div key={game.slug}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }}>
                <a href={`https://cranus.itch.io/${game.itchSlug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ y: -4, scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    style={{ border: "1px solid rgba(0,180,255,0.2)", background: "rgba(1,15,30,0.85)", overflow: "hidden", cursor: "pointer", position: "relative", transition: "border-color 0.25s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#00d4ff"; el.style.boxShadow = "0 0 14px rgba(0,212,255,0.25)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(0,180,255,0.2)"; el.style.boxShadow = "none"; }}>
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                      <img src={game.coverImage} alt={game.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "opacity 0.35s, transform 0.4s", display: "block" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLImageElement; el.style.opacity = "1"; el.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLImageElement; el.style.opacity = "0.75"; el.style.transform = "scale(1)"; }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(1,15,30,0.85) 0%, transparent 55%)" }} />
                    </div>
                    <div style={{ padding: "5px 8px" }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: "bold", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{game.title}</p>
                      <p style={{ fontSize: "0.5rem", textTransform: "uppercase", color: "#00d4ff", fontFamily: "monospace", marginTop: "1px" }}>{game.genre}</p>
                    </div>
                  </motion.div>
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <a href="https://cranus.itch.io/" target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{ padding: "11px 34px", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.2em", border: "1px solid rgba(0,212,255,0.4)", color: "#00d4ff", background: "transparent", fontFamily: "monospace", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,212,255,0.1)"; b.style.borderColor = "#00d4ff"; b.style.boxShadow = "0 0 20px rgba(0,212,255,0.25)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.borderColor = "rgba(0,212,255,0.4)"; b.style.boxShadow = "none"; }}>
                Tüm {games.length} Oyunu itch.io&apos;da Gör →
              </motion.button>
            </a>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          onClick={() => scrollTo(3)}
          style={{ position: "absolute", bottom: "1.5rem", cursor: "pointer", color: "rgba(0,212,255,0.4)", fontSize: "1.2rem", fontFamily: "monospace", userSelect: "none" }}>▼</motion.div>
      </section>

      {/* ════════════════════════════════════════
          BOYUT 3 — BAĞLANTI
      ════════════════════════════════════════ */}
      <section id="section-3" data-idx="3"
        style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: "linear-gradient(160deg, #1a0020 0%, #0d0015 55%, #1e0010 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center" }}>

        <SynthGrid color="rgba(255,0,128,0.28)" />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to bottom, #1a0020, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #ff0080, #ff6ec7, transparent)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "860px", margin: "0 auto", padding: "0 24px", width: "100%" }}>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ marginBottom: "2.8rem" }}>
            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.55em", color: "#ff6ec7", fontFamily: "monospace", marginBottom: "0.8rem", textShadow: "0 0 18px rgba(255,110,200,0.8)" }}>
              Boyut 03
            </p>
            <h2 style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: "bold", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.5rem",
              textShadow: "0 0 40px rgba(255,0,128,0.5), 0 0 80px rgba(255,110,200,0.3)" }}>
              Bağlantı
            </h2>
            <div style={{ width: "80px", height: "2px", background: "linear-gradient(to right, #ff0080, #ff6ec7)", margin: "0 auto" }} />
          </motion.div>

          {/* Social grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "1.8rem" }}>
            {[
              { href: "https://cranus.itch.io/", label: "itch.io", sym: "⚡", color: "#ff6ec7", desc: "Tüm oyunlar" },
              { href: "https://www.youtube.com/@cranuss/videos", label: "YouTube", sym: "▶", color: "#ff3333", desc: "Devlog & video" },
              { href: "https://www.instagram.com/cranusgamess/", label: "Instagram", sym: "◈", color: "#e1306c", desc: "Güncellemeler" },
              { href: "https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi", label: "Play Store", sym: "◉", color: "#00c853", desc: "Den Den Mushi" },
            ].map((s, i) => (
              <motion.a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.09 }}
                whileHover={{ y: -7 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 14px", border: "1px solid rgba(255,0,128,0.2)", background: "rgba(255,0,128,0.04)", textDecoration: "none", backdropFilter: "blur(6px)", transition: "all 0.3s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = s.color; el.style.background = `${s.color}18`; el.style.boxShadow = `0 0 28px ${s.color}50`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,0,128,0.2)"; el.style.background = "rgba(255,0,128,0.04)"; el.style.boxShadow = "none"; }}>
                <span style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{s.sym}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text)", marginBottom: "5px" }}>{s.label}</span>
                <span style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontFamily: "monospace" }}>{s.desc}</span>
              </motion.a>
            ))}
          </div>

          {/* Den Den Mushi card */}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}
            style={{ border: "1px solid rgba(255,0,128,0.22)", background: "rgba(255,0,128,0.06)", padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px", backdropFilter: "blur(6px)" }}>
            <img src="https://play-lh.googleusercontent.com/tS8rp0bZ9S4SNaryOpRr3XC92ta3osaxhPWzLTFZXFwOo2shIkpp__tUX7QWPoNy_a0MG0C8uCmNc4e831BG=w240-h480-rw"
              alt="Den Den Mushi" style={{ width: "68px", height: "68px", objectFit: "cover", border: "1px solid rgba(255,0,128,0.3)", flexShrink: 0 }} />
            <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#ff6ec7", fontFamily: "monospace", marginBottom: "4px" }}>Android Oyunu</p>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--text)", marginBottom: "4px" }}>Den Den Mushi</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.5 }}>Ana odada sadece bir buton var. Basarsanız rastgele birisi sizi arayacak...</p>
            </div>
            <a href="https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                style={{ padding: "11px 22px", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.15em", border: "1px solid #ff6ec7", color: "#ff6ec7", background: "transparent", fontFamily: "monospace", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.3s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#ff6ec7"; b.style.color = "#050505"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "#ff6ec7"; }}>
                İndir
              </motion.button>
            </a>
          </motion.div>

          {/* Footer */}
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
            style={{ marginTop: "2rem", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,110,200,0.3)", fontFamily: "monospace" }}>
            © 2025 Emirhan Aycibin — Cranus Games
          </motion.p>
        </div>
      </section>
    </div>
  );
}
