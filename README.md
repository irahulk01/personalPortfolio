# 🚀 Rahul Kumar — Personal Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![Deployment](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://irahulks.com/)

Welcome to the official repository of my personal engineering portfolio! Built from the ground up using **Next.js 16 App Router**, **TypeScript**, **Lenis Smooth Scroll**, **Framer Motion**, **MongoDB**, and **Resend API**.

🔗 **Live Portfolio**: [https://irahulks.com/](https://irahulks.com/)

---

## ✨ Key Engineering Features & Architecture

### ⚡ Next.js 16 App Router Migration
- Migrated legacy Vite SPA architecture into Next.js 16 App Router (`src/app/` routes with modular `src/views/` components).
- Optimized image delivery using Next.js `<Image />` with `sharp` native image transformation.

### 📱 Responsive Mobile Arc Fan-Out Navigation
- Interactive floating circular glass menu button at the bottom-right for mobile and tablet views.
- Framer Motion 3D arc path spring physics (`[-18px, -36px, -48px, -32px, -14px]` curve).
- Smart Dismiss System: Automatically closes the navigation stack when tapping outside or scrolling (>15px threshold).

### 🖥️ Zero-Scroll Viewport Layout System
- Custom `min-h-[calc(100vh-120px)]` flex grid container for Home and Contact pages.
- Eliminates vertical scrollbars and white space gaps on desktop and large screens.

### 📊 Real-Time Visitor Analytics & Resend Email Alerts
- **Database Visitor Counter**: Persists live visitor counts to MongoDB Atlas via Mongoose.
- **Silent Telemetry & Geolocation**: Server-side IP lookup via `ip-api.com` combined with client browser metrics (screen size, viewport, timezone, language, and traffic source).
- **Portfolio-Themed Email Dashboard**: Sends styled HTML email notifications to Gmail featuring device icons and OpenStreetMap visual location map previews.

### 📩 Contact Form & Resend API
- Contact form validation powered by `react-hook-form` and `yup`.
- Direct email notifications sent via Resend API with `Reply-To` header configured for instant responses inside Gmail.

---

## 🛠️ Tech Stack & Tooling

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI & Styling** | Tailwind CSS 3, CSS Modules, Modern HSL Tokens |
| **Animations** | Framer Motion 10, Lenis Smooth Scroll |
| **Database** | MongoDB Atlas, Mongoose 9 |
| **Email Service** | Resend API, Nodemailer |
| **Form Handling** | React Hook Form, Yup Validation, React Phone Input 2 |
| **Deployment** | Netlify (`@netlify/plugin-nextjs`) |

---

## 📁 Project Structure

```
personalPortfolio/
├── public/                 # Static assets & downloadable PDF CV
├── src/
│   ├── api/                # Axios client-side API functions
│   ├── app/                # Next.js 16 App Router pages & API handlers
│   │   ├── about/          # /about route
│   │   ├── contact/        # /contact route
│   │   ├── resume/         # /resume route
│   │   ├── work/           # /work route
│   │   ├── api/            # Serverless API routes (/visitcount, /contact)
│   │   ├── layout.tsx      # Root layout wrapper with header & Lenis provider
│   │   └── page.tsx        # / home route
│   ├── component/          # Reusable components (Header, ResumeButton, etc.)
│   ├── hooks/              # Custom React hooks (useVisitCount, useContactForm)
│   ├── lib/                # Database connection helper (mongodb.ts)
│   ├── models/             # Mongoose schemas (Visit.ts, Contact.ts)
│   ├── providers/          # Context providers (SmoothScrollProvider, QueryProvider)
│   └── views/              # Page view components (Home, About, Works, ContactForm)
├── netlify.toml            # Netlify build configuration
├── next.config.js          # Next.js settings & security headers
├── tailwind.config.js      # Tailwind theme tokens & color definitions
└── README.md               # Documentation
```

---

## 🔑 Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio

# Resend API Key for Email Notifications
RESEND_API_KEY=re_your_resend_api_key

# Recipient Email for Inquiry & Visitor Alerts
CONTACT_NOTIFICATION_EMAIL=irahulkv@gmail.com
```

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/irahulk01/personalPortfolio.git
   cd personalPortfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment (Netlify)

This project is configured for seamless deployment on **Netlify** using `@netlify/plugin-nextjs`.

### Netlify Deployment Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

To deploy:
1. Connect your GitHub repository to Netlify.
2. Set Environment Variables (`MONGO_URI`, `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL`) in Netlify Site Configuration.
3. Deploy branch `staging` or `main`.

---

## 👤 Author

**Rahul Kumar**  
- **Portfolio**: [https://irahulks.com/](https://irahulks.com/)  
- **Email**: [irahulkv@gmail.com](mailto:irahulkv@gmail.com)  
- **GitHub**: [@irahulk01](https://github.com/irahulk01)

---

*Built with precision, performance, and attention to user experience.* 🚀
