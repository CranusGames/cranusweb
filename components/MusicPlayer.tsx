"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "ME7zewc9N9U";

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady?: (e: { target: { playVideo(): void; pauseVideo(): void } }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        }
      ) => {
        playVideo(): void;
        pauseVideo(): void;
        getPlayerState(): number;
      };
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show button after a short delay
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loadApi = () => {
      if (!document.getElementById("yt-api-script")) {
        const script = document.createElement("script");
        script.id = "yt-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: VIDEO_ID,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    loadApi();
  }, []);

  const toggle = () => {
    if (!playerRef.current || !ready) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <>
      {/* Hidden YouTube player */}
      <div
        style={{
          position: "fixed",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
          bottom: 0,
          left: 0,
        }}
      >
        <div ref={containerRef} />
      </div>

      {/* Floating music button */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <button
          onClick={toggle}
          title={playing ? "Müziği Durdur" : "Müziği Başlat"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
            background: "rgba(5,5,5,0.92)",
            border: `1px solid ${playing ? "var(--accent)" : "#2a2a2a"}`,
            color: playing ? "var(--accent)" : "var(--text-dim)",
            cursor: ready ? "pointer" : "default",
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            backdropFilter: "blur(8px)",
            transition: "border-color 0.3s, color 0.3s",
            opacity: ready ? 1 : 0.5,
          }}
          onMouseEnter={(e) => {
            if (!ready) return;
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            if (playing) return;
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)";
          }}
        >
          {/* Animated bars when playing, static note when paused */}
          {playing ? (
            <span style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "14px" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "3px",
                    background: "var(--accent)",
                    borderRadius: "1px",
                    animation: `musicBar 0.8s ease-in-out ${i * 0.2}s infinite alternate`,
                    height: `${6 + i * 4}px`,
                  }}
                />
              ))}
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
          )}
          <span>{playing ? "Çalıyor" : ready ? "Müzik" : "Yükleniyor..."}</span>
        </button>
      </div>

      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
