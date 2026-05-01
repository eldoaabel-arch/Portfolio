"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

const PROJECTS = [
  {
    number: "01",
    title: "Purple Hope",
    tags: ["Next.js", "TypeScript", "Tailwind", "EmailJS", "Vercel"],
    year: "2026",
    image: "/screenshots/purple-hope.png",
    description:
      "Fundraising site for a Canadian Cancer Society pancreatic cancer campaign. Built and shipped by a 5-person high school team — live at purplehope.ca with a CI/CD pipeline, Cloudflare DNS, and real contact form submissions.",
    bullets: [
      "Video background hero with automatic playlist cycling",
      "Scroll-triggered entrance animations — no animation libraries",
      "CI/CD: every git push auto-deploys via Vercel",
      "Custom domain + Open Graph metadata for social previews",
    ],
    link: "https://purplehope.ca",
    live: true,
  },
  {
    number: "02",
    title: "Ambrose Pizza",
    tags: ["Next.js", "TypeScript", "Tailwind", "Formspree", "Vercel"],
    year: "2026",
    image: "/screenshots/ambrose-pizza.png",
    description:
      "Freelance site for a local Ontario pizza place — self-sourced through cold outreach, scoped and priced independently at $500, and presented live in the restaurant. Managed a real technical conversation about POS integration on the spot.",
    bullets: [
      "Sliding pill navbar with active section tracking via scroll",
      "Tabbed menu system across 10 categories with full item/price data",
      "Order form piped directly to the restaurant's Toast-connected email",
      "Online ordering CTA linked to Toast's platform",
      "Advised client on Toast Online Ordering setup and costs during meeting",
    ],
    link: "https://ambrose-pizza.vercel.app/",
    live: true,
  },
  {
    number: "03",
    title: "782 Taphouse",
    tags: ["Next.js", "React", "Tailwind", "Vercel"],
    year: "2026",
    image: "/screenshots/782-taphouse.png",
    description:
      "Freelance site for a Port Stanley bar — self-sourced through cold outreach after scraping Google Maps for businesses without a web presence. Built the full site, then used it to open the sales conversation. Pitched at $275.",
    bullets: [
      "Built before any client contact — the site was the pitch",
      "Warm dark aesthetic tailored to the bar's brand",
      "Fully responsive with menu, atmosphere, and contact sections",
    ],
    link: "https://728-taphouse.vercel.app/",
    live: true,
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          posthog.capture("work_section_viewed");
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        background: "#05080f",
        padding: "120px 8vw",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

        @keyframes workFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }

        .work-visible .work-header { animation: workFadeUp .7s ease both; }
        .work-visible .work-row    { animation: workFadeUp .7s ease both; }

        .work-row {
          display: grid;
          grid-template-columns: 60px 1fr;
          align-items: start;
          gap: 24px;
          padding: 48px 0;
          border-bottom: 1px solid rgba(120,170,255,0.08);
          position: relative;
        }
        .work-row::before {
          content: '';
          position: absolute;
          left: -8vw; right: -8vw; top: 0; bottom: 0;
          background: rgba(100,160,255,0.03);
          opacity: 0;
          transition: opacity .25s;
          pointer-events: none;
        }
        .work-row:hover::before { opacity: 1; }

        /* Desktop: two-col layout inside each row */
        .work-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .work-row-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .work-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(100,160,255,0.5);
          border: 1px solid rgba(100,160,255,0.2);
          padding: 3px 10px;
          border-radius: 999px;
          transition: color .2s, border-color .2s;
        }
        .work-row:hover .work-tag {
          color: rgba(140,190,255,0.8);
          border-color: rgba(140,190,255,0.35);
        }

        .work-bullet {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(120,170,255,0.45);
          line-height: 1.8;
          padding-left: 16px;
          position: relative;
          margin: 0;
        }
        .work-bullet::before {
          content: '—';
          position: absolute;
          left: 0;
          color: rgba(100,160,255,0.25);
        }

        .live-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: rgba(80,220,160,0.7);
          border: 1px solid rgba(80,220,160,0.25);
          padding: 2px 8px;
          border-radius: 999px;
          margin-left: 12px;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }
        .live-badge::before {
          content: '●';
          margin-right: 5px;
          font-size: 7px;
          vertical-align: middle;
        }

        .work-screenshot {
          width: 100%;
          border-radius: 4px;
          border: 1px solid rgba(100,160,255,0.1);
          opacity: 0.85;
          transition: opacity .25s;
        }
        .work-screenshot:hover { opacity: 1; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .work-row {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 36px 0;
          }
          .work-row-meta {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          .work-content-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .work-screenshot {
            order: -1;
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(100,160,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,160,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className={visible ? "work-visible" : ""} style={{ position: "relative", zIndex: 1 }}>
        <div className="work-header" style={{ marginBottom: 16 }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, letterSpacing: ".2em",
            color: "rgba(100,160,255,0.4)",
            textTransform: "uppercase", margin: "0 0 12px",
          }}>
            &gt; SELECTED_WORK
          </p>
          <h2 style={{
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "rgba(180,215,255,0.9)",
            margin: 0, lineHeight: 1,
            textShadow: "0 0 30px rgba(100,160,255,0.2)",
          }}>
            Projects_
          </h2>
        </div>

        <div style={{ height: 1, background: "rgba(120,170,255,0.12)", margin: "40px 0 0" }} />

        {PROJECTS.map((p, i) => (
          <div
            key={p.number}
            className="work-row"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Number + year */}
            <div className="work-row-meta">
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11, letterSpacing: ".1em",
                color: "rgba(100,160,255,0.3)",
              }}>
                {p.number}
              </span>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11, color: "rgba(100,160,255,0.2)",
              }}>
                {p.year}
              </span>
            </div>

            {/* Content */}
            <div className="work-content-grid">
              {/* Left: info */}
              <div>
                <h3 style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  color: hovered === i ? "rgba(210,230,255,0.95)" : "rgba(180,215,255,0.75)",
                  margin: 0, lineHeight: 1,
                  transition: "color .25s",
                  textShadow: hovered === i ? "0 0 20px rgba(100,160,255,0.3)" : "none",
                }}>
                  {p.title}
                  {p.live && <span className="live-badge">Live</span>}
                </h3>

                <div className="work-row-tags">
                  {p.tags.map(t => <span key={t} className="work-tag">{t}</span>)}
                </div>

                <p style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 12, color: "rgba(120,170,255,0.5)",
                  margin: "16px 0 0", lineHeight: 1.7,
                }}>
                  {p.description}
                </p>

                <div style={{ marginTop: 16 }}>
                  {p.bullets.map((b, bi) => (
                    <p key={bi} className="work-bullet">{b}</p>
                  ))}
                </div>

                
                  <a href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => posthog.capture("project_site_visited", { project: p.title, url: p.link })}
                  style={{
                    display: "inline-block", marginTop: 20,
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10, letterSpacing: ".15em",
                    textTransform: "uppercase",
                    color: "rgba(100,160,255,0.6)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(100,160,255,0.25)",
                    paddingBottom: 2,
                  }}
                >
                  Visit Site ↗
                </a>
              </div>

              {/* Right: screenshot */}
              <img
                src={p.image}
                alt={`${p.title} screenshot`}
                className="work-screenshot"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}