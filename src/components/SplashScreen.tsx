import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  speedFactor: number;
  lastX: number;
  lastY: number;
  type: 'star' | 'diamond' | 'cross' | 'dot' | 'text';
  color: string;
  twinklePhase: number;
  char?: string;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Core Functional States
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [sloganVisible, setSloganVisible] = useState(false);
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [internalTransitionTrigger, setInternalTransitionTrigger] = useState(false);

  // Store interactive mouse position for real-time physics simulation
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Safe ref for onComplete callback to avoid timing resets on state mutations
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Terminal Typing Log Emulator Sequence
  useEffect(() => {
    const bootLogs = [
      "> QUANTUM AI CORE: INITIALIZING...",
      "> ANALYZING 2.4M MARKET PARAMETERS...",
      "> NEURAL NETWORK EFFICIENCY: 99.98%",
      "> DECRYPTING GLOBAL ASSET TRENDS...",
      "> PREDICTIVE RISK MODELS: ALIGNED & SECURE.",
      "> QUANTUM ANALYSIS COMPLETE. ACCESS GRANTED."
    ];

    let logIndex = 0;
    let charIndex = 0;
    let currentLine = "";
    let activeTimeout: any = null;

    const typeLog = () => {
      if (logIndex < bootLogs.length) {
        if (charIndex < bootLogs[logIndex].length) {
          currentLine += bootLogs[logIndex].charAt(charIndex);
          charIndex++;

          setTerminalLines(prev => {
            const updated = [...prev];
            if (updated.length === logIndex) {
              return [...updated, currentLine];
            } else {
              updated[logIndex] = currentLine;
              return updated;
            }
          });

          activeTimeout = setTimeout(typeLog, 12);
        } else {
          logIndex++;
          charIndex = 0;
          currentLine = "";
          activeTimeout = setTimeout(typeLog, 250);
        }
      }
    };

    // Show terminal and start typing after 300ms
    const startDelay = setTimeout(() => {
      setTerminalVisible(true);
      typeLog();
    }, 300);

    return () => {
      clearTimeout(startDelay);
      if (activeTimeout) clearTimeout(activeTimeout);
    };
  }, []);

  // Full-Screen Canvas Particle Engine and Phase Timeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationStage = 1; // 1: Scatter-Burst, 2: Magnet-Collapse, 3: Solid text
    let particles: Particle[] = [];
    let textTargetPoints: { x: number; y: number }[] = [];
    let globalTransitionAlpha = 0;

    const activeTimeouts: any[] = [];
    const activeIntervals: any[] = [];

    const safeTimeout = (cb: () => void, delay: number) => {
      const id = setTimeout(cb, delay);
      activeTimeouts.push(id);
      return id;
    };

    const safeInterval = (cb: () => void, delay: number) => {
      const id = setInterval(cb, delay);
      activeIntervals.push(id);
      return id;
    };

    const generateTextTargetsAndParticles = () => {
      textTargetPoints = [];
      particles = [];

      // Defensive constraints guard against 0 dimension
      if (width <= 0 || height <= 0) return;

      try {
        const fontSize = Math.min(width * 0.12, 130);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Portli", width / 2, height / 2);

        const imgData = ctx.getImageData(0, 0, width, height);
        ctx.clearRect(0, 0, width, height);

        const step = 3;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4 + 3;
            if (pixelIndex < imgData.data.length && imgData.data[pixelIndex] > 140) {
              textTargetPoints.push({ x, y });
            }
          }
        }
      } catch (err) {
        console.warn("Canvas buffer analysis bypassed safely: ", err);
      }

      const colors = ['rgba(0, 242, 254, 1)', 'rgba(255, 255, 255, 1)', 'rgba(57, 255, 182, 1)', 'rgba(245, 194, 73, 1)'];
      const types: ('star' | 'diamond' | 'cross' | 'dot' | 'text')[] = ['star', 'star', 'star', 'dot', 'diamond', 'cross', 'text'];
      const chars = ['0', '1', '$', '€', '₿'];

      textTargetPoints.forEach((target) => {
        const angle = Math.random() * Math.PI * 2;
        const scatterSpeed = Math.random() * 4 + 1;
        const pType = types[Math.floor(Math.random() * types.length)];
        const pColor = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x: target.x,
          y: target.y,
          vx: Math.cos(angle) * scatterSpeed,
          vy: Math.sin(angle) * scatterSpeed,
          targetX: target.x,
          targetY: target.y,
          size: pType === 'star' ? Math.random() * 0.8 + 0.3 : Math.random() * 1.5 + 0.8,
          alpha: 0,
          maxAlpha: Math.random() * 0.5 + 0.3,
          speedFactor: Math.random() * 0.05 + 0.02,
          lastX: target.x,
          lastY: target.y,
          type: pType,
          color: pColor,
          twinklePhase: Math.random() * Math.PI * 2,
          char: pType === 'text' ? chars[Math.floor(Math.random() * chars.length)] : undefined,
        });
      });
    };

    generateTextTargetsAndParticles();

    // 60FPS OLED Accelerated Physics loop with motion streaks
    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      if (animationStage === 1 || animationStage === 2) {
        particles.forEach((p, index) => {
          p.lastX = p.x;
          p.lastY = p.y;

          if (p.alpha < p.maxAlpha && animationStage === 1) {
            p.alpha += 0.015;
          }

          // Interactive magnet push displacement
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          let pushX = 0;
          let pushY = 0;

          if (mDist < 120) {
            const force = (120 - mDist) / 120;
            pushX = (mdx / mDist) * force * 3;
            pushY = (mdy / mDist) * force * 3;
          }

          if (animationStage === 1) {
            p.x += p.vx + pushX;
            p.y += p.vy + pushY;

            // Apply friction/decay to explode gently
            p.vx *= 0.97;
            p.vy *= 0.97;

            // Boundary collision safety
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
          } else if (animationStage === 2) {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.x += (dx * p.speedFactor) + pushX * 0.5;
            p.y += (dy * p.speedFactor) + pushY * 0.5;
            p.alpha = 0.85;
          }

          let currentAlpha = p.alpha;
          // FUSIONE LENTA: Riduce gradualmente l'opacità delle singole particelle mentre il testo pieno cresce
          if (globalTransitionAlpha > 0) {
            currentAlpha = p.alpha * (1 - globalTransitionAlpha);
          }

          // Render motion streak lines for dynamic financial cyber feelings
          const speedX = p.x - p.lastX;
          const speedY = p.y - p.lastY;
          const currentSpeed = Math.sqrt(speedX * speedX + speedY * speedY);

          // Apply Twinkle effect
          const twinkleAlpha = p.type === 'star' ? currentAlpha * (0.6 + 0.4 * Math.sin(Date.now() * 0.003 + p.twinklePhase)) : currentAlpha;

          // Drawing Constellation/Neural Connections (only in stage 1 or early stage 2)
          if (animationStage === 1 || (animationStage === 2 && currentSpeed > 0.5)) {
            // Check proximity to a few subsequent particles to draw lines
            for (let j = index + 1; j < Math.min(index + 4, particles.length); j++) {
              const other = particles[j];
              const distSq = (p.x - other.x) ** 2 + (p.y - other.y) ** 2;
              if (distSq < 2500) { // roughly 50px distance
                const lineAlpha = (1 - distSq / 2500) * twinkleAlpha * 0.3;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = p.color.replace('1)', `${lineAlpha})`);
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }

          if (animationStage === 2 && currentSpeed > 1.5) {
            ctx.beginPath();
            ctx.moveTo(p.lastX, p.lastY);
            ctx.lineTo(p.x, p.y);
            ctx.lineWidth = p.size;
            ctx.strokeStyle = p.color.replace('1)', `${twinkleAlpha})`);
            ctx.stroke();
          } else {
            ctx.fillStyle = p.color.replace('1)', `${twinkleAlpha})`);
            ctx.strokeStyle = p.color.replace('1)', `${twinkleAlpha})`);
            ctx.lineWidth = 1;

            if (p.type === 'star' || p.type === 'dot') {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.type === 'diamond') {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y - p.size);
              ctx.lineTo(p.x + p.size, p.y);
              ctx.lineTo(p.x, p.y + p.size);
              ctx.lineTo(p.x - p.size, p.y);
              ctx.closePath();
              ctx.fill();
            } else if (p.type === 'cross') {
              ctx.beginPath();
              ctx.moveTo(p.x - p.size, p.y);
              ctx.lineTo(p.x + p.size, p.y);
              ctx.moveTo(p.x, p.y - p.size);
              ctx.lineTo(p.x, p.y + p.size);
              ctx.stroke();
            } else if (p.type === 'text' && p.char) {
              ctx.font = `bold ${p.size * 5}px monospace`;
              ctx.fillText(p.char, p.x, p.y);
            }
          }
        });
      }

      // Smoothly overlay the white vector display word logo
      if (animationStage === 3 || globalTransitionAlpha > 0) {
        // MODIFICATO: Incremento ridotto da 0.04 a 0.012 per una transizione fluida e rallentata come da HTML originale
        if (animationStage === 3 && globalTransitionAlpha < 1) {
          globalTransitionAlpha += 0.012;
        }

        const fontSize = Math.min(width * 0.12, 130);
        ctx.fillStyle = `rgba(255, 255, 255, ${globalTransitionAlpha})`;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowBlur = 15 * globalTransitionAlpha;
        ctx.shadowColor = '#00f2fe';
        ctx.fillText("Portli", width / 2, height / 2);
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Cinematic Stage Triggers
    safeTimeout(() => {
      animationStage = 2; // collapse particles back into text
    }, 2000);

    safeTimeout(() => {
      globalTransitionAlpha = 0.01;
      safeTimeout(() => {
        animationStage = 3; // Solid white text overlay
      }, 100);

      setSloganVisible(true);
      setLoadingBarVisible(true);

      // Bloomberg style progression loading bar (2.5% progress every 45ms) come da HTML originale
      let progress = 0;
      const progressInterval = safeInterval(() => {
        progress += 2.5;
        setLoadingProgress(Math.min(100, progress));

        if (progress >= 100) {
          clearInterval(progressInterval);

          // Once loading bar hits 100%, trigger biometric cyber glow
          safeTimeout(() => {
            setInternalTransitionTrigger(true);
            safeTimeout(() => {
              onCompleteRef.current();
            }, 200);
          }, 500); // Più tempo per godersi lo stato finale fuso come da HTML originale
        }
      }, 45);
    }, 4500);

    // Dynamic responsive sizing safety bounds
    let resizeTimeout: any;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        generateTextTargetsAndParticles();
      }, 250);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      activeTimeouts.forEach(clearTimeout);
      activeIntervals.forEach(clearInterval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Parallax subtle camera offsets on mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (internalTransitionTrigger) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const distX = (e.clientX - cx) * 0.02;
      const distY = (e.clientY - cy) * 0.02;

      const parallax = parallaxContainerRef.current;
      if (parallax) {
        parallax.style.transform = `translate3d(${distX}px, ${distY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      
      const parallax = parallaxContainerRef.current;
      if (parallax) {
        parallax.style.transform = `translate3d(0px, 0px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [internalTransitionTrigger]);

  return (
    <motion.div
      id="cyber-container"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: internalTransitionTrigger ? "inset 0 0 150px rgba(0, 242, 254, 0.3)" : "inset 0 0 0px rgba(0,0,0,0)"
      }}
      exit={{ 
        opacity: 0,
        scale: 1.06,
        transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
      }}
      ref={containerRef}
      className={`fixed inset-0 z-[999999] h-screen w-full overflow-hidden bg-[#000000] text-white flex flex-col justify-center items-center transition-all duration-300 ${internalTransitionTrigger ? 'opacity-0 scale-[1.06] pointer-events-none blur-[8px]' : ''}`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }

        .scanline-style {
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
          animation: scan 5s linear infinite;
        }
      ` }} />

      {/* OLED Absolute Ambient Scanline radar */}
      <div className="absolute top-[-100%] left-0 w-full h-3 bg-cyan-400/5 scanline-style pointer-events-none z-0" />

      {/* Unified Parallax Wrapper */}
      <div 
        ref={parallaxContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-200 ease-out z-10"
      >
        {/* Physics Canvas */}
        <canvas 
          ref={canvasRef} 
          id="quantumCanvas"
          className="absolute inset-0 w-full h-full" 
        />

        {/* Slogan Container */}
        <div 
          id="sloganContainer"
          className="absolute top-[calc(50%+75px)] left-1/2 flex flex-col items-center"
          style={{ transform: 'translate(calc(-50% + 35px), 0px)' }}
        >
          <div 
            className="brand-slogan w-full text-center pl-[4.5px] text-[#52596d] text-[10px] md:text-xs font-semibold tracking-[4.5px] whitespace-nowrap mb-2 transition-all duration-1000 ease-out"
            style={{
              opacity: sloganVisible ? 1 : 0,
              transform: sloganVisible ? 'translateY(0px)' : 'translateY(10px)',
              textShadow: sloganVisible ? '0 0 10px rgba(0, 242, 254, 0.2)' : 'none'
            }}
          >
            ENGINEERING THE EVOLUTION OF DIGITAL CAPITAL.
          </div>
          {/* Slogan underline scanner */}
          <div 
            className="neon-line h-[1px] bg-gradient-to-r from-transparent via-[#00f2fe] to-transparent transition-all duration-2000 ease-out"
            style={{
              width: sloganVisible ? '320px' : '0px',
              boxShadow: '0 0 8px #00f2fe'
            }}
          />
        </div>
      </div>

      {/* Bloomberg-style progress loading tracker */}
      <div 
        id="loadingContainer"
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[280px] h-[2px] bg-white/[0.02] transition-opacity duration-500 z-30 overflow-hidden"
        style={{ opacity: loadingBarVisible ? 1 : 0 }}
      >
        <div 
          id="loadingBar"
          className="h-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-75"
          style={{ 
            width: `${loadingProgress}%`,
            boxShadow: '0 0 12px #00f2fe' 
          }}
        />
      </div>

      {/* Terminal logs list */}
      <div 
        ref={terminalRef}
        id="terminal-text"
        className="absolute bottom-[8%] left-[5%] text-[#00f2fe] text-xs font-mono tracking-[2px] leading-relaxed transition-opacity duration-1000 z-20 pointer-events-none"
        style={{ 
          opacity: terminalVisible ? 1 : 0,
          textShadow: '0 0 5px rgba(0, 242, 254, 0.4)' 
        }}
      >
        {terminalLines.map((line, idx) => (
          <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
    </motion.div>
  );
}
