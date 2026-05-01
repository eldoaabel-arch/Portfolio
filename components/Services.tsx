"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

const SERVICES = [
  {
    number: "01",
    title: "Landing Pages & Business Sites",
    description: "Most local businesses are invisible online or stuck with a generic template that doesn't convert. I build clean, fast, custom sites that actually represent what you do — and get people to call.",
    details: ["Custom UI/UX Design", "Wireframing & Prototyping", "Design Systems", "Brand Identity"],
  },
  {
    number: "02",
    title: "Full Stack Development",
    description: "Got an idea that needs more than a landing page? I build full web apps with Next.js and React — from database to deployment. No hand-holding required on your end.",
    details: ["React / Next.js", "Node.js / Express", "Database Design", "API Integration"],
  },
  {
    number: "03",
    title: "Online Ordering & Payments",
    description: "I've set up Stripe payment systems and Toast POS integrations for local businesses that need to take orders and payments online — not just a contact form. Restaurants, retail, whatever you're selling.",
    details: ["Stripe Integration", "Toast POS Setup", "Online Ordering", "Payment Flows"],
  },
  {
    number: "04",
    title: "Maintenance & Updates",
    description: "Sites break, go stale, and slow down. I offer monthly retainers to keep yours fast, updated, and working — so you're not scrambling when something breaks.",
    details: ["Performance Monitoring", "Content Updates", "Security Patches", "Monthly Reporting"],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} style={{
      background: "#060a12",
      padding: "120px 8vw",
      minHeight: "100vh",
      position: "relative",
    }}>
      <style>{`
        @keyframes svcFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        .svc-visible .svc-header { animation: svcFadeUp .7s ease both; }
        .svc-visible .svc-card   { animation: svcFadeUp .7s ease both; }

        .svc-card {
          border: 1px solid rgba(120,170,255,0.1);
          border-radius: 2px;
          padding: 32px 36px;
          background: rgba(100,160,255,0.02);
          transition: border-color .25s, background .25s;
          cursor: none;
        }
        .svc-card:hover, .svc-card.open {
          border-color: rgba(120,170,255,0.25);
          background: rgba(100,160,255,0.05);
        }

        .svc-detail-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
          margin-top: 16px;
          overflow: hidden;
          transition: max-height .4s cubic-bezier(.4,0,.2,1), opacity .3s;
        }
        .svc-detail-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: .1em;
          color: rgba(100,160,255,0.5);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .svc-detail-item::before {
          content: '>';
          color: rgba(100,160,255,0.3);
        }

        .svc-toggle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 18px;
          color: rgba(100,160,255,0.4);
          transition: transform .3s, color .2s;
          line-height: 1;
        }
        .svc-card.open .svc-toggle {
          transform: rotate(45deg);
          color: rgba(140,200,255,0.8);
        }
      `}</style>

      <div style={{
        position: "absolute", bottom: "20%", right: "10%",
        width: 500, height: 500,
        background: "radial-gradient(ellipse, rgba(60,100,255,0.05) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div className={visible ? "svc-visible" : ""} style={{ position: "relative", zIndex: 1 }}>

        <div className="svc-header" style={{ marginBottom: 60 }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, letterSpacing: ".2em",
            color: "rgba(100,160,255,0.4)",
            textTransform: "uppercase", margin: "0 0 12px",
          }}>
            &gt; WHAT_I_DO
          </p>
          <h2 style={{
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "rgba(180,215,255,0.9)",
            margin: 0, lineHeight: 1,
            textShadow: "0 0 30px rgba(100,160,255,0.2)",
          }}>
            Services_
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 16,
        }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.number}
              className={`svc-card ${open === i ? "open" : ""}`}
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              onClick={() => {
                const isOpening = open !== i;
                setOpen(isOpening ? i : null);
                if (isOpening) posthog.capture("service_card_expanded", { service: s.title });
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10, letterSpacing: ".15em",
                  color: "rgba(100,160,255,0.3)",
                }}>
                  {s.number}
                </span>
                <span className="svc-toggle">+</span>
              </div>

              <h3 style={{
                fontFamily: "'VT323', monospace",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                color: "rgba(180,215,255,0.85)",
                margin: "0 0 12px", lineHeight: 1,
              }}>
                {s.title}
              </h3>

              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 12, color: "rgba(120,170,255,0.45)",
                margin: 0, lineHeight: 1.75,
              }}>
                {s.description}
              </p>

              <div className="svc-detail-list" style={{
                maxHeight: open === i ? "200px" : "0px",
                opacity: open === i ? 1 : 0,
              }}>
                {s.details.map(d => (
                  <div key={d} className="svc-detail-item">{d}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}