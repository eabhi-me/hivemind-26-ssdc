# Build Specification: HiveMind 2026 — SSDC SLIET

Build a production-quality, responsive event website for **HiveMind 2026**, organized by the **SLIET Software Development Club (SSDC)**.

The website should feel like a futuristic digital challenge arena rather than a conventional college fest website.

## 1. Tech Stack

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- React Router

Do not introduce unnecessary dependencies.

The application must be fully responsive across desktop, tablet and mobile.

---

## 2. Visual Identity

The design must take strong inspiration from the supplied HiveMind 2026 poster.

Primary visual characteristics:

- Deep charcoal / true black background
- Bright cyan highlights
- Crisp white typography
- Futuristic cyber/technology aesthetic
- Large condensed uppercase typography
- Italic/oblique display headings
- Angular geometric shapes
- Hexagons
- Circuit-board traces
- Technical labels
- Thin glowing borders
- Subtle grid/noise textures
- Terminal-inspired elements
- High contrast
- Minimal but meaningful animation

Avoid:

- Generic Bootstrap styling
- Purple AI gradients
- Excessive rounded cards
- Corporate SaaS aesthetics
- Stock photography
- Excessive glassmorphism
- Excessive animation
- Visual clutter

The site should feel premium, aggressive, technical and competition-focused.

---

## 3. Color Tokens

Define reusable CSS/Tailwind colors:

```text
Black: #050607
Charcoal: #0B0F12
Charcoal 2: #11171C
Cyan: #00CFFF
Bright Cyan: #19D8FF
Dark Cyan: #008EAF
White: #F5F7FA
Muted White: #AEB7BF
Pink Accent: #FF2DA6
Yellow Accent: #F5E642
```

Use cyan as the primary accent.

Use pink or yellow sparingly.

Approximate visual ratio:

90% black/charcoal/white
8% cyan
2% optional accent

---

## 4. Typography

Use:

- Barlow Condensed or Anton for major headings
- Space Grotesk for normal UI/body text
- JetBrains Mono for technical labels

Large headings should be uppercase, bold and often italic.

Examples:

```text
HIVEMIND
CHALLENGE ARENA
THE PRIZE VAULT
ONE HIVE.
MANY MINDS.
```

Technical labels should look like:

```text
SYS // HIVEMIND_2026
EVENT_01
STATUS // ACTIVE
NODE // SSDC
PROTOCOL // SEPTEMBER
```

---

## 5. Routes

Implement:

```text
/
 /events
 /events/:eventId
```

The homepage contains the complete event overview.

The events page displays all five challenges.

The event detail route displays complete information for one event.

Include a custom 404 page.

---

# 6. Homepage

Create these sections in order:

1. Navbar
2. Hero
3. Event statistics
4. Enter the Hive / About
5. Challenge Arena
6. September Timeline
7. Prize Vault
8. How It Works
9. One Hive / Community
10. FAQ
11. Discord CTA
12. Footer

---

# 7. Navbar

Desktop:

```text
SSDC LOGO

HIVEMIND 2026
EVENTS
TIMELINE
PRIZES
FAQ

[ JOIN THE HIVE ]
```

Make navbar sticky.

On mobile use a compact menu.

Use a subtle transparent/dark background and cyan hover states.

---

# 8. Hero

Create a visually dominant hero.

Left side:

```text
SSDC PRESENTS

HIVEMIND
2026

A MONTH OF CHALLENGES.
ONE HIVE.

[ EXPLORE EVENTS ]
[ JOIN THE HIVE ]
```

Right side should contain an abstract animated Hive visual made from:

- hexagons
- nodes
- connecting lines
- cyan glow
- subtle floating motion

Do not depend on a large raster image for the entire hero if CSS/SVG can create the visual.

Add subtle circuit-board traces around the hero.

Include a faint oversized "2026" in the background.

---

# 9. Hero Countdown

Show a countdown to the opening of HiveMind 2026:

```text
THE HIVE OPENS IN

DD
HH
MM
SS
```

The countdown should use the configured event opening date.

After the event begins, change the component to show the currently active/upcoming challenge.

