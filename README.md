# 🚀 Rahul Kumar — Personal Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![Deployment](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://irahulks.com/)

Personal engineering portfolio built with **Next.js 16 App Router**, **TypeScript**, **MongoDB Atlas**, **Framer Motion**, **Lenis Smooth Scroll**, and **Resend API** — featuring a full visitor analytics and session tracking system.

🔗 **Live**: [https://irahulks.com/](https://irahulks.com/)

---

## ✨ Features & Architecture

### ⚡ Next.js 16 App Router
- Migrated from Vite SPA to Next.js 16 App Router with `src/app/` routes and modular `src/views/` components.
- Optimized image delivery via Next.js `<Image />` with `sharp`.

### 📱 Mobile Navigation
- Floating circular glass arc menu (bottom-right) for mobile/tablet.
- Framer Motion spring physics arc path with smart auto-dismiss on outside tap or scroll (>15px).

### 📊 Visitor Analytics & Session Tracking

The portfolio includes a complete real-time visitor analytics pipeline:

**Visit Counter**
- New visitor detection via a dedicated `localStorage` key (`portfolio_visit_counted`) — separate from the session visitor ID.
- `localStorage` is set **only after** a successful `POST /api/visitcount` response, preventing false flags on network failure.
- In-memory promise deduplication prevents concurrent calls from firing duplicate requests.
- `SessionAnalyticsProvider` is the single owner of the increment trigger — fires on mount across all routes (`/`, `/about`, `/work`, `/resume`, `/contact`).

**Session Tracking**
- `SessionAnalyticsProvider` tracks time spent per page using `usePathname`, `visibilitychange`, and `beforeunload` events.
- Sessions are upserted to MongoDB every 30 seconds and on page transitions/tab close via `navigator.sendBeacon`.
- Stores: `pageBreakdown` (seconds per route), `totalDurationSeconds`, `topPage`, `ip`, `deviceType`, `downloadedResume`, `emailSent`.

**Exit Email (on session end)**
- A single dark-themed HTML email is sent via Resend when `isFinal: true` and session duration ≥ 2 seconds.
- `emailSent` flag in MongoDB prevents duplicate emails from concurrent final beacons.
- Email contains: visitor number, device type, time on site, CV download status, IP + geo-location map, time per page breakdown.

### 📩 Contact Form
- Validation via `react-hook-form` + `yup`.
- Duplicate email detection (409 on re-submission).
- Resend API notification with `Reply-To` header for instant Gmail replies.

### 🛡️ Admin Dashboard
- Protected `/admin/portfolio` route with cookie-based auth.
- Displays KPI cards (total visits, contacts, CV downloads, avg session time), traffic trend chart, device breakdown, recent visitor sessions, and contact inbox.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI & Styling** | Tailwind CSS 3, CSS Modules |
| **Animations** | Framer Motion 10, Lenis Smooth Scroll |
| **State / Data** | TanStack React Query v5 |
| **Database** | MongoDB Atlas, Mongoose 9 |
| **Email** | Resend API |
| **Form Handling** | React Hook Form, Yup, React Phone Input 2 |
| **Deployment** | Netlify (`@netlify/plugin-nextjs`) |

---

## 📁 Project Structure

```
personalPortfolio/
├── public/                 # Static assets & downloadable PDF CV
├── src/
│   ├── api/                # Axios client-side API functions
│   │   ├── portfolio/      # getViewCount, increaseViewCountIfNew, submitContactForm
│   │   └── admin/          # Admin analytics & login API calls
│   ├── app/                # Next.js App Router pages & API handlers
│   │   ├── (portfolio)/    # Portfolio route group with layout
│   │   ├── admin/          # /admin/portfolio dashboard
│   │   ├── adminLogin/     # Admin login page
│   │   └── api/
│   │       ├── visitcount/ # GET (read count) / POST (increment count)
│   │       ├── session/    # GET (sessions list) / POST (upsert session + exit email)
│   │       ├── contact/    # POST (save contact + email notification)
│   │       └── admin/
│   │           ├── analytics/  # Aggregated analytics for dashboard
│   │           └── login/      # Admin auth
│   ├── component/          # Reusable UI components
│   ├── hooks/              # useVisitCount, useContactForm
│   ├── lib/                # MongoDB connection helper
│   ├── models/             # Mongoose schemas: Visit, Session, Contact
│   ├── providers/          # SessionAnalyticsProvider, QueryProvider, SmoothScrollProvider
│   └── views/              # Page views: Home, About, Works, ContactForm, Resume
├── netlify.toml            # Netlify build config
├── next.config.js          # Next.js settings & security headers
├── tailwind.config.js      # Tailwind theme tokens
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio

# Resend API Key for Email Notifications
RESEND_API_KEY=re_your_resend_api_key

# Recipient Email for Visitor Exit Alerts & Contact Form Notifications
CONTACT_NOTIFICATION_EMAIL=your@email.com
```

---

## 💻 Local Development

```bash
git clone https://github.com/irahulk01/personalPortfolio.git
cd personalPortfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deployment (Netlify)

1. Connect GitHub repo to Netlify.
2. Set env vars (`MONGO_URI`, `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL`) in Netlify Site Settings.
3. Deploy from `staging` or `main` branch.

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 👤 Author

**Rahul Kumar**
- **Portfolio**: [https://irahulks.com/](https://irahulks.com/)
- **Email**: [irahulkv@gmail.com](mailto:irahulkv@gmail.com)
- **GitHub**: [@irahulk01](https://github.com/irahulk01)
