# EverAfter — Premium Wedding Planning & Event Management Platform

> *“Every detail. One beautiful beginning.”*

EverAfter is a production-quality wedding planning and event management frontend platform designed for couples, families, and planners. It offers full support for multi-day Indian wedding traditions (Roka, Haldi, Mehendi, Sangeet, Vedic Pheras, Reception) alongside contemporary and destination celebrations.

---

## 🌟 Key Modules & Features

1. **Editorial Marketing Homepage (`/`)**
   - 15 luxury sections including hero story, how it works, feature highlights, heritage venue spotlights, popular vendor masters, inspiration gallery, multi-day traditions overview, demo testimonials, FAQs, and newsletter subscription.

2. **Onboarding Wizard (`/start-planning`)**
   - 8-step interactive wizard configuring couple details, dates, destinations, master budget, headcount distribution, celebration styles, and ceremonial functions with client-side persistence and celebration confetti.

3. **Personalized Wedding Dashboard (`/dashboard`)**
   - Real-time KPI metrics derived directly from Pinia state, live countdown timer, fast actions bar, upcoming function timelines, task priorities, and interactive Chart.js donut distributions.

4. **Financial & Budget Planner (`/budget`)**
   - Itemized expense tracking, down-payment installments, category budget caps, over-budget warnings, and instant CSV export.

5. **Interactive Checklist (`/checklist`)**
   - Phase-based task management with subtasks, priority tags, assignees, overdue badges, and dual List/Timeline views.

6. **Guest List & RSVP Manager (`/guests`)**
   - Party headcount tracking, dietary requirements breakdown (Vegetarian, Jain, Vegan, Halal, etc.), bulk guest import, and unique digital demo RSVP links (`EA-9001`).

7. **Seating Arrangement Studio (`/seating`)**
   - Visual floor-plan builder supporting Round, Rectangular, and Square tables with drag-and-drop seating, seat capacity counters, and accessible quick-assign dropdowns.

8. **Curated Vendors & Heritage Venues (`/vendors`, `/venues`)**
   - Searchable marketplaces with city, category, capacity, and price filters, package specifications, photo galleries, and local demo inquiry simulation.

9. **Shortlist & Comparison Matrix (`/shortlist`)**
   - Save favorites, mark confirmed bookings, record private notes, compare up to 4 properties side-by-side, and push estimates directly to the budget.

10. **Master Calendar (`/calendar`)**
    - FullCalendar integration supporting Month, Week, Day, and Agenda List views with draggable event rescheduling and category color-coding.

11. **Multi-Day Timeline (`/timeline`)**
    - Chronological function scheduler featuring automated schedule conflict and overlap detection, function reordering, and print-optimized sheets.

12. **Moodboard Inspiration Studio (`/moodboard`)**
    - Masonry inspiration grid, collection management, category tag filters, and browser-local image upload support.

13. **Digital Invitation Builder (`/invitations`)**
    - 7 bespoke editorial card templates (Royal Rajputana, Vedic Heritage, Minimalist, Botanical, Modern Chic, Garden, Coastal) with live card rendering and high-res print support.

14. **Public RSVP Experience (`/rsvp/:code`)**
    - Personalized guest RSVP portal with attendance confirmation, attendee counts, meal preferences, error states for invalid codes, and celebratory confetti.

15. **Wedding Website Builder (`/wedding-website`)**
    - No-code couple microsite builder with section toggles, theme switcher, and interactive live guest preview.

16. **Family Collaboration Hub (`/collaboration`)**
    - Simulated team workspace with role badges (Bride, Groom, Planner, Family), shared task feed, and discussion notes.

17. **Notification Center (`/notifications`)**
    - Filterable notification stream with persistent read states for payment due dates, RSVPs, and task deadlines.

18. **Planning Reports & Dossiers (`/reports`)**
    - Comprehensive financial audit tables, catering dietary summaries, executive summary CSV export, and print-ready dossiers.

19. **Settings, Data Backup & Reset (`/settings`)**
    - Couple profile controls, currency localization (INR, USD, EUR, GBP, AED, CAD, AUD), full workspace JSON export and import, and safe reset to default demo data.

---

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **State Management**: Pinia (modular domain stores)
- **Styling**: Tailwind CSS with custom luxury color tokens & Dark Mode
- **Routing**: Vue Router 4
- **Calendar**: FullCalendar (DayGrid, TimeGrid, Interaction, List plugins)
- **Data Visualizations**: Chart.js (Doughnut & Bar controllers)
- **Animations & Effects**: Canvas Confetti & GSAP
- **Icons**: Lucide Vue Next
- **Date Handling**: date-fns
- **Build Tool**: Vite

---

## 🎨 Design System Palette

- **Warm Ivory**: `#FAF7F2`
- **Champagne**: `#E8D8B9`
- **Soft Gold**: `#B99A62`
- **Dusty Rose**: `#D9B8B0`
- **Muted Sage**: `#AAB5A0`
- **Deep Charcoal**: `#292725`
- **Warm Gray**: `#77716B`

---

## 💻 Development & Build

```bash
# Install dependencies
pnpm install

# Run local development server
pnpm dev

# Build for production
pnpm build
```

---

## 📜 Credits & Brand Notice

- **Platform**: EverAfter
- **Designed & Developed by**: [Infinvo Tech](https://infinvo-tech.vercel.app/)
- **Copyright**: © 2026 EverAfter. All rights reserved.
- *Notice: This application is a client-side frontend demo. All vendors, venues, guests, and payment statuses are fictional local demo data.*