Make the countdown reusable.

---

# 10. Statistics

Create a high-impact stats strip:

```text
05 EVENTS
01 MONTH
30 DAYS
₹17,500 PRIZE POOL
```

Use animated counters when they enter the viewport.

IMPORTANT:

The supplied poster says ₹18,000+ while the detailed prize breakdown totals ₹17,500. Do not silently invent or alter the amount. Keep the prize amount in a central configuration variable so it can easily be changed once the organizers confirm the official figure.

---

# 11. About Section

Heading:

```text
NOT JUST
ANOTHER COLLEGE FEST.
```

Content:

HiveMind 2026 is a month-long challenge festival by the SLIET Software Development Club.

Five challenges.
Five different skill sets.
One month to prove what you can do.

Use a visual progression:

```text
THINK
↓
CREATE
↓
BREAK
↓
OUTSMART
↓
CODE
```

---

# 12. Challenge Arena

Heading:

```text
THE
CHALLENGE
ARENA
```

Subtitle:

```text
Five events. Five ways to think differently.
```

Create five event cards.

Cards should have:

- event number
- title
- tagline
- short description
- date
- duration
- format
- prize pool
- status
- CTA
- event icon

Hover interaction:

- subtle upward movement
- cyan border
- brighter technical labels
- background grid/glow activation
- enlarged event number

Do not make cards excessively rounded.

Prefer angular or slightly chamfered visual treatment.

---

# 13. Event Data

Create:

```text
src/data/events.ts
```

Use a typed event structure.

Each event should contain:

```text
id
number
title
tagline
description
format
duration
startDate
endDate
prizePool
prizes
registrationUrl
rules
icon
accent
status
```

Do not hard-code event information inside UI components.

The same event data must power:

- homepage cards
- events page
- event detail pages
- timeline
- prize pool
- countdown/status

---

# 14. Official Events

## Event 01 — Bad UI

Title:

```text
BAD UI
```

Tagline:

```text
DESIGN CHAOS.
```

Description:

A chaotic design and development challenge. Participants create the most uniquely frustrating, unintuitive, but technically functional user interface possible. Points are awarded for creativity, technical execution, and sheer user frustration.

Format:

```text
Take-home project
```

Duration:

```text
5 Days
```

Dates:

```text
September 1–6, 2026
```

Prize pool:

```text
₹3,000
```

Prizes:

```text
Most Frustrating — ₹1,500
Runner Up — ₹750
Most Creative — ₹750
```

Registration:

Unstop registration.

---

## Event 02 — Reverse AI-ngineering

Title:

```text
REVERSE AI-NGINEERING
```

Tagline:

```text
PROMPT THE IMPOSSIBLE.
```

Description:

A fast-paced live prompt-engineering battle. Participants are shown complex AI-generated images or short videos and must replicate the media as closely as possible using a single text prompt.

Format:

```text
In-person live event
```

Duration:

```text
2–3 Hours
```

Date:

```text
September 17, 2026
```

Prize pool:

```text
₹3,000
```

Prizes:

```text
1st — ₹1,500
2nd — ₹1,000
3rd — ₹500
```

---

## Event 03 — Pseudo-Breach

Title:

```text
PSEUDO-BREACH
```

Tagline:

```text
HACK THE SANDBOX.
```

Description:

A beginner-friendly Web Hacking/CTF event. Participants connect to a demo terminal and attempt to exploit a sandbox website using "C- (C minus)", a fantasy scripting syntax created specifically for this event.

Format:

```text
Weekend hackathon style
```

Duration:

```text
24 Hours
```

Dates:

```text
September 18–19, 2026
```

Prize pool:

```text
₹3,500
```

Prizes:

```text
1st — ₹1,700
2nd — ₹1,000
3rd — ₹500
4th — ₹300
```

---

## Event 04 — Mind Over Majority

This is the centerpiece event.

Title:

```text
MIND OVER MAJORITY
```

Tagline:

```text
OUTSMART THE CROWD.
```

Description:

A massive multiplayer Game Theory experiment. Participants receive a form containing 100 psychological/statistical questions. The objective is to accurately predict crowd behavior and outsmart the majority.

