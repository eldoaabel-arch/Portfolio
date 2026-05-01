"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

const LINKS = [
  { label: "Home",        href: "#home" },
  { label: "Work",        href: "#work" },
  { label: "Engineering", href: "#engineering" },
  { label: "Services",    href: "#services" },
  { label: "About",       href: "#about" },
  { label: "Contact",     href: "#contact" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillReady, setPillReady] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Show/hide navbar on scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Move pill to active item — suppress transition on first paint
  useEffect(() => {
    const el = itemRefs.current[active];
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!el || !nav || !pill) return;

    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    if (!pillReady) {
      // Set position instantly (no transition) on first render
      pill.style.transition = "none";
      pill.style.width = `${elRect.width}px`;
      pill.style.left  = `${elRect.left - navRect.left}px`;
      // Re-enable transition after a frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          pill.style.transition = "";
          setPillReady(true);
        });
      });
    } else {
      pill.style.width = `${elRect.width}px`;
      pill.style.left  = `${elRect.left - navRect.left}px`;
    }
  }, [active, visible, pillReady]);

  // Track active section on scroll
  useEffect(() => {
    const onScroll = () => {
      for (const link of [...LINKS].reverse()) {
        const id = link.href.replace("#", "");
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(link.label);
          return;
        }
      }
      setActive("Home");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string, label: string, source: "desktop" | "mobile" = "desktop") => {
    posthog.capture("nav_link_clicked", { label, source });
    setActive(label);
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        /* ── Desktop pill nav ── */
        .navbar-wrap {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(-12px);
          z-index: 99990;
          pointer-events: none;
          opacity: 0;
          transition: opacity .4s ease, transform .4s ease;
        }
        .navbar-wrap.show {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .navbar-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 6px;
          border-radius: 999px;
          background: rgba(5, 8, 24, 0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(120, 170, 255, 0.15);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(120,170,255,0.05) inset;
        }

        .pill {
          position: absolute;
          top: 6px;
          height: calc(100% - 12px);
          border-radius: 999px;
          background: rgba(100, 160, 255, 0.15);
          border: 1px solid rgba(120, 180, 255, 0.25);
          box-shadow: 0 0 12px rgba(100,160,255,0.1);
          transition: left .35s cubic-bezier(.4,0,.2,1), width .35s cubic-bezier(.4,0,.2,1);
          pointer-events: none;
        }

        .nav-btn {
          position: relative;
          z-index: 1;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px 18px;
          border-radius: 999px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(140, 185, 255, 0.5);
          transition: color .25s;
          white-space: nowrap;
        }
        .nav-btn:hover { color: rgba(180, 215, 255, 0.85); }
        .nav-btn.active {
          color: rgba(200, 225, 255, 0.95);
          text-shadow: 0 0 12px rgba(140,190,255,0.4);
        }

        /* ── Logo ── */
        .nav-logo {
          position: fixed;
          top: 28px;
          left: 32px;
          z-index: 99990;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(120, 170, 255, 0.45);
          pointer-events: none;
          opacity: 0;
          transition: opacity .4s ease .1s;
        }
        .nav-logo.show { opacity: 1; }

        /* ── Desktop CTA ── */
        .nav-cta {
          position: fixed;
          top: 20px;
          right: 28px;
          z-index: 99990;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(140, 200, 255, 0.7);
          border: 1px solid rgba(100, 160, 255, 0.3);
          background: rgba(5, 8, 24, 0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          padding: 9px 20px;
          border-radius: 999px;
          cursor: pointer;
          pointer-events: none;
          opacity: 0;
          transition: opacity .4s ease .1s, background .2s, color .2s;
        }
        .nav-cta.show { opacity: 1; pointer-events: auto; }
        .nav-cta:hover { background: rgba(100, 160, 255, 0.15); color: #fff; }

        /* ── Mobile hamburger button ── */
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 99991;
          background: rgba(5, 8, 24, 0.75);
          border: 1px solid rgba(120, 170, 255, 0.2);
          border-radius: 8px;
          padding: 10px 12px;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .mobile-menu-btn span {
          display: block;
          width: 20px;
          height: 1px;
          background: rgba(140, 190, 255, 0.7);
          transition: transform .3s, opacity .3s;
        }
        .mobile-menu-btn.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .mobile-menu-btn.open span:nth-child(2) { opacity: 0; width: 0; }
        .mobile-menu-btn.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── Mobile dropdown menu ── */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 99989;
          background: rgba(5, 8, 24, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(120, 170, 255, 0.12);
          padding: 80px 24px 32px;
          flex-direction: column;
          gap: 8px;
          transform: translateY(-100%);
          transition: transform .35s cubic-bezier(.4,0,.2,1);
        }
        .mobile-menu.open { transform: translateY(0); }

        .mobile-nav-btn {
          background: transparent;
          border: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(140, 185, 255, 0.55);
          padding: 14px 0;
          text-align: left;
          cursor: pointer;
          border-bottom: 1px solid rgba(120, 170, 255, 0.06);
          transition: color .2s;
        }
        .mobile-nav-btn:last-child { border-bottom: none; }
        .mobile-nav-btn.active { color: rgba(200, 225, 255, 0.95); }
        .mobile-nav-btn:hover { color: rgba(180, 215, 255, 0.85); }

        .mobile-hire-btn {
          margin-top: 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(140, 200, 255, 0.9);
          border: 1px solid rgba(100, 160, 255, 0.4);
          background: rgba(100, 160, 255, 0.06);
          padding: 14px;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          transition: background .2s;
        }
        .mobile-hire-btn:hover { background: rgba(100, 160, 255, 0.15); }

        @media (max-width: 768px) {
          .navbar-wrap { display: none !important; }
          .nav-logo { display: none !important; }
          .nav-cta { display: none !important; }
          .mobile-menu-btn { display: flex; }
          .mobile-menu { display: flex; }
        }
      `}</style>

      {/* Desktop: Left logo */}
      <div className={`nav-logo ${visible ? "show" : ""}`}>AE</div>

      {/* Desktop: Center pill nav */}
      <div className={`navbar-wrap ${visible ? "show" : ""}`}>
        <div className="navbar-inner" ref={navRef}>
          <div className="pill" ref={pillRef} />
          {LINKS.map(({ label, href }) => (
            <button
              key={label}
              ref={el => { itemRefs.current[label] = el; }}
              className={`nav-btn ${active === label ? "active" : ""}`}
              onClick={() => scrollTo(href, label, "desktop")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Right CTA */}
      <button
        className={`nav-cta ${visible ? "show" : ""}`}
        onClick={() => { posthog.capture("hire_me_clicked", { source: "desktop" }); scrollTo("#contact", "Contact"); }}
      >
        Hire Me
      </button>

      {/* Mobile: Hamburger */}
      <button
        className={`mobile-menu-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile: Dropdown menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {LINKS.map(({ label, href }) => (
          <button
            key={label}
            className={`mobile-nav-btn ${active === label ? "active" : ""}`}
            onClick={() => scrollTo(href, label, "mobile")}
          >
            &gt; {label}
          </button>
        ))}
        <button
          className="mobile-hire-btn"
          onClick={() => { posthog.capture("hire_me_clicked", { source: "mobile" }); scrollTo("#contact", "Contact", "mobile"); }}
        >
          &gt; Hire Me
        </button>
      </div>
    </>
  );
}