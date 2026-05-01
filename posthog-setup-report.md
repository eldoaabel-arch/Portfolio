<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js App Router portfolio site. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` for better ad-blocker resilience. Exception capture is enabled globally. Twelve custom events were instrumented across six components covering the full visitor journey — from the hero landing through project browsing, services exploration, and contact form submission.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | Hero "View Work" button clicked | `components/Main.tsx` |
| `hire_me_clicked` | "Hire Me" CTA button clicked (desktop or mobile) | `components/Navbar.tsx` |
| `nav_link_clicked` | Navigation link clicked, with `label` and `source` (desktop/mobile) properties | `components/Navbar.tsx` |
| `work_section_viewed` | Work section entered viewport for the first time | `components/Work.tsx` |
| `project_site_visited` | "Visit Site" link clicked on a project, with `project` and `url` properties | `components/Work.tsx` |
| `service_card_expanded` | Service card expanded, with `service` property | `components/Services.tsx` |
| `contact_section_viewed` | Contact section entered viewport for the first time | `components/Contact.tsx` |
| `contact_form_submitted` | Contact form successfully sent via EmailJS, with `budget` property | `components/Contact.tsx` |
| `contact_form_failed` | Contact form submission failed (exception also captured) | `components/Contact.tsx` |
| `social_link_clicked` | Social link clicked, with `platform` property (email, GitHub, LinkedIn) | `components/Contact.tsx` |
| `engineering_snippet_selected` | Code snippet tab selected, with `snippet` property | `components/Engineering.tsx` |
| `architecture_row_expanded` | Architecture component row expanded, with `component` property | `components/Engineering.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/405118/dashboard/1531753
- **Contact form conversion funnel**: https://us.posthog.com/project/405118/insights/SycOwl3H
- **Hire Me button clicks over time**: https://us.posthog.com/project/405118/insights/IWV1xRrX
- **Project site visits by project**: https://us.posthog.com/project/405118/insights/rcSPtfxY
- **Navigation section clicks breakdown**: https://us.posthog.com/project/405118/insights/OAz9DgLc
- **Engagement funnel: Hero → Work → Contact**: https://us.posthog.com/project/405118/insights/bm1CFDcz

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