Format:

```text
Asynchronous
```

Duration:

```text
48 Hours
```

Dates:

```text
September 23–25, 2026
```

Prize pool:

```text
₹4,000
```

Prizes:

```text
1st — ₹2,000
2nd — ₹1,000
3rd — ₹500
4th — ₹300
5th — ₹200
```

Give this event a visually larger treatment on the homepage.

---

## Event 05 — Algo-Arena

Title:

```text
ALGO-ARENA
```

Tagline:

```text
CODE FOR GLORY.
```

Description:

The grand finale. A high-stakes Competitive Programming contest hosted on Codeforces.

Format:

```text
Live Competitive Programming Contest
```

Duration:

```text
3 Hours
```

Date:

```text
September 27, 2026
```

Prize pool:

```text
₹4,000
```

Categories:

First-Year Category:

```text
1st — ₹1,000
2nd — ₹500
```

All Category:

```text
1st — ₹1,000
2nd — ₹750
3rd — ₹500
Random 4–10 — ₹250
```

Include a Codeforces CTA.

---

# 15. Timeline

Create an interactive timeline.

Overall schedule:

```text
September 1–5
PHASE 1 — PRE-EXAM

September 6–13
FEST PAUSED — MINOR EXAMS

September 14–30
PHASE 2 — MAIN EVENTS & GRAND FINALE
```

Important event dates:

```text
Sep 1
Bad UI begins

Sep 6
Bad UI submission deadline / fest pause begins

Sep 13
Fest pause ends

Sep 17
Reverse AI-ngineering

Sep 18–19
Pseudo-Breach

Sep 23–25
Mind Over Majority

Sep 27
Algo-Arena Grand Finale
```

Desktop should use a horizontal timeline.

Mobile should automatically switch to a vertical timeline.

Clicking a timeline item should reveal event information.

---

# 16. Prize Vault

Create a visually dramatic section:

```text
THE
PRIZE
VAULT
```

Display the configured total prize pool prominently.

Then display:

```text
BAD UI                 ₹3,000
REVERSE AI-NGINEERING  ₹3,000
PSEUDO-BREACH          ₹3,500
MIND OVER MAJORITY     ₹4,000
ALGO-ARENA             ₹4,000
```

Use animated bars or angular visual indicators.

---

# 17. How It Works

Create four steps:

```text
01
CHOOSE YOUR BATTLE

02
REGISTER FOR THE EVENT

03
TAKE THE CHALLENGE

04
CLAIM YOUR GLORY
```

Use large numbers and minimal text.

---

# 18. One Hive Section

Heading:

```text
ONE HIVE.
MANY MINDS.
```

Copy:

```text
DESIGNERS.
CODERS.
HACKERS.
STRATEGISTS.
CREATORS.

Different skills.
Different challenges.
One community.
```

Add an animated network of connected hexagonal nodes.

---

# 19. FAQ

Create an accessible accordion.

Include:

- Who can participate?
- Is HiveMind 2026 free?
- Can I participate in multiple events?
- Are events individual or team-based?
- Where will registrations happen?
- How will winners be selected?
- When will results be announced?
- Are certificates provided?
- Where will announcements be posted?
- Where can participants get help?

Keep answers configurable in:

```text
src/data/faq.ts
```

Do not invent policies that have not been provided.

---

# 20. Discord CTA

Near the bottom:

```text
DON'T JUST
WATCH THE HIVE.

JOIN IT.

Get announcements.
Ask questions.
Meet participants.
Don't miss a challenge.

[ JOIN DISCORD ]
```

Discord:

```text
discord.gg/ssdc
```

---

# 21. Footer

Include:

```text
SSDC
SLIET SOFTWARE DEVELOPMENT CLUB

HIVEMIND 2026

EVENTS
TIMELINE
PRIZES
FAQ

Instagram
Website
Discord

© 2026 SSDC
```

Use the official website and social links only when supplied/configured.

---

# 22. Event Details Page

Create a reusable EventDetails page.

Structure:

