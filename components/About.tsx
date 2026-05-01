"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "3+",  label: "Years Experience" },
  { value: "15+", label: "Projects Delivered" },
  { value: "10+", label: "Happy Clients" },
  { value: "∞",   label: "Energy Drinks" },
];

const STACK = [
  "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "HTML", "CSS",
  "Tailwind", "Python", "C++", "Git", "PROS Framework", "CAD",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{
      background: "#05080f",
      padding: "120px 8vw",
      minHeight: "100vh",
      position: "relative",
    }}>
      <style>{`
        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        .about-visible .a1 { animation: aboutFadeUp .7s ease both .05s; }
        .about-visible .a2 { animation: aboutFadeUp .7s ease both .2s;  }
        .about-visible .a3 { animation: aboutFadeUp .7s ease both .35s; }
        .about-visible .a4 { animation: aboutFadeUp .7s ease both .5s;  }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          width: 100%;
          align-items: start;
        }

        .stack-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(100,160,255,0.55);
          border: 1px solid rgba(100,160,255,0.18);
          padding: 5px 14px;
          border-radius: 999px;
          transition: color .2s, border-color .2s, background .2s;
          cursor: default;
        }
        .stack-pill:hover {
          color: rgba(180,215,255,0.9);
          border-color: rgba(120,180,255,0.45);
          background: rgba(100,160,255,0.07);
        }

        .stat-val {
          font-family: 'VT323', monospace;
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: rgba(180,215,255,0.9);
          line-height: 1;
          text-shadow: 0 0 20px rgba(100,160,255,0.3);
        }
        .stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(100,160,255,0.4);
          margin-top: 4px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding-top: 40px;
          border-top: 1px solid rgba(120,170,255,0.08);
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
          }
        }
      `}</style>

      <div style={{
        position: "absolute", top: "20%", left: "5%",
        width: 500, height: 500,
        background: "radial-gradient(ellipse, rgba(60,100,255,0.06) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div
        className={visible ? "about-visible" : ""}
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="about-grid">
          {/* Left col */}
          <div>
            <div className="a1" style={{ marginBottom: 40 }}>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11, letterSpacing: ".2em",
                color: "rgba(100,160,255,0.4)",
                textTransform: "uppercase", margin: "0 0 12px",
              }}>
                &gt; WHO_I_AM
              </p>
              <h2 style={{
                fontFamily: "'VT323', monospace",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "rgba(180,215,255,0.9)",
                margin: 0, lineHeight: 1,
                textShadow: "0 0 30px rgba(100,160,255,0.2)",
              }}>
                About_
              </h2>
            </div>

            <p className="a2" style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 13, color: "rgba(140,185,255,0.5)",
              lineHeight: 1.85, margin: "0 0 16px",
            }}>
              I'm a web developer based in St. Thomas, ON. I've been writing code since I was 8 — starting on Scratch and Roblox, moving through Java, app development with React Native and Expo, and eventually landing on modern web development with Next.js and Tailwind. What started as a hobby became a real freelance business building sites for local clients across Southern Ontario.
            </p>
            <p className="a2" style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 13, color: "rgba(140,185,255,0.4)",
              lineHeight: 1.85, margin: "0 0 48px",
              animationDelay: ".28s",
            }}>
              Outside of web dev, I compete in VEX robotics where I write C++ using the PROS framework and work in CAD — so I'm just as comfortable in a technical environment as I am designing something that looks good. I build websites for small businesses that are clean, fast, and actually bring in customers.
            </p>

            <div className="a3 stats-grid">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right col */}
          <div>
            <div className="a2" style={{
              border: "1px solid rgba(120,170,255,0.12)",
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 32,
              animationDelay: ".3s",
            }}>
              <div style={{
                background: "rgba(100,160,255,0.06)",
                borderBottom: "1px solid rgba(120,170,255,0.1)",
                padding: "10px 16px",
                display: "flex", gap: 8, alignItems: "center",
              }}>
                {["rgba(255,90,90,0.6)", "rgba(255,190,50,0.6)", "rgba(50,210,100,0.6)"].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10, color: "rgba(100,160,255,0.3)",
                  marginLeft: 8, letterSpacing: ".1em",
                }}>
                  abel@portfolio:~$
                </span>
              </div>
              <div style={{ padding: "20px" }}>
                {[
                  { k: "name",      v: '"Abel Eldo"' },
                  { k: "role",      v: '"Web Developer"' },
                  { k: "location",  v: '"St. Thomas, ON"' },
                  { k: "email",     v: '"eldoaabel@gmail.com"' },
                  { k: "phone",     v: '"(437) 324-4038"' },
                  { k: "available", v: "true" },
                ].map(({ k, v }) => (
                  <div key={k} style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 12, lineHeight: 2,
                    color: "rgba(140,185,255,0.5)",
                    wordBreak: "break-all",
                  }}>
                    <span style={{ color: "rgba(100,160,255,0.4)" }}>{k}</span>
                    <span style={{ color: "rgba(100,160,255,0.25)" }}>: </span>
                    <span style={{ color: "rgba(180,215,255,0.7)" }}>{v}</span>
                    <span style={{ color: "rgba(100,160,255,0.25)" }}>,</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="a4">
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10, letterSpacing: ".18em",
                color: "rgba(100,160,255,0.35)",
                textTransform: "uppercase", margin: "0 0 16px",
              }}>
                &gt; TECH_STACK
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {STACK.map(t => <span key={t} className="stack-pill">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}