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

/* ─── Cranus Logo ───────────────────────────────────────── */
const LOGO_PIX = [
  [0,1,1,1,1,0],
  [1,1,0,0,0,0],
  [1,0,0,0,0,0],
  [1,0,0,0,0,0],
  [1,1,0,0,0,0],
  [0,1,1,1,1,0],
];

function CranusLogo({ size = 90 }: { size?: number }) {
  const sc = Math.round(size * 0.3 / LOGO_PIX[0].length);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Rotating dashed ring */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
          border: "1px dashed rgba(255,110,200,0.38)", animation: "spin-slow 16s linear infinite" }} />
        {/* Counter-rotating glow ring */}
        <div style={{ position: "absolute", inset: "7px", borderRadius: "50%",
          border: "1px solid rgba(121,40,202,0.3)", animation: "spin-slow 22s linear infinite reverse" }} />
        {/* Gradient border ring */}
        <div style={{ position: "absolute", inset: "14px", borderRadius: "50%", padding: "1.5px",
          background: "linear-gradient(135deg, #ff6ec7, #7928ca, #ff0080)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
        {/* Dark inner circle */}
        <div style={{ position: "absolute", inset: "16px", borderRadius: "50%",
          background: "radial-gradient(circle at 38% 35%, rgba(255,0,128,0.14), rgba(8,0,18,0.97))",
          boxShadow: "0 0 28px rgba(255,0,128,0.2) inset",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Pixel C */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {LOGO_PIX.map((row, ri) => (
              <div key={ri} style={{ display: "flex" }}>
                {row.map((px, ci) => (
                  <div key={ci} style={{
                    width: sc, height: sc,
                    background: px ? "#ff6ec7" : "transparent",
                    boxShadow: px ? `0 0 ${sc}px rgba(255,110,200,0.7)` : "none",
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Outer pulse glow */}
        <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,0,128,0.06) 0%, transparent 70%)",
          animation: "pulse-glow 3.5s ease-in-out infinite", pointerEvents: "none" }} />
      </div>
      {/* Wordmark */}
      <div style={{ textAlign: "center", lineHeight: 1.2 }}>
        <div style={{ fontSize: `${size * 0.115}px`, fontWeight: "bold", letterSpacing: "0.42em",
          color: "var(--text)", fontFamily: "monospace", textTransform: "uppercase",
          textShadow: "0 0 20px rgba(255,110,200,0.35)" }}>
          CRANUS
        </div>
        <div style={{ fontSize: `${size * 0.065}px`, letterSpacing: "0.5em",
          color: "rgba(255,110,200,0.45)", fontFamily: "monospace", textTransform: "uppercase" }}>
          GAMES
        </div>
      </div>
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
  const contactCanvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [photoHovered, setPhotoHovered] = useState(false);
  const [arcadeScore, setArcadeScore] = useState(0);
  const [arcadePopup, setArcadePopup] = useState<{ title: string; x: number; y: number; key: number } | null>(null);
  const arcadeHitRef = useRef<(killerName: string, victimName: string, bx: number, by: number) => void>(() => {});
  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ name: string; kills: number }[]>([]);

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

  /* Arcade hit callback — fighter kill event */
  useEffect(() => {
    arcadeHitRef.current = (killerName: string, victimName: string, bx: number, by: number) => {
      if (popupTimer.current) clearTimeout(popupTimer.current);
      setArcadeScore(s => s + 100);
      setArcadePopup({ title: `☠ ${victimName}`, x: bx, y: by, key: Date.now() });
      popupTimer.current = setTimeout(() => setArcadePopup(null), 2500);
      setLeaderboard(prev => {
        const idx = prev.findIndex(l => l.name === killerName);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], kills: next[idx].kills + 1 };
          return next.sort((a, b) => b.kills - a.kills);
        }
        return [...prev, { name: killerName, kills: 1 }].sort((a, b) => b.kills - a.kills);
      });
    };
  }, []);

  /* Arcade — All games as image fighters, click to open itch.io */
  useEffect(() => {
    const canvas = arcadeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    const FW = 48; // fighter size in px
    const HALF = FW / 2;
    const PALETTE = ["#00ffff","#ff00ff","#ffff00","#00ff88","#ff6600","#ff69b4","#aa44ff","#ff4444","#00ccff","#ffaa00","#ff8800","#00ffaa","#8800ff","#ff0066","#00ff66","#ccff00","#ff44aa","#44ffff"];

    const SP_FALLBACK = [
      [0,0,1,0,0,0,1,0,0],
      [1,0,0,1,0,1,0,0,1],
      [1,0,1,1,1,1,1,0,1],
      [1,1,1,0,1,0,1,1,1],
      [1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,0],
      [0,0,1,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,1,0],
    ];

    type Fighter = {
      id: number; name: string; itchSlug: string;
      img: HTMLImageElement; imgReady: boolean; imgFailed: boolean;
      color: string; x: number; y: number; tx: number; ty: number;
      speed: number; hp: number; kills: number;
      lastShot: number; alive: boolean; deathAt: number;
      flash: number; nextGlitch: number;
    };

    const fighters: Fighter[] = games.map((g, i) => {
      const img = new Image();
      const f: Fighter = {
        id: i, name: g.title, itchSlug: (g as {itchSlug?: string}).itchSlug ?? g.slug,
        img, imgReady: false, imgFailed: false,
        color: PALETTE[i % PALETTE.length],
        x: 60 + (i % 8) * ((window.innerWidth - 120) / 8),
        y: 60 + Math.floor(i / 8) * 120,
        tx: Math.random() * window.innerWidth, ty: Math.random() * window.innerHeight,
        speed: Math.random() * 0.5 + 0.35,
        hp: 3, kills: 0,
        lastShot: Date.now() + i * 250,
        alive: true, deathAt: 0, flash: 0, nextGlitch: 15,
      };
      img.onload  = () => { f.imgReady  = true; };
      img.onerror = () => { f.imgFailed = true; };
      img.src = g.coverImage;
      return f;
    });

    type FBullet = { x: number; y: number; vx: number; vy: number; shooterId: number; color: string };
    type Spark   = { x: number; y: number; vx: number; vy: number; life: number; c: string };
    type FPopup  = { x: number; y: number; text: string; color: string; life: number };

    const bullets: FBullet[] = [];
    const sparks:  Spark[]   = [];
    const fpopups: FPopup[]  = [];

    /* ── click / hover ── */
    const getHovered = (ex: number, ey: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ex - rect.left, my = ey - rect.top;
      return fighters.find(f => f.alive && mx >= f.x - HALF && mx <= f.x + HALF && my >= f.y - HALF && my <= f.y + HALF) ?? null;
    };
    const handleClick = (e: MouseEvent) => {
      const f = getHovered(e.clientX, e.clientY);
      if (f) window.open(`https://cranus.itch.io/${f.itchSlug}`, "_blank");
    };
    const handleMove = (e: MouseEvent) => {
      canvas.style.cursor = getHovered(e.clientX, e.clientY) ? "pointer" : "default";
    };
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMove);

    /* ── draw one fighter ── */
    const drawFighter = (f: Fighter) => {
      const ox = Math.floor(f.x - HALF), oy = Math.floor(f.y - HALF);
      const flashOn = f.flash > 0 && f.flash % 4 < 2;
      ctx.save();
      ctx.globalAlpha = flashOn ? 0.2 : 0.92;

      // image or pixel-art fallback
      if (f.imgReady && !f.imgFailed) {
        // clip to square
        ctx.beginPath(); ctx.rect(ox, oy, FW, FW); ctx.clip();
        try { ctx.drawImage(f.img, ox, oy, FW, FW); } catch { f.imgFailed = true; }

        // glitch slice effect
        f.nextGlitch--;
        if (f.nextGlitch <= 0 && !f.imgFailed) {
          f.nextGlitch = Math.floor(Math.random() * 45) + 12;
          const slices = Math.floor(Math.random() * 3) + 1;
          for (let s = 0; s < slices; s++) {
            const slY = oy + Math.floor(Math.random() * FW);
            const slH = Math.floor(Math.random() * 7) + 2;
            const off = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 12) + 3);
            const srcY = Math.max(0, Math.min((slY - oy) / FW * (f.img.naturalHeight || FW), (f.img.naturalHeight || FW) - 1));
            const srcH = Math.max(1, slH / FW * (f.img.naturalHeight || FW));
            try {
              ctx.globalAlpha = 0.75;
              ctx.drawImage(f.img, 0, srcY, f.img.naturalWidth || FW, srcH, ox + off, slY, FW, slH);
              ctx.globalAlpha = 0.2;
              ctx.fillStyle = f.color;
              ctx.fillRect(ox + off, slY, FW, slH);
            } catch { /* tainted */ }
          }
        }

        // scanlines
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "#000";
        for (let ly = oy; ly < oy + FW; ly += 2) ctx.fillRect(ox, ly, FW, 1);
      } else {
        // pixel-art fallback
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = f.color + "22";
        ctx.fillRect(ox, oy, FW, FW);
        ctx.fillStyle = f.color;
        const sc = Math.floor(FW / SP_FALLBACK[0].length);
        const sW = SP_FALLBACK[0].length * sc, sH = SP_FALLBACK.length * sc;
        SP_FALLBACK.forEach((row, ry) =>
          row.forEach((px, rx) => {
            if (px) ctx.fillRect(ox + (FW - sW) / 2 + rx * sc, oy + (FW - sH) / 2 + ry * sc, sc, sc);
          })
        );
      }

      ctx.restore();

      // glitchy border frame
      const bc = flashOn ? "#ffffff" : f.color;
      ctx.globalAlpha = 0.88;
      ctx.strokeStyle = bc; ctx.lineWidth = 2;
      ctx.strokeRect(ox + 1, oy + 1, FW - 2, FW - 2);

      // pixel corner accents
      ctx.fillStyle = bc; ctx.globalAlpha = 0.95;
      const cs = 5;
      [[ox - 2, oy - 2, cs + 2, 2], [ox - 2, oy - 2, 2, cs + 2],
       [ox + FW - cs, oy - 2, cs + 2, 2], [ox + FW, oy - 2, 2, cs + 2],
       [ox - 2, oy + FW, cs + 2, 2], [ox - 2, oy + FW - cs, 2, cs + 2],
       [ox + FW - cs, oy + FW, cs + 2, 2], [ox + FW, oy + FW - cs, 2, cs + 2],
      ].forEach(([rx, ry, rw, rh]) => ctx.fillRect(rx, ry, rw, rh));

      // occasional stray pixel on border (glitch artifact)
      if (Math.random() < 0.04) {
        ctx.fillStyle = f.color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(ox + Math.floor(Math.random() * FW), oy - 3 + Math.floor(Math.random() * (FW + 6)), 2, 2);
      }

      // HP bar
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#111";
      ctx.fillRect(ox, oy + FW + 2, FW, 3);
      ctx.fillStyle = f.hp === 3 ? "#00ff88" : f.hp === 2 ? "#ffff00" : "#ff4444";
      ctx.fillRect(ox, oy + FW + 2, Math.floor(FW * f.hp / 3), 3);

      // name label
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = f.color;
      ctx.font = "bold 8px monospace";
      const label = f.name.length > 12 ? f.name.slice(0, 12) + "…" : f.name;
      ctx.fillText(label, Math.floor(f.x - ctx.measureText(label).width / 2), oy + FW + 14);

      ctx.globalAlpha = 1;
      if (f.flash > 0) f.flash--;
    };

    let animId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0,13,26,0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      fighters.forEach(f => {
        if (!f.alive) {
          if (now > f.deathAt) {
            f.alive = true; f.hp = 3;
            f.x = Math.random() * (canvas.width - 100) + 50;
            f.y = Math.random() * (canvas.height - 100) + 50;
            f.tx = Math.random() * canvas.width;
            f.ty = Math.random() * canvas.height;
          }
          return;
        }

        // wander
        const dx = f.tx - f.x, dy = f.ty - f.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 20) {
          f.tx = Math.random() * (canvas.width - 80) + 40;
          f.ty = Math.random() * (canvas.height - 80) + 40;
        } else {
          f.x += dx / d * f.speed;
          f.y += dy / d * f.speed;
        }
        f.x = Math.max(HALF + 5, Math.min(canvas.width  - HALF - 5, f.x));
        f.y = Math.max(HALF + 5, Math.min(canvas.height - HALF - 5, f.y));

        // shoot nearest
        if (now - f.lastShot > 1200 + Math.random() * 800) {
          let best: Fighter | null = null, bestD = Infinity;
          fighters.forEach(t => {
            if (t.id === f.id || !t.alive) return;
            const dd = (t.x - f.x) ** 2 + (t.y - f.y) ** 2;
            if (dd < bestD) { bestD = dd; best = t; }
          });
          if (best) {
            const tx = (best as Fighter).x - f.x, ty = (best as Fighter).y - f.y;
            const len = Math.sqrt(tx * tx + ty * ty);
            const w = (Math.random() - 0.5) * 0.22;
            if (bullets.length < 90)
              bullets.push({ x: f.x, y: f.y, vx: tx / len * 5 + w, vy: ty / len * 5 + w, shooterId: f.id, color: f.color });
          }
          f.lastShot = now;
        }

        drawFighter(f);
      });

      // bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx; b.y += b.vy;
        if (b.x < -10 || b.x > canvas.width + 10 || b.y < -10 || b.y > canvas.height + 10) {
          bullets.splice(i, 1); continue;
        }
        let hit = false;
        for (const f of fighters) {
          if (f.id === b.shooterId || !f.alive) continue;
          if (Math.sqrt((f.x - b.x) ** 2 + (f.y - b.y) ** 2) < HALF + 3) {
            f.hp--; f.flash = 14; hit = true;
            if (sparks.length < 120)
              for (let s = 0; s < 10; s++)
                sparks.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7, life: 1, c: b.color });
            if (f.hp <= 0) {
              f.alive = false; f.deathAt = now + 3500;
              const killer = fighters.find(fi => fi.id === b.shooterId);
              if (killer) {
                killer.kills++;
                fpopups.push({ x: b.x, y: b.y - 14, text: `☠ ${f.name.length > 10 ? f.name.slice(0, 10) + "…" : f.name}`, color: b.color, life: 1.3 });
                arcadeHitRef.current(killer.name, f.name, b.x, b.y);
              }
            } else {
              fpopups.push({ x: b.x, y: b.y, text: `-1 HP`, color: b.color, life: 0.75 });
            }
            bullets.splice(i, 1); break;
          }
        }
        if (hit) continue;
        ctx.globalAlpha = 0.95; ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.life -= 0.04;
        ctx.globalAlpha = Math.max(0, s.life); ctx.fillStyle = s.c;
        ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
        if (s.life <= 0) sparks.splice(i, 1);
      }

      // canvas popups
      ctx.font = "bold 11px monospace";
      for (let i = fpopups.length - 1; i >= 0; i--) {
        const p = fpopups[i];
        p.y -= 0.55; p.life -= 0.014;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life)); ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x - ctx.measureText(p.text).width / 2, p.y);
        if (p.life <= 0) fpopups.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* Contact — network node graph */
  useEffect(() => {
    const canvas = contactCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    type Pulse = { ai: number; bi: number; t: number; speed: number };
    const nodes: Node[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
    }));
    const pulses: Pulse[] = [];
    let lastPulse = 0;
    const MAX_D = 160;

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = canvas.width; if (n.x > canvas.width) n.x = 0;
        if (n.y < 0) n.y = canvas.height; if (n.y > canvas.height) n.y = 0;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,0,128,0.55)"; ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_D) {
            const a = (1 - d / MAX_D) * 0.22;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,110,200,${a})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }

      if (now - lastPulse > 1800) {
        const ai = Math.floor(Math.random() * nodes.length);
        let bi = ai;
        while (bi === ai) bi = Math.floor(Math.random() * nodes.length);
        pulses.push({ ai, bi, t: 0, speed: 0.018 + Math.random() * 0.012 });
        lastPulse = now;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const a = nodes[p.ai], b = nodes[p.bi];
        const px = a.x + (b.x - a.x) * p.t, py = a.y + (b.y - a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,110,200,${fade * 0.9})`; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,0,128,${fade * 0.2})`; ctx.fill();
        if (p.t >= 1) pulses.splice(i, 1);
      }

      id = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
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
                      <img src="/cranusweb/ben.png" alt="Emirhan Aycibin"
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
            style={{ fontSize: "clamp(1.9rem, 5vw, 4.8rem)", fontWeight: "bold", letterSpacing: "-0.02em", marginBottom: "0.5rem",
              background: "linear-gradient(135deg, #e8e0d0 5%, #c8a96e 30%, #ff6ec7 65%, #e8e0d0 92%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: "drop-shadow(0 0 32px rgba(200,169,110,0.35))" }}>
            EMİRHAN AYCİBİN
          </motion.h1>

          {/* Typewriter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
            style={{ height: "26px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.3em", color: "var(--accent)", fontFamily: "monospace" }}>
              {title}<span style={{ animation: "blink-cursor 1.1s step-end infinite" }}>|</span>
            </span>
          </motion.div>

          {/* Stats chips */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.7 }}
            style={{ display: "flex", gap: "8px", marginBottom: "1.4rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { v: "33", l: "Oyun", c: "#c8a96e" },
              { v: "21", l: "Game Jam", c: "#ff6ec7" },
              { v: "5+", l: "Yıl", c: "#00d4ff" },
              { v: "∞",  l: "Fikir", c: "#7928ca" },
            ].map(s => (
              <div key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center",
                padding: "7px 16px", border: `1px solid ${s.c}38`, background: `${s.c}0c` }}>
                <span style={{ fontSize: "1rem", fontWeight: "bold", color: s.c, lineHeight: 1,
                  textShadow: `0 0 14px ${s.c}88` }}>{s.v}</span>
                <span style={{ fontSize: "0.46rem", textTransform: "uppercase", letterSpacing: "0.12em",
                  color: `${s.c}70`, fontFamily: "monospace", marginTop: "3px" }}>{s.l}</span>
              </div>
            ))}
          </motion.div>

          {/* Gradient line */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 1.8 }}
            style={{ width: "100px", height: "1px", background: "linear-gradient(to right, transparent, var(--accent), #ff6ec7, transparent)", marginBottom: "1.6rem" }} />

          {/* Social icons — SVG logos */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.8 }}
            style={{ display: "flex", gap: "10px", marginBottom: "1.8rem", flexWrap: "wrap", justifyContent: "center" }}>
            {(() => {
              const HS = [
                { href: "https://cranus.itch.io/", label: "itch.io", hc: "#fa5c5c",
                  logo: <svg width="26" height="22" viewBox="0 0 245 220" fill="currentColor"><path d="M31.9,0C14.4,0,0,14.4,0,31.9v156.2C0,205.6,14.4,220,31.9,220h181.2c17.5,0,31.9-14.4,31.9-31.9V31.9C245,14.4,230.6,0,213.1,0H31.9z"/><path fill="#050505" d="M207,60.7c-5.3-3.6-14.8-9.6-34.5-12.1L167.6,43.8c-12.5-12.5-32.6-14.7-46.3-4.3C107.6,29.1,87.5,31.3,75,43.8l-4.9,4.9C50.4,51.1,40.9,57.1,35.6,60.7C9.3,65.5,4.2,74.1,4.2,83.6v21.7c0,17.4,14.1,31.6,31.6,31.6h0.5c7.9,0,15.1-3.1,20.5-8c5.4,5,12.6,8,20.5,8h64.1c7.9,0,15.1-3,20.5-8c5.4,5,12.6,8,20.5,8h0.5c17.4,0,31.6-14.1,31.6-31.6V83.6C214.9,74.1,209.8,65.5,207,60.7z"/><rect fill="#050505" x="73" y="148" width="99" height="56" rx="4"/><rect fill="#050505" x="82" y="173" width="81" height="31" rx="3"/></svg> },
                { href: "https://www.youtube.com/@cranuss/videos", label: "YouTube", hc: "#ff4444",
                  logo: <svg width="30" height="22" viewBox="0 0 46 32"><rect width="46" height="32" rx="7" fill="#FF0000"/><polygon points="18,8 34,16 18,24" fill="white"/></svg> },
                { href: "https://www.instagram.com/cranusgamess/", label: "Instagram", hc: "#e040fb",
                  logo: <svg width="24" height="24" viewBox="0 0 38 38"><defs><radialGradient id="ig_h" cx="30%" cy="110%" r="140%"><stop offset="0%" stopColor="#fdf497"/><stop offset="20%" stopColor="#fd5949"/><stop offset="55%" stopColor="#d6249f"/><stop offset="100%" stopColor="#285AEB"/></radialGradient></defs><rect width="38" height="38" rx="9" fill="url(#ig_h)"/><rect x="4" y="4" width="30" height="30" rx="6" fill="none" stroke="white" strokeWidth="2.2"/><circle cx="19" cy="19" r="7.5" fill="none" stroke="white" strokeWidth="2.2"/><circle cx="28" cy="10" r="2" fill="white"/></svg> },
                { href: "https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi", label: "Play", hc: "#00e676",
                  logo: <svg width="22" height="24" viewBox="0 0 38 38"><path d="M5,3 L20,19 L5,35 Q3,34 3,32 L3,6 Q3,4 5,3 Z" fill="#00D2FF"/><path d="M5,3 L26,13 L20,19 Z" fill="#FF3D00"/><path d="M26,25 L20,19 L5,35 Z" fill="#FFD600"/><path d="M30,16 Q33,17.5 33,19 Q33,20.5 30,22 L26,25 L20,19 L26,13 Z" fill="#00F076"/></svg> },
              ];
              return HS.map(s => (
                <motion.a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.94 }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px",
                    border: `1px solid ${s.hc}30`, background: `${s.hc}0a`,
                    textDecoration: "none", transition: "all 0.3s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = s.hc + "70"; el.style.background = s.hc + "18"; el.style.boxShadow = `0 0 20px ${s.hc}30`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = s.hc + "30"; el.style.background = s.hc + "0a"; el.style.boxShadow = "none"; }}>
                  <div style={{ filter: `drop-shadow(0 0 6px ${s.hc}80)`, display: "flex" }}>{s.logo}</div>
                  <span style={{ color: `${s.hc}cc`, fontFamily: "monospace", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
                </motion.a>
              ));
            })()}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.8 }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/games">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{ padding: "13px 38px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em",
                  border: "1px solid var(--accent)", color: "var(--accent)",
                  background: "linear-gradient(135deg, rgba(200,169,110,0.1) 0%, transparent 100%)",
                  fontFamily: "monospace", cursor: "pointer", transition: "all 0.3s",
                  boxShadow: "0 0 24px rgba(200,169,110,0.1)" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "var(--accent)"; b.style.color = "#050505"; b.style.boxShadow = "0 0 36px rgba(200,169,110,0.4)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "linear-gradient(135deg, rgba(200,169,110,0.1) 0%, transparent 100%)"; b.style.color = "var(--accent)"; b.style.boxShadow = "0 0 24px rgba(200,169,110,0.1)"; }}>
                ⚡ Oyunları Keşfet
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo(1)}
              style={{ padding: "13px 38px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em",
                color: "#ff6ec7", background: "linear-gradient(135deg, rgba(255,110,200,0.08) 0%, transparent 100%)",
                border: "1px solid rgba(255,110,200,0.35)", fontFamily: "monospace", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#ff6ec7"; b.style.boxShadow = "0 0 28px rgba(255,110,200,0.3)"; b.style.background = "rgba(255,110,200,0.12)"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,110,200,0.35)"; b.style.boxShadow = "none"; b.style.background = "linear-gradient(135deg, rgba(255,110,200,0.08) 0%, transparent 100%)"; }}>
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

        <canvas ref={arcadeCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.9 }} />
        {/* CRT scanlines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)", pointerEvents: "none", zIndex: 1 }} />
        <SynthGrid color="rgba(0,180,255,0.15)" flip />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: "linear-gradient(to top, #000d1a, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #00d4ff, transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #7928ca, #00d4ff, transparent)" }} />

        {/* Title — pointer-events none so canvas clicks pass through */}
        <div style={{ position: "absolute", top: "1.8rem", left: 0, right: 0, zIndex: 10, textAlign: "center", pointerEvents: "none" }}>
          <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.55em", color: "#00d4ff", fontFamily: "monospace", marginBottom: "0.5rem", textShadow: "0 0 18px rgba(0,212,255,0.8)" }}>
            Boyut 02
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "bold", color: "var(--text)", letterSpacing: "-0.02em",
            textShadow: "0 0 40px rgba(0,180,255,0.5), 0 0 80px rgba(0,100,200,0.3)" }}>
            Oyunlar
          </h2>
          <div style={{ width: "60px", height: "2px", background: "linear-gradient(to right, #00d4ff, #7928ca)", margin: "8px auto 0" }} />
          <p style={{ marginTop: "8px", fontSize: "0.55rem", color: "rgba(0,212,255,0.5)", fontFamily: "monospace", letterSpacing: "0.15em" }}>
            {games.length} OYUN · SAVAŞA KATIL · TIKLAYARAK OYNA
          </p>
        </div>

        {/* itch.io button — bottom center, stays clickable */}
        <div style={{ position: "absolute", bottom: "3.5rem", left: 0, right: 0, zIndex: 20, textAlign: "center", pointerEvents: "none" }}>
          <a href="https://cranus.itch.io/" target="_blank" rel="noopener noreferrer" style={{ pointerEvents: "auto" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              style={{ padding: "10px 30px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", border: "1px solid rgba(0,212,255,0.4)", color: "#00d4ff", background: "rgba(0,13,26,0.75)", fontFamily: "monospace", cursor: "pointer", backdropFilter: "blur(6px)", transition: "all 0.3s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,212,255,0.12)"; b.style.borderColor = "#00d4ff"; b.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,13,26,0.75)"; b.style.borderColor = "rgba(0,212,255,0.4)"; b.style.boxShadow = "none"; }}>
              Tüm {games.length} Oyunu itch.io&apos;da Gör →
            </motion.button>
          </a>
        </div>

        {/* Leaderboard panel — left side */}
        <div className="leaderboard-scroll" style={{ position: "absolute", top: "5.5rem", left: "1.5rem", zIndex: 20, fontFamily: "monospace", width: "155px", maxHeight: "calc(100vh - 10rem)", overflowY: "auto" }}>
          <div style={{ fontSize: "0.48rem", letterSpacing: "0.25em", color: "#00d4ff", textTransform: "uppercase", marginBottom: "7px",
            textShadow: "0 0 10px rgba(0,212,255,0.7)", borderBottom: "1px solid rgba(0,212,255,0.25)", paddingBottom: "5px" }}>
            ⚔ Liderlik
          </div>
          {leaderboard.length === 0 && (
            <div style={{ fontSize: "0.52rem", color: "rgba(0,212,255,0.3)", lineHeight: 2 }}>savaş başlıyor…</div>
          )}
          {leaderboard.map((l, i) => (
            <div key={l.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "3px 0", borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
              <span style={{ fontSize: "0.58rem", color: i === 0 ? "#ffff44" : i === 1 ? "#aaaaaa" : i === 2 ? "#cd7f32" : "rgba(180,220,255,0.55)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "115px",
                textShadow: i === 0 ? "0 0 10px #ffff44" : "none" }}>
                {i === 0 ? "👑 " : `${i + 1}. `}{l.name}
              </span>
              <span style={{ fontSize: "0.6rem", fontWeight: "bold", color: i === 0 ? "#ffff44" : "#00d4ff", flexShrink: 0 }}>
                {l.kills}
              </span>
            </div>
          ))}
        </div>

        {/* Score — bottom left */}
        <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", zIndex: 20, fontFamily: "monospace", lineHeight: 1.2 }}>
          <div style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: "rgba(0,212,255,0.45)", textTransform: "uppercase" }}>Kill Score</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#00d4ff", textShadow: "0 0 14px rgba(0,212,255,0.8)" }}>
            {String(arcadeScore).padStart(6, "0")}
          </div>
        </div>

        {/* Kill popup */}
        {arcadePopup && (
          <div key={arcadePopup.key} style={{
            position: "absolute",
            left: Math.min(Math.max(arcadePopup.x - 70, 10), (typeof window !== "undefined" ? window.innerWidth : 800) - 160),
            top: Math.max(arcadePopup.y - 80, 60),
            zIndex: 30, pointerEvents: "none", textAlign: "center", animation: "popupFade 2.5s ease forwards",
          }}>
            <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#ffff44", fontFamily: "monospace", textShadow: "0 0 12px #ffff44" }}>+100</div>
            <div style={{ fontSize: "0.62rem", color: "#00d4ff", fontFamily: "monospace", letterSpacing: "0.08em", marginTop: "2px",
              background: "rgba(0,13,26,0.9)", padding: "4px 10px", border: "1px solid rgba(0,212,255,0.5)" }}>
              {arcadePopup.title}
            </div>
          </div>
        )}

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          onClick={() => scrollTo(3)}
          style={{ position: "absolute", bottom: "1.5rem", cursor: "pointer", color: "rgba(0,212,255,0.4)", fontSize: "1.2rem", fontFamily: "monospace", userSelect: "none" }}>▼</motion.div>
      </section>

      {/* ════════════════════════════════════════
          BOYUT 3 — BAĞLANTI
      ════════════════════════════════════════ */}
      <section id="section-3" data-idx="3"
        style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", background: "linear-gradient(160deg, #130018 0%, #0a0013 50%, #180010 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

        <canvas ref={contactCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55 }} />
        <SynthGrid color="rgba(255,0,128,0.22)" />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to bottom, #130018, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, #180010, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #ff0080, #ff6ec7, transparent)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "880px", margin: "0 auto", padding: "0 28px", width: "100%" }}>

          {/* Title + Logo */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ display: "flex", alignItems: "center", gap: "2.2rem", marginBottom: "1.8rem" }}>
            <CranusLogo size={100} />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.55em", color: "#ff6ec7", fontFamily: "monospace", marginBottom: "0.4rem", textShadow: "0 0 18px rgba(255,110,200,0.8)" }}>
                Boyut 03
              </p>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: "bold", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "0.5rem",
                textShadow: "0 0 40px rgba(255,0,128,0.5), 0 0 80px rgba(255,110,200,0.25)" }}>
                Bağlantı
              </h2>
              <div style={{ width: "70px", height: "2px", background: "linear-gradient(to right, #ff0080, #ff6ec7)" }} />
              <p style={{ marginTop: "0.5rem", fontSize: "0.6rem", color: "rgba(220,180,255,0.4)", fontFamily: "monospace", lineHeight: 1.7 }}>
                Bağımsız oyun geliştirici<br />Cranus Games Studio
              </p>
            </div>
          </motion.div>

          {/* Social cards — 2×2 */}
          {(() => {
            const SOCIALS = [
              {
                href: "https://cranus.itch.io/", label: "itch.io", handle: "cranus.itch.io",
                color: "#fa5c5c", tag: "OYUN", desc: `${games.length} Oyun Yayınlandı`,
                logo: (
                  <svg width="42" height="38" viewBox="0 0 245 220" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.9,0C14.4,0,0,14.4,0,31.9v156.2C0,205.6,14.4,220,31.9,220h181.2c17.5,0,31.9-14.4,31.9-31.9V31.9C245,14.4,230.6,0,213.1,0H31.9z"/>
                    <path fill="#0a000f" d="M207,60.7c-5.3-3.6-14.8-9.6-34.5-12.1L167.6,43.8c-12.5-12.5-32.6-14.7-46.3-4.3C107.6,29.1,87.5,31.3,75,43.8l-4.9,4.9C50.4,51.1,40.9,57.1,35.6,60.7C9.3,65.5,4.2,74.1,4.2,83.6v21.7c0,17.4,14.1,31.6,31.6,31.6h0.5c7.9,0,15.1-3.1,20.5-8c5.4,5,12.6,8,20.5,8h64.1c7.9,0,15.1-3,20.5-8c5.4,5,12.6,8,20.5,8h0.5c17.4,0,31.6-14.1,31.6-31.6V83.6C214.9,74.1,209.8,65.5,207,60.7z"/>
                    <rect fill="#0a000f" x="73" y="148" width="99" height="56" rx="4"/>
                    <rect fill="#0a000f" x="82" y="173" width="81" height="31" rx="3"/>
                  </svg>
                ),
              },
              {
                href: "https://www.youtube.com/@cranuss/videos", label: "YouTube", handle: "@cranuss",
                color: "#ff4444", tag: "VİDEO", desc: "Devlog & Gameplay",
                logo: (
                  <svg width="46" height="32" viewBox="0 0 46 32" xmlns="http://www.w3.org/2000/svg">
                    <rect width="46" height="32" rx="7" fill="#FF0000"/>
                    <polygon points="18,8 34,16 18,24" fill="white"/>
                  </svg>
                ),
              },
              {
                href: "https://www.instagram.com/cranusgamess/", label: "Instagram", handle: "@cranusgamess",
                color: "#e040fb", tag: "GÖRSEL", desc: "Gelişim süreci & güncellemeler",
                logo: (
                  <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="ig_rg" cx="30%" cy="110%" r="140%">
                        <stop offset="0%" stopColor="#fdf497"/>
                        <stop offset="20%" stopColor="#fd5949"/>
                        <stop offset="55%" stopColor="#d6249f"/>
                        <stop offset="100%" stopColor="#285AEB"/>
                      </radialGradient>
                    </defs>
                    <rect width="38" height="38" rx="9" fill="url(#ig_rg)"/>
                    <rect x="4" y="4" width="30" height="30" rx="6" fill="none" stroke="white" strokeWidth="2.2"/>
                    <circle cx="19" cy="19" r="7.5" fill="none" stroke="white" strokeWidth="2.2"/>
                    <circle cx="28" cy="10" r="2" fill="white"/>
                  </svg>
                ),
              },
              {
                href: "https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi", label: "Play Store", handle: "Cranus Games",
                color: "#00e676", tag: "MOBİL", desc: "Android oyunlar — Ücretsiz",
                logo: (
                  <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,3 L20,19 L5,35 Q3,34 3,32 L3,6 Q3,4 5,3 Z" fill="#00D2FF"/>
                    <path d="M5,3 L26,13 L20,19 Z" fill="#FF3D00"/>
                    <path d="M26,25 L20,19 L5,35 Z" fill="#FFD600"/>
                    <path d="M30,16 Q33,17.5 33,19 Q33,20.5 30,22 L26,25 L20,19 L26,13 Z" fill="#00F076"/>
                  </svg>
                ),
              },
            ];
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "12px" }}>
                {SOCIALS.map((s, i) => (
                  <motion.a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    style={{ display: "flex", flexDirection: "column", padding: "20px 22px", textDecoration: "none",
                      border: `1px solid ${s.color}28`, background: `linear-gradient(135deg, ${s.color}0a 0%, rgba(0,0,0,0) 65%)`,
                      backdropFilter: "blur(10px)", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = s.color + "70"; el.style.background = `linear-gradient(135deg, ${s.color}18 0%, rgba(0,0,0,0) 65%)`; el.style.boxShadow = `0 0 35px ${s.color}22, inset 0 0 35px ${s.color}06`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = s.color + "28"; el.style.background = `linear-gradient(135deg, ${s.color}0a 0%, rgba(0,0,0,0) 65%)`; el.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div style={{ filter: `drop-shadow(0 0 10px ${s.color}88)` }}>{s.logo}</div>
                      <span style={{ fontSize: "0.48rem", letterSpacing: "0.18em", color: s.color + "90", fontFamily: "monospace",
                        padding: "3px 8px", border: `1px solid ${s.color}35`, background: `${s.color}0d` }}>{s.tag}</span>
                    </div>
                    <span style={{ fontSize: "1.05rem", fontWeight: "bold", color: "var(--text)", marginBottom: "3px" }}>{s.label}</span>
                    <span style={{ fontSize: "0.6rem", color: s.color + "aa", fontFamily: "monospace", marginBottom: "12px" }}>{s.handle}</span>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span style={{ fontSize: "0.68rem", color: "rgba(220,200,230,0.45)" }}>{s.desc}</span>
                      <span style={{ fontSize: "0.75rem", color: s.color + "70" }}>→</span>
                    </div>
                    <div style={{ position: "absolute", bottom: -30, right: -30, width: 90, height: 90, borderRadius: "50%",
                      background: `radial-gradient(circle, ${s.color}14 0%, transparent 70%)`, pointerEvents: "none" }} />
                  </motion.a>
                ))}
              </div>
            );
          })()}

          {/* Bottom row: Den Den Mushi + Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "stretch" }}>

            {/* Den Den Mushi */}
            <motion.a href="https://play.google.com/store/apps/details?id=com.cranusgames.DenDenMushi"
              target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.35 }}
              whileHover={{ y: -3 }}
              style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 20px",
                border: "1px solid rgba(255,0,128,0.2)", background: "linear-gradient(135deg, rgba(255,0,128,0.07) 0%, rgba(0,0,0,0) 70%)",
                backdropFilter: "blur(10px)", textDecoration: "none", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,110,200,0.5)"; el.style.boxShadow = "0 0 30px rgba(255,0,128,0.18)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,0,128,0.2)"; el.style.boxShadow = "none"; }}>
              <img src="https://play-lh.googleusercontent.com/tS8rp0bZ9S4SNaryOpRr3XC92ta3osaxhPWzLTFZXFwOo2shIkpp__tUX7QWPoNy_a0MG0C8uCmNc4e831BG=w240-h480-rw"
                alt="Den Den Mushi" style={{ width: "62px", height: "62px", objectFit: "cover",
                  border: "1px solid rgba(255,110,200,0.35)", flexShrink: 0, borderRadius: "8px" }} />
              <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.5rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#ff6ec7", fontFamily: "monospace", marginBottom: "3px" }}>
                  ◉ Android · Play Store
                </p>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--text)", marginBottom: "3px" }}>Den Den Mushi</h3>
                <p style={{ fontSize: "0.68rem", color: "rgba(220,200,230,0.45)", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Ana odada sadece bir buton var. Basarsan rastgele birisi seni arayacak…
                </p>
              </div>
              <span style={{ fontSize: "0.65rem", color: "#ff6ec7", fontFamily: "monospace", flexShrink: 0, opacity: 0.7 }}>İNDİR →</span>
            </motion.a>

            {/* Email icon button */}
            <motion.a href="mailto:aycibinemirhan5353@gmail.com"
              title="aycibinemirhan5353@gmail.com"
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.45 }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                width: "72px", alignSelf: "stretch",
                border: "1px solid rgba(255,110,200,0.22)",
                background: "linear-gradient(135deg, rgba(255,110,200,0.08) 0%, rgba(0,0,0,0) 70%)",
                backdropFilter: "blur(10px)", textDecoration: "none", transition: "all 0.3s", position: "relative" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,110,200,0.6)"; el.style.boxShadow = "0 0 28px rgba(255,110,200,0.2)"; el.style.background = "linear-gradient(135deg, rgba(255,110,200,0.15) 0%, rgba(0,0,0,0) 70%)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,110,200,0.22)"; el.style.boxShadow = "none"; el.style.background = "linear-gradient(135deg, rgba(255,110,200,0.08) 0%, rgba(0,0,0,0) 70%)"; }}>
              <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,110,200,0.6))" }}>
                <rect x="1" y="1" width="28" height="22" rx="4" stroke="#ff6ec7" strokeWidth="1.8"/>
                <path d="M1,5 L15,14 L29,5" stroke="#ff6ec7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </div>

          {/* Footer */}
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
            style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.54rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,110,200,0.25)", fontFamily: "monospace" }}>
            © 2025 Emirhan Aycibin — Cranus Games Studio
          </motion.p>
        </div>
      </section>
    </div>
  );
}
