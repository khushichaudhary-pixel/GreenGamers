# 🌱 GREEN GAMERS – Gamified Plantation Tracking & Sustainability Platform

> **"Don't Just Plant It. Play With It. Grow It."**  
> *Turning plantation from a one-day duty into a daily habit.*

---

## 🌍 Project Overview

**Green Gamers** is a professional full-stack web application designed for academic project demonstrations, hackathon presentations, and institutional green drives. It bridges the gap between tree plantation and long-term tree survival by combining gamification (XP, Levels, Badges, Streaks, Challenges, Leaderboard) with comprehensive horticultural tracking (growth measurements, watering schedules, photo milestones, and CO2 analytics).

---

## 🏛️ United Nations SDG Alignment

- **SDG 13 – Climate Action (Target 13.3):** Quantifying urban carbon absorption and human climate capacity.
- **SDG 15 – Life on Land (Target 15.2):** Sustaining terrestrial flora, biodiversity tracking, and combating land degradation.

---

## 🛠️ Technology Stack

### Frontend
- **React.js 18** (Functional components with Hooks & Context API)
- **Vite 6** (Blazing-fast build tool and dev server)
- **React Router DOM v6** (SPA routing with protected & role-based routes)
- **Vanilla CSS3 Design System** (Forest green `#0e382c`, Emerald `#059669`, Off-white `#f8faf9`)
- **Lucide React** (Clean, modern icon set)
- **Recharts** (Interactive Area, Bar, and Pie analytics charts)
- **Canvas-Confetti** (Gamification level-up & badge celebration effects)

### Backend
- **Node.js & Express.js** (REST API Architecture)
- **MongoDB & Mongoose ODM** (Embedded in-memory fallback + native MongoDB support)
- **JWT (JSON Web Tokens)** & **Bcrypt.js** (Secure authentication & password hashing)
- **Multer** & **Cloudinary** (Multi-format image upload engine with local disk fallback)
- **Morgan** (HTTP request logging)

---

## ⚡ 1-Click Evaluation Accounts (Pre-Seeded)

The database automatically initializes with rich demo data if running for the first time:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Demo Planter** | `user@greengamers.org` | `user123` | **Aarav Patel** • Level 5 (Eco Steward) • 1,680 XP • 8 Plants • 18-Day Streak |
| **Green Admin** | `admin@greengamers.org` | `admin123` | **Dr. Ananya Sharma** • Level 7 (Earth Guardian) • 3,450 XP • Full Admin Console |
| **Competitor 1** | `kavya@greengamers.org` | `user123` | **Kavya Reddy** • Level 6 (Green Champion) • 2,450 XP • BITS Pilani |
| **Competitor 2** | `rohan@greengamers.org` | `user123` | **Rohan Verma** • Level 5 (Eco Steward) • 1,420 XP • DTU Delhi |

---

## 🎮 Gamification Engine & Point Matrix

| Action | Points Earned | Purpose |
| :--- | :--- | :--- |
| **Plant Registration** | `+50 Eco XP` | Initial sapling cataloging with baseline height & species |
| **Watering Log** | `+10 Eco XP` | Daily hydration routine (maintains daily streak) |
| **Growth Measurement** | `+20 Eco XP` | Height progression & maturity tracking |
| **Growth Photo Evidence** | `+15 Eco XP Bonus` | Visual timeline verification |
| **Fertilizing & Soil Mulch** | `+10 Eco XP` | Nutrient enrichment and aeration |
| **Health Check Inspection** | `+5 Eco XP` | Pests and foliage health monitoring |
| **Challenge Completion** | `+100 to +300 XP` | Finishing 7-day or 30-day habit milestones |
| **Community Post Sharing** | `+15 Eco XP` | Inspiring fellow planters and green enthusiasts |

### 7-Level Progression Roadmap
1. **Level 1 – Seedling** (0 – 199 XP)
2. **Level 2 – Green Starter** (200 – 499 XP)
3. **Level 3 – Plant Protector** (500 – 899 XP)
4. **Level 4 – Eco Warrior** (900 – 1,399 XP)
5. **Level 5 – Eco Steward** (1,400 – 1,999 XP)
6. **Level 6 – Green Champion** (2,000 – 2,999 XP)
7. **Level 7 – Earth Guardian** (3,000+ XP)

---

## 📱 Application Modules & Pages

1. **Landing Page (`/`):** Hero section with interactive CTA, live environmental impact counters, 6-step workflow, and SDG 13/15 alignment.
2. **Authentication (`/login` & `/register`):** JWT Auth, 1-Click demo logins, +50 XP welcome reward.
3. **User Dashboard (`/dashboard`):** Real-time KPI cards, time-based greetings, growth overview chart, today's care checklist with 1-click watering, active challenges, and leaderboard preview.
4. **My Plants (`/plants`):** Flora inventory with filters (*Healthy*, *Needs Care*, *Thriving*, *Growing*), search, sorting, and direct care actions.
5. **Add Plant (`/plants/add`):** Plant registration with popular Indian species auto-fill presets (*Tulsi*, *Neem*, *Peepal*, *Mango*, *Rose*, *Money Plant*), photo uploads, and +50 XP reward.
6. **Plant Details (`/plants/:id`):** Deep-dive profile with growth timeline, care history table, height trend chart, and maintenance buttons.
7. **Growth Timeline (`/growth-timeline`):** Plant height progression area chart and chronological photo logs.
8. **Care & Watering Tracker (`/care-tracker`):** Daily hydration checklist, streak tracker, and maintenance activity feed.
9. **Progress Report (`/progress-report`):** Recharts analytics with survival rates, monthly plantation bars, care activity distribution pie chart, and printable PDF format.
10. **Achievements & Badges (`/achievements`):** 8 milestone badges (*First Plant*, *Water Keeper*, *Growth Tracker*, *Green Streak*, *Plant Protector*, *Green Champion*, *Biodiversity Advocate*, *Carbon Neutralizer*), level progression ladder, and XP matrix.
11. **Challenges (`/challenges`):** 7-day, 14-day, and 30-day habit challenges with real-time progress bars and XP rewards.
12. **Leaderboard (`/leaderboard`):** National rankings with Top 3 Podium (*Gold*, *Silver*, *Bronze*), time-frame filters (*All-Time*, *Monthly*, *Weekly*), and campus/city filtering.
13. **Community Feed (`/community`):** Social feed with plant milestones, real-time likes, comments, photo shares, and species tags.
14. **Notifications (`/notifications`):** Care reminders, XP milestones, and badge unlocks with mark-read support.
15. **User Profile (`/profile`):** Planter statement, Green Journey statistics, badge collection, and registered plants grid.
16. **Settings (`/settings`):** Account details, notification toggles, measurement units, and password management.
17. **Admin Dashboard (`/admin`):** Institutional console with system-wide analytics, user role promotion/demotion, plant moderation, and challenge publisher.

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Quick Start

**Terminal 1: Start Backend**
```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:5000 with auto-seeded MongoDB
```

**Terminal 2: Start Frontend**
```bash
cd frontend
npm install
npm run dev
# App will run on http://localhost:5173
```

---

## 🔒 Security & Data Integrity

- **Password Hashing:** Bcrypt.js with 10 salt rounds.
- **JWT Protection:** Authorization headers with bearer token validation on private routes.
- **Role-Based Access Control:** Separate middleware enforcing administrator privileges for `/api/admin/*`.
- **Input Sanitization & Error Handling:** Graceful error handling for missing inputs, duplicate records, and invalid file formats.

---
© 2026 GREEN GAMERS – Built for Environmental Sustainability & Continuous Habit Formation.
