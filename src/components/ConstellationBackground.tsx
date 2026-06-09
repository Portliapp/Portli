import React, { useEffect, useRef, useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
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
  color: string;
}

/**
 * ConstellationBackground — A full-screen animated starfield with:
 *   - ~200 twinkling stars of various sizes and colors (white, cyan, purple)
 *   - Constellation lines connecting nearby stars
 *   - Periodic shooting stars streaking across the sky
 *   - Subtle mouse parallax interaction
 *   - Soft animated nebula color washes
 */
export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const animFrameRef = useRef<number>(0);

  // Deterministic star positions (seeded once) so they don't flicker on re-render
  const starSeed = useMemo(() => Math.random(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let time = 0;

    const starColors = [
      '#ffffff',   // white
      '#d4e5ff',   // cool white
      '#a8c8ff',   // light blue
      '#00c2ff',   // portli cyan
      '#c4a0ff',   // light purple
      '#863bff',   // portli purple
    ];

    function seededRandom(seed: number) {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }

    function initStars() {
      const rng = seededRandom(Math.floor(starSeed * 100000));
      const count = Math.min(220, Math.floor((width * height) / 6000));
      stars = [];
      
      for (let i = 0; i < count; i++) {
        const isBright = rng() < 0.15;
        stars.push({
          x: rng() * width,
          y: rng() * height,
          radius: isBright ? rng() * 2.2 + 1.2 : rng() * 1.2 + 0.3,
          baseAlpha: isBright ? rng() * 0.4 + 0.5 : rng() * 0.3 + 0.15,
          alpha: 0,
          twinkleSpeed: rng() * 0.02 + 0.005,
          twinklePhase: rng() * Math.PI * 2,
          color: starColors[Math.floor(rng() * starColors.length)],
        });
      }
    }

    function spawnShootingStar() {
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -20 : width + 20;
      const y = Math.random() * height * 0.6;
      const angle = fromLeft 
        ? (Math.random() * 0.4 + 0.1) * Math.PI 
        : (Math.random() * 0.4 + 0.55) * Math.PI;
      const speed = Math.random() * 8 + 6;
      const life = Math.random() * 80 + 60;

      shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 40,
        alpha: 1,
        life,
        maxLife: life,
        color: Math.random() > 0.5 ? '#00c2ff' : '#ffffff',
      });
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function drawNebulaWashes() {
      // Soft purple wash top-left
      const grad1 = ctx.createRadialGradient(
        width * 0.15 + Math.sin(time * 0.0003) * 40,
        height * 0.2 + Math.cos(time * 0.0004) * 30,
        0,
        width * 0.15, height * 0.2,
        width * 0.45
      );
      grad1.addColorStop(0, 'rgba(134, 59, 255, 0.12)');
      grad1.addColorStop(0.5, 'rgba(134, 59, 255, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Soft cyan wash bottom-right
      const grad2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(time * 0.00025) * 50,
        height * 0.75 + Math.sin(time * 0.00035) * 40,
        0,
        width * 0.8, height * 0.75,
        width * 0.4
      );
      grad2.addColorStop(0, 'rgba(0, 194, 255, 0.1)');
      grad2.addColorStop(0.5, 'rgba(0, 194, 255, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);
    }

    function drawConstellationLines() {
      const maxDist = 120;
      ctx.lineWidth = 0.4;

      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        if (a.radius < 0.8) continue; // only connect bigger stars

        let connections = 0;
        for (let j = i + 1; j < stars.length; j++) {
          if (connections >= 2) break;
          const b = stars[j];
          if (b.radius < 0.8) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.15 * Math.min(a.alpha, b.alpha);
            ctx.strokeStyle = `rgba(100, 180, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            connections++;
          }
        }
      }
    }

    function drawStars() {
      for (const star of stars) {
        // Twinkle
        star.alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * star.baseAlpha * 0.5;

        // Mouse proximity glow boost
        if (mouseRef.current.x > 0) {
          const dx = star.x - mouseRef.current.x;
          const dy = star.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const boost = (1 - dist / 200) * 0.4;
            star.alpha = Math.min(1, star.alpha + boost);
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        // Glow for brighter stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 3
          );
          glow.addColorStop(0, star.color);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.globalAlpha = star.alpha * 0.3;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life--;
        s.alpha = Math.min(1, s.life / s.maxLife * 2);

        if (s.life <= 0 || s.x < -200 || s.x > width + 200 || s.y > height + 200) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Trail
        const tailX = s.x - (s.vx / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, s.color);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.alpha;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function animate() {
      time++;
      ctx.clearRect(0, 0, width, height);

      drawNebulaWashes();
      drawConstellationLines();
      drawStars();
      drawShootingStars();

      // Random shooting star spawn
      if (Math.random() < 0.008) {
        spawnShootingStar();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    // Mouse tracking
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    function onMouseLeave() {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', resize);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, [starSeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
}