```text
EVENT_01

BAD UI

DESIGN CHAOS.

Description

────────────────────

EVENT INFORMATION

DATE
FORMAT
DURATION
PRIZE POOL

────────────────────

PRIZES

1ST
RUNNER UP
SPECIAL CATEGORY

────────────────────

RULES

01
02
03

────────────────────

[ REGISTER NOW ]
```

The layout must be generated from the event data.

Do not create five separate page components.

---

# 23. Visual Effects

Implement subtle effects:

- grid background
- circuit traces
- cyan glow
- hexagon outlines
- floating nodes
- scanline/noise texture
- section reveal animations
- hover animations
- number counters
- timeline animations
- button hover effects

Keep animations fast and intentional.

Use Framer Motion.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

and disable/reduce non-essential motion.

---

# 24. Background Components

Create reusable components:

```text
CircuitBackground
Hexagon
GridBackground
GlowText
SectionDivider
```

These should be composable rather than duplicated throughout the project.

---

# 25. Responsive Requirements

Desktop:

- large display typography
- horizontal timeline
- 2-column layouts
- large hero composition

Tablet:

- reduced typography
- two-column event grid where appropriate

Mobile:

- single-column layout
- vertical timeline
- compact navbar
- horizontally scrollable stats if necessary
- no horizontal page overflow
- hero typography scaled correctly
- buttons remain easy to tap

The site must look intentionally designed on mobile, not like a collapsed desktop site.

---

# 26. Accessibility

Implement:

- semantic HTML
- proper heading hierarchy
- keyboard navigation
- visible focus states
- accessible accordion
- accessible mobile navigation
- sufficient color contrast
- alt text
- reduced-motion support

The visual style may be chaotic, but the actual website must remain usable.

---

# 27. SEO

Configure:

Title:

```text
HiveMind 2026 | SSDC SLIET
```

Description:

```text
HiveMind 2026 — A month-long challenge festival by the
SLIET Software Development Club featuring design, AI,
cybersecurity, game theory and competitive programming.
```

Add:

- favicon
- Open Graph metadata
- Twitter/X metadata
- robots.txt
- sitemap
- appropriate semantic HTML

---

# 28. Code Quality

Follow these rules:

- TypeScript strict mode
- reusable components
- no duplicated event data
- no giant monolithic component
- no hard-coded values scattered throughout JSX
- meaningful component names
- clean folder structure
- responsive Tailwind classes
- reusable utility functions
- comments only where useful

---

# 29. Suggested Folder Structure

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── SectionHeader.tsx
│   ├── EventCard.tsx
│   ├── EventGrid.tsx
│   ├── Timeline.tsx
│   ├── PrizePool.tsx
│   ├── HowItWorks.tsx
│   ├── HiveSection.tsx
│   ├── FAQ.tsx
│   ├── DiscordCTA.tsx
│   ├── Footer.tsx
│   ├── Hexagon.tsx
│   ├── CircuitBackground.tsx
│   ├── GlowText.tsx
│   └── SectionDivider.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── Events.tsx
│   ├── EventDetails.tsx
│   └── NotFound.tsx
│
├── data/
│   ├── events.ts
│   ├── timeline.ts
│   ├── prizes.ts
│   └── faq.ts
│
├── types/
│   └── event.ts
│
├── hooks/
│   ├── useCountdown.ts
│   └── useScrollProgress.ts
│
├── utils/
│   └── formatDate.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

# 30. Final Quality Requirement

Before considering the website complete, verify:

- No horizontal overflow
- All routes work
- Event cards link correctly
- Timeline dates are correct
- Prize calculations are consistent
- Countdown works
- Mobile navigation works
- FAQ works
- External registration links are configurable
- Discord link works
- Reduced motion works
- Keyboard navigation works
- Images have alt text
- No placeholder Lorem Ipsum
- No fake event information
- No unnecessary dependencies
- No console errors
- Production build succeeds

The final result should feel like a **premium cyber-tech competition platform inspired by the supplied HiveMind 2026 poster**, while remaining clean, readable and easy for participants to navigate.

Do not simply copy the poster into HTML. Translate its typography, geometry, color system, circuit motifs and competitive energy into a modern interactive web experience.