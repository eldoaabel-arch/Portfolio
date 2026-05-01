"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const scramble = (target: string, progress: number) =>
  target.split("").map((char, i) => {
    if (char === " ") return " ";
    if (i / target.length < progress) return char;
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }).join("");

export default function Main() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const cursorDot = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const mousePos = useRef({ x: -9999, y: -9999 });

  const [name, setName] = useState("XXXXXXXXXX");
  const [role, setRole] = useState("XXXXXXXXXXXXXXXXXXX");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.cursor = "none";
    return () => { document.body.style.cursor = ""; };
  }, []);

  useEffect(() => {
    const NAME_TARGET = "AABEL ELDO";
    const ROLE_TARGET = "FULL STACK ENGINEER";
    let frame = 0;
    const TOTAL = 55;
    const id = setInterval(() => {
      frame++;
      const p = frame / TOTAL;
      setName(scramble(NAME_TARGET, p));
      setRole(scramble(ROLE_TARGET, p));
      if (frame >= TOTAL) {
        clearInterval(id);
        setName(NAME_TARGET);
        setRole(ROLE_TARGET);
        setReady(true);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let W = 0, H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0;
      r = 0; alpha = 0; life = 0; maxLife = 0;
      constructor() { this.reset(true); }
      reset(random = false) {
        this.x = Math.random() * W;
        this.y = random ? Math.random() * H : H + 10;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.r = Math.random() * 1.8 + 0.4;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 400 + 200;
      }
      update() {
        const dx = this.x - mousePos.current.x;
        const dy = this.y - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const REPEL_RADIUS = 100;
        const REPEL_STRENGTH = 1.5;
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.vy -= 0.02;
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.y < -10) this.reset(false);
        if (this.life > this.maxLife) this.reset(true);
      }
      draw() {
        const fade =
          Math.min(this.life / 60, 1) *
          Math.min((this.maxLife - this.life) / 60, 1);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${this.alpha * fade})`;
        ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 140 }, () => new Particle());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#05080f";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(5,8,18,0.4)";
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120,170,255,${(1 - dist / 100) * 0.25})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        const cdx = particles[i].x - mousePos.current.x;
        const cdy = particles[i].y - mousePos.current.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.strokeStyle = `rgba(140,190,255,${(1 - cdist / 160) * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", move);

    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.1);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.1);
      if (cursorRing.current) {
        cursorRing.current.style.left = `${posRef.current.x - 20}px`;
        cursorRing.current.style.top  = `${posRef.current.y - 20}px`;
      }
      if (cursorDot.current) {
        cursorDot.current.style.left = `${targetRef.current.x - 3}px`;
        cursorDot.current.style.top  = `${targetRef.current.y - 3}px`;
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRing} style={{
        position: "fixed",
        top: -100, left: -100,
        zIndex: 99999,
        pointerEvents: "none",
        width: 40, height: 40,
        borderRadius: "50%",
        border: "1px solid rgba(120,180,255,0.6)",
        willChange: "top, left",
      }} />
      <div ref={cursorDot} style={{
        position: "fixed",
        top: -100, left: -100,
        zIndex: 99999,
        pointerEvents: "none",
        width: 6, height: 6,
        borderRadius: "50%",
        background: "rgba(140,200,255,0.9)",
        willChange: "top, left",
      }} />

      <section style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#05080f",
        fontFamily: "'Share Tech Mono', monospace",
        display: "flex",
        alignItems: "center",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

          .scanlines::before {
            content: '';
            position: absolute; inset: 0; z-index: 10;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.07) 2px,
              rgba(0,0,0,0.07) 4px
            );
            pointer-events: none;
          }
          .scanlines::after {
            content: '';
            position: absolute; inset: 0; z-index: 9;
            background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%);
            pointer-events: none;
          }

          @keyframes glitchShift {
            0%,89%,100% { clip-path: inset(0 0 100% 0); transform: none; opacity: 0; }
            90% { clip-path: inset(15% 0 70% 0); transform: translateX(-5px); opacity: 1; }
            93% { clip-path: inset(55% 0 20% 0); transform: translateX(4px);  opacity: 1; }
            96% { clip-path: inset(80% 0 5%  0); transform: translateX(-3px); opacity: 1; }
          }
          .glitch-r {
            position: absolute; inset: 0;
            color: rgba(255,80,80,0.7);
            animation: glitchShift 5s infinite;
            font-family: 'VT323', monospace;
            font-size: clamp(4rem, 10vw, 9rem);
            line-height: 1; letter-spacing: .04em;
            white-space: nowrap;
          }
          .glitch-b {
            position: absolute; inset: 0;
            color: rgba(80,200,255,0.7);
            animation: glitchShift 5s infinite .12s;
            font-family: 'VT323', monospace;
            font-size: clamp(4rem, 10vw, 9rem);
            line-height: 1; letter-spacing: .04em;
            white-space: nowrap;
          }

          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          .cursor-blink { animation: blink 1s step-end infinite; }

          @keyframes fadeUp {
            from { opacity:0; transform: translateY(14px); }
            to   { opacity:1; transform: none; }
          }
          .sub1 { animation: fadeUp .5s ease both .05s; }
          .sub2 { animation: fadeUp .5s ease both .2s;  }
          .sub3 { animation: fadeUp .5s ease both .35s; }

          .crt-btn {
            border: 1px solid rgba(100,180,255,0.45);
            padding: 11px 30px;
            color: rgba(140,200,255,0.9);
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px; letter-spacing: .16em;
            text-transform: uppercase; background: transparent;
            cursor: none; transition: all .2s;
          }
          .crt-btn:hover {
            background: rgba(100,180,255,0.1);
            box-shadow: 0 0 18px rgba(100,180,255,0.2);
            color: #fff;
          }
        `}</style>

        <canvas ref={canvasRef} style={{
          position: "absolute",
          top: 0, left: 0,
          zIndex: 0,
          display: "block",
        }} />

        <div className="scanlines" style={{
          position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
        }} />

        <div style={{
          position: "absolute", top: "35%", left: "12%",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(60,120,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)", zIndex: 1, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 6, padding: "0 8vw" }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
            color: "rgba(100,160,255,0.45)", letterSpacing: ".2em",
            margin: "0 0 24px", textTransform: "uppercase",
          }}>
            &gt; PORTFOLIO_v2.0 — SYSTEM READY
          </p>

          <div style={{ position: "relative", lineHeight: 1, marginBottom: 16 }}>
            <h1 style={{
              fontFamily: "'VT323', monospace",
              fontSize: "clamp(4rem, 10vw, 9rem)",
              color: "rgba(180,215,255,0.95)", margin: 0,
              letterSpacing: ".04em", lineHeight: 1,
              textShadow: "0 0 24px rgba(100,160,255,0.35)",
              whiteSpace: "nowrap",
            }}>
              {name}<span className="cursor-blink" style={{ color: "rgba(140,200,255,0.8)" }}>_</span>
            </h1>
            <div className="glitch-r" aria-hidden="true">{name}_</div>
            <div className="glitch-b" aria-hidden="true">{name}_</div>
          </div>

          <div style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: ready ? "auto" : "none",
          }}>
            <p className="sub1" style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(.85rem, 1.8vw, 1.15rem)",
              color: "rgba(120,175,255,0.6)", margin: "0 0 10px",
              letterSpacing: ".18em",
            }}>
              &gt; {role}
            </p>
            <p className="sub2" style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12, color: "rgba(100,150,255,0.35)",
              letterSpacing: ".1em", margin: "0 0 40px", lineHeight: 1.7,
            }}>
              &gt; NO TEMPLATES. NO BLOAT. JUST CLEAN BUILDS.
            </p>
            <div className="sub3">
              <button className="crt-btn">&gt; ./view_work.sh</button>
            </div>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: "1px solid rgba(100,160,255,0.1)",
          padding: "10px 8vw",
          display: "flex", justifyContent: "space-between",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, color: "rgba(100,150,255,0.3)",
          letterSpacing: ".12em", zIndex: 6,
        }}>
          <span>STATUS: ONLINE</span>
          <span>AABEL ELDO — FULL STACK ENGINEER</span>
          <span>BUILD 2026.04</span>
        </div>
      </section>
    </>
  );
}