import sharp from "sharp";
import { readFileSync } from "fs";

const W = 1200, H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="50%" stop-color="#0a0012"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="nameGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8e0d0"/>
      <stop offset="30%" stop-color="#c8a96e"/>
      <stop offset="65%" stop-color="#ff6ec7"/>
      <stop offset="100%" stop-color="#e8e0d0"/>
    </linearGradient>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="40%" stop-color="#c8a96e"/>
      <stop offset="60%" stop-color="#ff6ec7"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7928ca" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff6ec7" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Glow blobs -->
  <ellipse cx="600" cy="315" rx="520" ry="280" fill="url(#glow1)"/>
  <ellipse cx="600" cy="315" rx="380" ry="200" fill="url(#glow2)"/>

  <!-- Synthwave grid — bottom -->
  <g opacity="0.22">
    ${Array.from({length: 12}, (_, i) => {
      const y = H - 60 + i * 30;
      const perspective = 1 - i * 0.06;
      const xOff = (1 - perspective) * W * 0.5;
      return `<line x1="${xOff}" y1="${y}" x2="${W - xOff}" y2="${y}" stroke="#7928ca" stroke-width="0.8"/>`;
    }).join("\n    ")}
    ${Array.from({length: 13}, (_, i) => {
      const xFrac = i / 12;
      const x1 = xFrac * W;
      const x2 = W * 0.1 + xFrac * W * 0.8;
      return `<line x1="${x1}" y1="${H}" x2="${x2}" y2="${H - 60}" stroke="#7928ca" stroke-width="0.8"/>`;
    }).join("\n    ")}
  </g>

  <!-- Top border line -->
  <line x1="0" y1="1" x2="${W}" y2="1" stroke="url(#lineGrad)" stroke-width="1.5"/>
  <!-- Bottom border line -->
  <line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="url(#lineGrad)" stroke-width="1.5"/>

  <!-- CRT scanlines overlay -->
  <rect width="${W}" height="${H}" fill="none" opacity="0.04"
    style="background: repeating-linear-gradient(0deg, transparent, transparent 3px, #000 3px, #000 4px)"/>

  <!-- Studio label -->
  <text x="${W / 2}" y="198" text-anchor="middle"
    font-family="monospace" font-size="16" letter-spacing="10"
    fill="#c8a96e" opacity="0.85" text-transform="uppercase">
    CRANUS GAMES STUDIO
  </text>

  <!-- Main name -->
  <text x="${W / 2}" y="305" text-anchor="middle"
    font-family="Georgia, serif" font-size="88" font-weight="bold"
    fill="url(#nameGrad)" letter-spacing="-2">
    EMİRHAN AYCİBİN
  </text>

  <!-- Gradient separator line -->
  <line x1="440" y1="335" x2="760" y2="335" stroke="url(#lineGrad)" stroke-width="1.5"/>

  <!-- Tagline -->
  <text x="${W / 2}" y="390" text-anchor="middle"
    font-family="monospace" font-size="20" letter-spacing="5"
    fill="#ff6ec7" opacity="0.7">
    INDIE GAME DEVELOPER
  </text>

  <!-- Stats row -->
  <g font-family="monospace" text-anchor="middle">
    <!-- Stat 1 -->
    <text x="390" y="470" font-size="36" font-weight="bold" fill="#c8a96e">33</text>
    <text x="390" y="492" font-size="11" letter-spacing="3" fill="#c8a96e" opacity="0.55">OYUN</text>
    <!-- Divider -->
    <line x1="480" y1="455" x2="480" y2="490" stroke="rgba(200,169,110,0.2)" stroke-width="1"/>
    <!-- Stat 2 -->
    <text x="530" y="470" font-size="36" font-weight="bold" fill="#ff6ec7">21</text>
    <text x="530" y="492" font-size="11" letter-spacing="3" fill="#ff6ec7" opacity="0.55">GAME JAM</text>
    <!-- Divider -->
    <line x1="620" y1="455" x2="620" y2="490" stroke="rgba(200,169,110,0.2)" stroke-width="1"/>
    <!-- Stat 3 -->
    <text x="670" y="470" font-size="36" font-weight="bold" fill="#00d4ff">5+</text>
    <text x="670" y="492" font-size="11" letter-spacing="3" fill="#00d4ff" opacity="0.55">YIL</text>
    <!-- Divider -->
    <line x1="760" y1="455" x2="760" y2="490" stroke="rgba(200,169,110,0.2)" stroke-width="1"/>
    <!-- Stat 4 -->
    <text x="810" y="470" font-size="36" font-weight="bold" fill="#7928ca">∞</text>
    <text x="810" y="492" font-size="11" letter-spacing="3" fill="#7928ca" opacity="0.55">FİKİR</text>
  </g>

  <!-- URL bar -->
  <rect x="460" y="555" width="280" height="30" rx="2"
    fill="rgba(200,169,110,0.06)" stroke="rgba(200,169,110,0.25)" stroke-width="1"/>
  <text x="600" y="574" text-anchor="middle"
    font-family="monospace" font-size="13" letter-spacing="2"
    fill="#c8a96e" opacity="0.6">
    cranusgames.github.io/cranusweb
  </text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile("public/og.png");

console.log("✓ public/og.png created (1200×630)");
