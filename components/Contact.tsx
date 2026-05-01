"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import posthog from "posthog-js";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          posthog.capture("contact_section_viewed");
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setError(false);
    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSent(true);
      setForm({ name: "", email: "", budget: "", message: "" });
      posthog.capture("contact_form_submitted", {
        budget: form.budget,
      });
    } catch (err) {
      setError(true);
      posthog.captureException(err);
      posthog.capture("contact_form_failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} style={{
      background: "#060a12",
      padding: "120px 8vw 80px",
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes ctcFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        .ctc-visible .c1 { animation: ctcFadeUp .7s ease both .05s; }
        .ctc-visible .c2 { animation: ctcFadeUp .7s ease both .2s;  }
        .ctc-visible .c3 { animation: ctcFadeUp .7s ease both .35s; }

        .ctc-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 60px;
          align-items: start;
        }

        .ctc-input {
          width: 100%;
          background: rgba(100,160,255,0.03);
          border: 1px solid rgba(120,170,255,0.12);
          border-radius: 2px;
          padding: 14px 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: .08em;
          color: rgba(180,215,255,0.8);
          outline: none;
          transition: border-color .2s, background .2s;
          box-sizing: border-box;
          cursor: text;
        }
        .ctc-input::placeholder { color: rgba(100,150,255,0.25); }
        .ctc-input:focus {
          border-color: rgba(120,180,255,0.35);
          background: rgba(100,160,255,0.06);
        }
        textarea.ctc-input {
          resize: vertical;
          min-height: 140px;
          font-family: 'Share Tech Mono', monospace;
        }

        .ctc-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .ctc-submit {
          border: 1px solid rgba(100,180,255,0.45);
          padding: 14px 40px;
          color: rgba(140,200,255,0.9);
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; letter-spacing: .16em;
          text-transform: uppercase; background: transparent;
          cursor: pointer; transition: all .2s;
          border-radius: 2px;
        }
        .ctc-submit:hover:not(:disabled) {
          background: rgba(100,180,255,0.1);
          box-shadow: 0 0 18px rgba(100,180,255,0.2);
          color: #fff;
        }
        .ctc-submit:disabled { opacity: .5; }

        .social-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(100,160,255,0.4);
          text-decoration: none;
          cursor: pointer;
          transition: color .2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .social-link:hover { color: rgba(180,215,255,0.8); }
        .social-link::before { content: '↗'; font-size: 14px; }

        @media (max-width: 768px) {
          .ctc-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .ctc-form-grid {
            grid-template-columns: 1fr;
          }
          .ctc-submit {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div style={{
        position: "absolute", top: "10%", right: "5%",
        width: 600, height: 600,
        background: "radial-gradient(ellipse, rgba(60,100,255,0.05) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div className={visible ? "ctc-visible" : ""} style={{ position: "relative", zIndex: 1 }}>

        <div className="c1" style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, letterSpacing: ".2em",
            color: "rgba(100,160,255,0.4)",
            textTransform: "uppercase", margin: "0 0 12px",
          }}>
            &gt; GET_IN_TOUCH
          </p>
          <h2 style={{
            fontFamily: "'VT323', monospace",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "rgba(180,215,255,0.9)",
            margin: "0 0 16px", lineHeight: 1,
            textShadow: "0 0 30px rgba(100,160,255,0.2)",
          }}>
            Let's Work Together_
          </h2>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 13, color: "rgba(120,170,255,0.4)",
            maxWidth: 480, lineHeight: 1.8, margin: 0,
          }}>
            Have a project in mind? Fill out the form and I'll get back to you within 24 hours.
          </p>
        </div>

        <div className="c2 ctc-layout">
          {sent ? (
            <div style={{
              border: "1px solid rgba(100,200,120,0.25)",
              borderRadius: 2,
              padding: "48px 40px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'VT323', monospace",
                fontSize: "3rem",
                color: "rgba(100,220,140,0.8)",
                margin: "0 0 12px",
              }}>Message Sent_</p>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 12, color: "rgba(100,200,120,0.5)",
                letterSpacing: ".1em",
              }}>
                I'll be in touch soon.
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={e => { e.preventDefault(); handleSubmit(); }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div className="ctc-form-grid">
                <div>
                  <label style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10, letterSpacing: ".14em",
                    color: "rgba(100,160,255,0.35)",
                    textTransform: "uppercase",
                    display: "block", marginBottom: 8,
                  }}>Name</label>
                  <input
                    className="ctc-input"
                    name="from_name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10, letterSpacing: ".14em",
                    color: "rgba(100,160,255,0.35)",
                    textTransform: "uppercase",
                    display: "block", marginBottom: 8,
                  }}>Email</label>
                  <input
                    className="ctc-input"
                    type="email"
                    name="from_email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10, letterSpacing: ".14em",
                  color: "rgba(100,160,255,0.35)",
                  textTransform: "uppercase",
                  display: "block", marginBottom: 8,
                }}>Budget Range</label>
                <select
                  className="ctc-input"
                  name="budget"
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  style={{ appearance: "none" }}
                >
                  <option value="" style={{ background: "#05080f" }}>Select a range</option>
                  <option value="<500"      style={{ background: "#05080f" }}>Under $500</option>
                  <option value="500-1000"  style={{ background: "#05080f" }}>$500 – $1,000</option>
                  <option value="1000-5000" style={{ background: "#05080f" }}>$1,000 – $5,000</option>
                  <option value="5000+"     style={{ background: "#05080f" }}>$5,000+</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10, letterSpacing: ".14em",
                  color: "rgba(100,160,255,0.35)",
                  textTransform: "uppercase",
                  display: "block", marginBottom: 8,
                }}>Message</label>
                <textarea
                  className="ctc-input"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  className="ctc-submit"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "./send_message.sh"}
                </button>
                {error && (
                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 11, color: "rgba(255,90,90,0.7)",
                    letterSpacing: ".1em",
                  }}>
                    ✗ Something went wrong
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10, letterSpacing: ".18em",
                color: "rgba(100,160,255,0.3)",
                textTransform: "uppercase", margin: "0 0 16px",
              }}>
                &gt; DIRECT
              </p>
              <a href="mailto:eldoaabel@gmail.com" className="social-link" style={{ fontSize: 13 }} onClick={() => posthog.capture("social_link_clicked", { platform: "email" })}>
                eldoaabel@gmail.com
              </a>
            </div>

            <div>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10, letterSpacing: ".18em",
                color: "rgba(100,160,255,0.3)",
                textTransform: "uppercase", margin: "0 0 16px",
              }}>
                &gt; ELSEWHERE
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "GitHub",   href: "https://github.com/aabeleldo" },
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/aabel-eldo-0335b6384/" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-link" onClick={() => posthog.capture("social_link_clicked", { platform: s.label })}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div style={{
              border: "1px solid rgba(100,200,120,0.2)",
              borderRadius: 2,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "rgba(100,220,140,0.8)",
                boxShadow: "0 0 8px rgba(100,220,140,0.6)",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11, letterSpacing: ".1em",
                color: "rgba(100,200,120,0.6)",
              }}>
                Available for new projects
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="c3" style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(120,170,255,0.08)",
        paddingTop: 32,
        marginTop: 80,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: ".14em",
          color: "rgba(100,160,255,0.25)",
          textTransform: "uppercase",
        }}>
          © 2026 Abel Eldo
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, letterSpacing: ".14em",
          color: "rgba(100,160,255,0.25)",
          textTransform: "uppercase",
        }}>
          Built with Next.js
        </span>
      </div>
    </section>
  );
}