"use client";

import { useEffect, useRef, useState } from "react";

const ARCH_COMPONENTS = [
  {
    label: "State Representation",
    detail: "Each particle encodes (x, y, θ, weight) as a full pose hypothesis.",
  },
  {
    label: "Motion Model",
    detail:
      "Tracking wheels + IMU provide odometry deltas with injected noise to model slip and drift.",
  },
  {
    label: "Sensor Model",
    detail:
      "Distance sensors compare expected vs observed readings; weights updated via Gaussian likelihood.",
  },
  {
    label: "Resampling",
    detail:
      "Weighted sampling preserves high-probability particles and removes low-confidence states.",
  },
  {
    label: "Pose Estimation",
    detail: "Final pose computed as weighted mean of all particles.",
  },
];

const OUTCOMES = [
  "Improved autonomous consistency across runs",
  "Reduced odometry drift accumulation",
  "Robust navigation under sensor noise",
  "Stable convergence during wheel slip events",
];

const SNIPPETS = [
  {
    label: "Particle struct",
    code: `struct Particle {
  double x;
  double y;
  double theta;
  double weight;
};`,
  },
  {
    label: "Motion update",
    code: `particle.x += deltaX + randomNoise();
particle.y += deltaY + randomNoise();
particle.theta += deltaTheta + randomNoise();`,
  },
  {
    label: "Weight update",
    code: `double error = abs(realDistance - expectedDistance);
particle.weight = exp(-(error * error) / sigma);`,
  },
  {
    label: "Resampling",
    code: `for i in 1..N:
  select particle proportional to weight
  copy into new set`,
  },
];

export default function Engineering() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.05 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#05080f",
        padding: "120px 24px 160px",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

        .wrap { max-width: 1050px; margin: 0 auto; }

        .fade { opacity: 0; transform: translateY(20px); transition: 0.7s ease; }
        .visible .fade { opacity: 1; transform: translateY(0); }

        .label {
          font-family: 'Share Tech Mono';
          font-size: 10px;
          letter-spacing: .2em;
          color: rgba(120,160,220,0.4);
          text-transform: uppercase;
        }

        .h1 {
          font-family: 'VT323';
          font-size: clamp(2.8rem, 6vw, 5rem);
          color: rgba(200,220,255,0.9);
          margin: 10px 0;
        }

        .h2 {
          font-family: 'VT323';
          font-size: 2.2rem;
          color: rgba(200,220,255,0.85);
        }

        .text {
          font-family: 'Share Tech Mono';
          font-size: 12px;
          color: rgba(140,170,210,0.6);
          line-height: 1.8;
          max-width: 750px;
        }

        .chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; }

        .chip {
          font-family:'Share Tech Mono';
          font-size:10px;
          padding:5px 12px;
          border:1px solid rgba(120,160,255,0.2);
          border-radius:999px;
          color:rgba(140,180,255,0.6);
        }

        .grid3 {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap:12px;
          margin-top:28px;
        }

        .box {
          border:1px solid rgba(120,160,255,0.15);
          background:rgba(10,14,25,0.6);
          border-radius:6px;
          padding:10px;
        }

        .box img { width:100%; display:block; }

        .eq {
          font-family:'Share Tech Mono';
          font-size:12px;
          color:rgba(170,200,255,0.75);
          margin-top:18px;
          padding:14px;
          border-left:2px solid rgba(120,160,255,0.3);
          background:rgba(10,14,25,0.4);
        }

        .row {
          border-bottom:1px solid rgba(120,160,255,0.08);
          padding:14px 0;
          cursor:pointer;
        }

        pre {
          font-family:'Share Tech Mono';
          font-size:12px;
          color:rgba(160,200,255,0.7);
        }

        .outcome {
          font-family:'Share Tech Mono';
          font-size:11px;
          color:rgba(120,220,160,0.6);
          margin:6px 0;
        }
      `}</style>

      <div className={`wrap ${visible ? "visible" : ""}`}>

        {/* HEADER */}
        <div className="fade">
          <div className="label">&gt; ENGINEERING_WORK</div>
          <div className="h1">Engineering_</div>

          <div className="text">
            Robotics, embedded systems, CAD, and probabilistic localization built for
            competitive autonomous systems.
          </div>

          <div className="chips">
            {["C++", "Robotics", "VEX", "Monte Carlo Localization"].map(t => (
              <div key={t} className="chip">{t}</div>
            ))}
          </div>
        </div>

        {/* PROJECT */}
        <div className="fade" style={{ marginTop: 60 }}>
          <div className="label">&gt; FEATURED_PROJECT</div>
          <div className="h2">Monte Carlo Localization</div>

          <div className="text">
            Particle filter localization combining odometry (tracking wheels + IMU)
            with distance sensor corrections to reduce cumulative drift in autonomous navigation.
          </div>
        </div>

          {/* EQUATION (separate, text-style) */}
            <div style={{ marginTop: 18 }}>
            <img
                src="/formula.png"
                alt="Particle filter Bayesian update equation"
                style={{
                width: "100%",
                maxWidth: 520,
                display: "block",
                opacity: 0.9,
                borderLeft: "2px solid rgba(120,160,255,0.3)",
                paddingLeft: 12,
                background: "rgba(10,14,25,0.4)",
                }}
            />
            </div>

        {/* VISUALS */}
        <div className="grid3" style={{ alignItems: "stretch" }}>

        <div className="box" style={{ padding: 0, overflow: "hidden", height: 280, display: "flex", flexDirection: "column" }}>
            <video
            src="/robot.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ flex: 1, width: "100%", objectFit: "contain", display: "block", minHeight: 0 }}
            />
            <div style={{ padding: "8px 12px", fontFamily: "Share Tech Mono", fontSize: 10, color: "rgba(120,160,255,0.4)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Robot execution
            </div>
        </div>

        <div className="box" style={{ padding: 0, overflow: "hidden", height: 280, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
            <img
                src="/diagram.png"
                alt="system diagram"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
            </div>
            <div style={{ padding: "8px 12px", fontFamily: "Share Tech Mono", fontSize: 10, color: "rgba(120,160,255,0.4)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Particle filter diagram
            </div>
        </div>

        </div>

        {/* ARCH */}
        <div style={{ marginTop: 60 }}>
          <div className="label">&gt; SYSTEM_ARCHITECTURE</div>
          <div className="h2">Architecture</div>

          {ARCH_COMPONENTS.map((a, i) => (
            <div key={a.label} className="row" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div style={{ fontFamily: "Share Tech Mono", color: "rgba(160,200,255,0.7)" }}>
                {a.label}
              </div>

              {expanded === i && (
                <div className="text" style={{ marginTop: 6 }}>
                  {a.detail}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CODE */}
        <div style={{ marginTop: 60 }}>
          <div className="label">&gt; CORE_IMPLEMENTATION</div>
          <div className="h2">Code</div>

          <div className="box">
            <pre>{SNIPPETS[activeSnippet].code}</pre>
          </div>

          <div className="chips" style={{ marginTop: 10 }}>
            {SNIPPETS.map((s, i) => (
              <div
                key={s.label}
                className="chip"
                onClick={() => setActiveSnippet(i)}
                style={{ cursor: "pointer", opacity: activeSnippet === i ? 1 : 0.5 }}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* OUTCOMES */}
        <div style={{ marginTop: 60 }}>
          <div className="label">&gt; RESULTS</div>
          <div className="h2">Outcomes</div>

          {OUTCOMES.map(o => (
            <div key={o} className="outcome">✓ {o}</div>
          ))}
        </div>

      </div>
    </section>
  );
}