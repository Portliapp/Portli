import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

// ─── Color Palette ────────────────────────────────
const C = {
  midnight:  '#050816',
  navy:      '#081423',
  emerald:   '#00D1B2',
  cyan:      '#16D9FF',
  softWhite: '#E8F6FF',
  aurora:    '#39FFB6',
};

// ─── Particle Types ───────────────────────────────
interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  isLogo: boolean;        // belongs to logo formation
  constellationGroup: number; // for constellation connections
}

interface Connection {
  a: number;
  b: number;
  alpha: number;
  pulseOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  life: number;
  maxLife: number;
}

// ═══════════════════════════════════════════════════
//  PORTLI CINEMATIC OPENING SEQUENCE
// ═══════════════════════════════════════════════════
export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // UI overlay states driven by scene timeline
  const [showLogo, setShowLogo] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    let startTime = 0;
    let stars: Star[] = [];
    let connections: Connection[] = [];
    let shootingStars: ShootingStar[] = [];
    let logoTargets: { x: number; y: number }[] = [];
    let constellationTargets: { x: number; y: number }[] = [];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ─── Resize ───────────────────────────────────
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // ─── Extract Logo Pixel Targets ───────────────
    function extractLogoTargets() {
      logoTargets = [];
      if (W <= 0 || H <= 0) return;
      
      const fontSize = Math.min(W * 0.10, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PORTLI', W / 2, H / 2);

      try {
        const imgData = ctx.getImageData(0, 0, W * dpr, H * dpr);
        ctx.clearRect(0, 0, W, H);

        const step = 4;
        for (let y = 0; y < H * dpr; y += step) {
          for (let x = 0; x < W * dpr; x += step) {
            const idx = (y * W * dpr + x) * 4 + 3;
            if (idx < imgData.data.length && imgData.data[idx] > 120) {
              logoTargets.push({ x: x / dpr, y: y / dpr });
            }
          }
        }
      } catch {
        ctx.clearRect(0, 0, W, H);
      }
    }

    // ─── Extract Constellation Logo Targets ───────
    function extractConstellationTargets() {
      constellationTargets = [];
      if (W <= 0 || H <= 0) return;

      const fontSize = Math.min(W * 0.14, 140);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PORTLI', W / 2, H / 2);

      try {
        const imgData = ctx.getImageData(0, 0, W * dpr, H * dpr);
        ctx.clearRect(0, 0, W, H);

        // Much sparser sampling for constellation effect (only ~60-80 points)
        const step = Math.max(16, Math.floor(W * dpr / 80));
        for (let y = 0; y < H * dpr; y += step) {
          for (let x = 0; x < W * dpr; x += step) {
            const idx = (y * W * dpr + x) * 4 + 3;
            if (idx < imgData.data.length && imgData.data[idx] > 120) {
              constellationTargets.push({ x: x / dpr, y: y / dpr });
            }
          }
        }
      } catch {
        ctx.clearRect(0, 0, W, H);
      }
    }

    // ─── Initialize Stars ─────────────────────────
    function initStars() {
      stars = [];
      connections = [];
      
      extractLogoTargets();
      extractConstellationTargets();

      const starCount = Math.min(350, Math.floor((W * H) / 4000));
      const starColors = [C.softWhite, '#d4e5ff', '#a8c8ff', C.cyan, '#c4b8ff'];

      for (let i = 0; i < starCount; i++) {
        const isBright = Math.random() < 0.12;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          targetX: 0,
          targetY: 0,
          size: isBright ? Math.random() * 2.0 + 1.0 : Math.random() * 1.0 + 0.3,
          alpha: 0,
          maxAlpha: isBright ? Math.random() * 0.3 + 0.5 : Math.random() * 0.2 + 0.1,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.003,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          isLogo: false,
          constellationGroup: Math.floor(Math.random() * 8),
        });
      }

      // Assign logo targets to some stars
      const logoStarCount = Math.min(logoTargets.length, stars.length - 40);
      for (let i = 0; i < logoStarCount; i++) {
        const starIdx = i;
        stars[starIdx].targetX = logoTargets[i].x;
        stars[starIdx].targetY = logoTargets[i].y;
        stars[starIdx].isLogo = true;
      }
    }

    // ─── Spawn Shooting Star ──────────────────────
    function spawnShootingStar() {
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -30 : W + 30;
      const y = Math.random() * H * 0.7;
      const angle = fromLeft
        ? Math.random() * 0.3 + 0.15
        : Math.PI - (Math.random() * 0.3 + 0.15);
      const speed = Math.random() * 6 + 5;
      const life = Math.random() * 70 + 50;

      shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 100 + 50,
        alpha: 1,
        life,
        maxLife: life,
      });
    }

    // ─── Draw Nebula Washes ───────────────────────
    function drawNebulae(t: number, intensity: number) {
      // Purple wash top-left
      const g1 = ctx.createRadialGradient(
        W * 0.18 + Math.sin(t * 0.0002) * 30, H * 0.22 + Math.cos(t * 0.0003) * 20, 0,
        W * 0.18, H * 0.22, W * 0.38
      );
      g1.addColorStop(0, `rgba(100, 50, 200, ${0.08 * intensity})`);
      g1.addColorStop(0.6, `rgba(80, 40, 180, ${0.02 * intensity})`);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // Cyan wash bottom-right
      const g2 = ctx.createRadialGradient(
        W * 0.78 + Math.cos(t * 0.00018) * 40, H * 0.72 + Math.sin(t * 0.00025) * 30, 0,
        W * 0.78, H * 0.72, W * 0.35
      );
      g2.addColorStop(0, `rgba(0, 180, 220, ${0.06 * intensity})`);
      g2.addColorStop(0.6, `rgba(0, 160, 200, ${0.015 * intensity})`);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // Emerald accent center-bottom
      const g3 = ctx.createRadialGradient(
        W * 0.5 + Math.sin(t * 0.00015) * 50, H * 0.85, 0,
        W * 0.5, H * 0.85, W * 0.25
      );
      g3.addColorStop(0, `rgba(57, 255, 182, ${0.03 * intensity})`);
      g3.addColorStop(1, 'transparent');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, W, H);
    }

    // ─── Draw Stars ───────────────────────────────
    function drawStars(t: number) {
      for (const s of stars) {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const a = s.alpha + twinkle * s.alpha * 0.3;
        if (a <= 0.005) continue;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.min(1, a);
        ctx.fill();

        // Subtle glow for bright stars
        if (s.size > 1.2 && a > 0.3) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
          glow.addColorStop(0, s.color);
          glow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.globalAlpha = a * 0.2;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // ─── Draw Connections ─────────────────────────
    function drawConnections(t: number, maxDist: number, baseAlpha: number) {
      ctx.lineWidth = 0.5;

      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        if (a.alpha < 0.1 || a.size < 0.6) continue;

        let drawn = 0;
        for (let j = i + 1; j < stars.length && drawn < 2; j++) {
          const b = stars[j];
          if (b.alpha < 0.1 || b.size < 0.6) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const fade = 1 - dist / maxDist;
            const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + i * 0.1);
            const la = fade * baseAlpha * Math.min(a.alpha, b.alpha) * pulse;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(22, 217, 255, ${la})`;
            ctx.stroke();
            drawn++;
          }
        }
      }
    }

    // ─── Draw Constellation Lines ─────────────────
    function drawConstellationLines(progress: number) {
      if (constellationTargets.length < 2) return;

      ctx.lineWidth = 0.8;

      // Connect constellation points in sequence (like star maps)
      for (let i = 0; i < constellationTargets.length - 1; i++) {
        const revealIndex = Math.floor(progress * constellationTargets.length);
        if (i >= revealIndex) break;

        const a = constellationTargets[i];
        const b = constellationTargets[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const alpha = Math.min(1, (revealIndex - i) / 3) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 209, 178, ${alpha})`;
          ctx.stroke();

          // Node dots at intersections
          ctx.beginPath();
          ctx.arc(a.x, a.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = C.softWhite;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    // ─── Draw Shooting Stars ──────────────────────
    function drawShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life--;
        s.alpha = Math.min(1, (s.life / s.maxLife) * 2);

        if (s.life <= 0 || s.x < -300 || s.x > W + 300 || s.y > H + 300) {
          shootingStars.splice(i, 1);
          continue;
        }

        const norm = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tailX = s.x - (s.vx / norm) * s.length;
        const tailY = s.y - (s.vy / norm) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, C.aurora);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = s.alpha * 0.7;
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = C.softWhite;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ─── Solid Logo Render ────────────────────────
    function drawSolidLogo(alpha: number) {
      if (alpha <= 0) return;
      const fontSize = Math.min(W * 0.10, 110);
      ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = C.softWhite;
      ctx.globalAlpha = alpha;

      // Subtle glow
      ctx.shadowBlur = 20 * alpha;
      ctx.shadowColor = C.cyan;
      ctx.fillText('PORTLI', W / 2, H / 2);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // ═══════════════════════════════════════════════
    //  MAIN ANIMATION LOOP
    // ═══════════════════════════════════════════════
    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // seconds
      const t = timestamp;

      // Clear with midnight black
      ctx.fillStyle = C.midnight;
      ctx.fillRect(0, 0, W, H);

      // ─── SCENE LOGIC ───────────────────────────

      // SCENE 1: THE VOID (0 - 1.5s)
      if (elapsed < 1.5) {
        const progress = elapsed / 1.5;
        // Stars fade in very slowly from nothing
        for (const s of stars) {
          s.alpha = Math.min(s.maxAlpha * 0.3, s.alpha + 0.001 * progress);
          s.x += s.vx * 0.3;
          s.y += s.vy * 0.3;
        }
        drawNebulae(t, progress * 0.3);
        drawStars(t);
      }

      // SCENE 2: DATA AWAKENING (1.5 - 3.5s)
      else if (elapsed < 3.5) {
        if (scene < 2) setScene(2);
        const progress = (elapsed - 1.5) / 2.0;
        
        for (const s of stars) {
          s.alpha = Math.min(s.maxAlpha, s.alpha + 0.005);
          s.x += s.vx;
          s.y += s.vy;
          // Boundary wrap
          if (s.x < 0) s.x = W;
          if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H;
          if (s.y > H) s.y = 0;
        }

        drawNebulae(t, 0.3 + progress * 0.5);
        drawStars(t);
        drawConnections(t, 80 + progress * 60, 0.1 + progress * 0.15);
      }

      // SCENE 3: PORTLI EMERGENCE (3.5 - 6s)
      else if (elapsed < 6) {
        if (scene < 3) setScene(3);
        const progress = (elapsed - 3.5) / 2.5;

        // Particles with logo targets get pulled toward their target
        for (const s of stars) {
          if (s.isLogo) {
            const dx = s.targetX - s.x;
            const dy = s.targetY - s.y;
            const easing = 0.02 + progress * 0.04;
            s.x += dx * easing;
            s.y += dy * easing;
            s.alpha = Math.min(0.9, s.alpha + 0.01);
            s.color = progress > 0.5 ? C.softWhite : s.color;
          } else {
            s.x += s.vx * 0.5;
            s.y += s.vy * 0.5;
            s.alpha = Math.min(s.maxAlpha * 0.6, s.alpha);
          }
        }

        drawNebulae(t, 0.6);
        drawStars(t);

        // Connections only among logo particles
        if (progress < 0.6) {
          drawConnections(t, 100, 0.15 * (1 - progress));
        }

        // Solid logo fades in during second half
        if (progress > 0.6) {
          drawSolidLogo((progress - 0.6) / 0.4);
        }

        // Show tagline text
        if (progress > 0.7 && !showLogo) setShowLogo(true);
        if (progress > 0.85 && !showTagline) setShowTagline(true);
      }

      // SCENE 4: PORTFOLIO BECOMES UNIVERSE (6 - 8s)
      else if (elapsed < 8) {
        if (scene < 4) setScene(4);
        const progress = (elapsed - 6) / 2.0;

        // Logo dissolves — particles drift upward
        const solidAlpha = Math.max(0, 1 - progress * 2);
        drawSolidLogo(solidAlpha);

        for (const s of stars) {
          if (s.isLogo) {
            // Drift upward and outward gracefully
            s.vy -= 0.02 * progress;
            s.vx += (Math.random() - 0.5) * 0.05;
            s.x += s.vx + (Math.random() - 0.5) * progress * 0.5;
            s.y += s.vy;
            s.alpha = Math.max(0.1, s.alpha - 0.003);
          } else {
            s.x += s.vx;
            s.y += s.vy;
            s.alpha = Math.min(s.maxAlpha, s.alpha + 0.003);
          }
        }

        // Hide text overlays
        if (progress > 0.3) {
          setShowLogo(false);
          setShowTagline(false);
        }

        drawNebulae(t, 0.5 + progress * 0.3);
        drawStars(t);
      }

      // SCENE 5: COSMIC INTELLIGENCE (8 - 13s)
      else if (elapsed < 13) {
        if (scene < 5) setScene(5);
        const progress = (elapsed - 8) / 5.0;

        // All stars become cosmic — full starfield
        for (const s of stars) {
          // Reset logo stars to roam freely
          if (s.isLogo && s.alpha < 0.05) {
            s.x = Math.random() * W;
            s.y = Math.random() * H;
            s.isLogo = false;
          }
          s.alpha = Math.min(s.maxAlpha, s.alpha + 0.002);
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = W;
          if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H;
          if (s.y > H) s.y = 0;
        }

        drawNebulae(t, 0.8 + progress * 0.2);
        drawStars(t);
        // Portfolio-like connections
        drawConnections(t, 100 + progress * 30, 0.12);

        // Occasional shooting star
        if (Math.random() < 0.005) spawnShootingStar();
        drawShootingStars();
      }

      // SCENE 6: THE PORTLI CONSTELLATION (13 - 16s)
      else if (elapsed < 16) {
        if (scene < 6) setScene(6);
        const progress = (elapsed - 13) / 3.0;

        for (const s of stars) {
          s.x += s.vx * 0.5;
          s.y += s.vy * 0.5;
          s.alpha = Math.min(s.maxAlpha, s.alpha);
          if (s.x < 0) s.x = W;
          if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H;
          if (s.y > H) s.y = 0;
        }

        drawNebulae(t, 1.0);
        drawStars(t);
        drawConstellationLines(progress);

        if (Math.random() < 0.004) spawnShootingStar();
        drawShootingStars();
      }

      // SCENE 7: SHOOTING STARS (16 - 18.5s)
      else if (elapsed < 18.5) {
        if (scene < 7) setScene(7);
        const progress = (elapsed - 16) / 2.5;

        for (const s of stars) {
          s.x += s.vx * 0.3;
          s.y += s.vy * 0.3;
          if (s.x < 0) s.x = W;
          if (s.x > W) s.x = 0;
          if (s.y < 0) s.y = H;
          if (s.y > H) s.y = 0;
        }

        drawNebulae(t, 1.0);
        drawStars(t);
        drawConstellationLines(1.0);

        // More frequent shooting stars in this scene
        if (Math.random() < 0.025) spawnShootingStar();
        drawShootingStars();
      }

      // SCENE 8: TRANSITION TO APP (18.5 - 21s)
      else if (elapsed < 21) {
        if (scene < 8) {
          setScene(8);
          setIsFadingOut(true);
        }
        const progress = (elapsed - 18.5) / 2.5;

        // Everything slowly blurs and fades
        for (const s of stars) {
          s.x += s.vx * 0.2;
          s.y += s.vy * 0.2;
          s.alpha = s.alpha * (1 - progress * 0.03);
        }

        drawNebulae(t, 1.0 - progress * 0.5);
        drawStars(t);
        drawConstellationLines(1.0);
        drawShootingStars();
      }

      // COMPLETE
      else {
        onCompleteRef.current();
        return;
      }

      animId = requestAnimationFrame(animate);
    }

    // ─── Setup ────────────────────────────────────
    resize();
    initStars();
    animId = requestAnimationFrame(animate);

    const onResize = () => {
      resize();
      extractLogoTargets();
      extractConstellationTargets();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[999999]"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isFadingOut ? 0 : 1,
        scale: isFadingOut ? 1.04 : 1,
        filter: isFadingOut ? 'blur(8px)' : 'blur(0px)',
      }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 2.5, ease: [0.76, 0, 0.24, 1] }}
      style={{ backgroundColor: C.midnight }}
    >
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Logo Text Overlay */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            {/* Tagline below logo */}
            <AnimatePresence>
              {showTagline && (
                <motion.div
                  className="flex flex-col items-center"
                  style={{ marginTop: `${Math.min(window.innerWidth * 0.10, 110) * 0.55 + 20}px` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
                >
                  {/* Separator line */}
                  <motion.div
                    style={{
                      height: '1px',
                      background: `linear-gradient(to right, transparent, ${C.emerald}, transparent)`,
                      marginBottom: '14px',
                      boxShadow: `0 0 8px ${C.emerald}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: 200 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <span
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '5px',
                      color: '#6b7a8d',
                      textTransform: 'uppercase',
                    }}
                  >
                    Track. Analyze. Grow.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette overlay — always present for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 ${Math.min(window.innerWidth, window.innerHeight) * 0.4}px ${C.midnight}`,
          zIndex: 5,
        }}
      />
    </motion.div>
  );
}
