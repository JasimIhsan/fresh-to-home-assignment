# Frisch nach Hause ("Fresh to Home")

> A modern, progressive web application (PWA) e-commerce platform for ordering fresh meat and poultry with delivery to your doorstep.

**Live Demo / Production:** [https://freshtohome.jasimihsan.in/](https://freshtohome.jasimihsan.in/)

---

## 📌 Project Overview

**Frisch nach Hause** is an e-commerce Progressive Web Application (PWA) built with **Next.js 16 (React 19)** and **Tailwind CSS**, designed for speed, installability, and an intuitive shopping experience. It allows customers to browse fresh meat and poultry products (with quantities priced per 0.5 kg increments), manage a persistent cart, configure multiple delivery addresses, and place orders with real-time stock validations.

### Key Highlights & Features

- **📱 Installable Progressive Web App (PWA):** Service worker offline fallback, install prompt integration, and responsive mobile-first UI.
- **🛒 Product Catalog & Smart Cart:** Real-time stock display ("Ausverkauft" indicator when out-of-stock), incremental weight management (0.5 kg units), and persistent carts.
- **⚡ High Performance & Fluid UX:** Built with Next.js App Router, React 19, Motion (Framer Motion animations), Lucide icons, and Tailwind CSS v4 styling.
- **📍 Multi-Address Delivery:** Support for customer address management with primary address selection.
- **🛡️ Data Persistence & Auth:** Authenticated via Firebase Authentication (Email/Password & Google OAuth) with client-side state and data persisted via LocalStorage / Zustand.
- **📋 Admin Management Capabilities:** Built-in flows to inspect orders, update order lifecycles (`PLACED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`), toggle product availability, and manage inventory.

---

## 🌐 Live Deployment

The live application is hosted and accessible at:
👉 **[https://freshtohome.jasimihsan.in/](https://freshtohome.jasimihsan.in/)**

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology / Service | Role & Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, React 19) | Server-side rendering, client components, and optimal PWA routing. |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) | User authentication, account creation, and Google Sign-In support. |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), Motion, Lucide Icons | Modern, mobile-first design system with smooth micro-interactions. |
| **State Management & Storage** | [Zustand](https://github.com/pmndrs/zustand) + LocalStorage | Client-side state persistence for cart, orders, delivery addresses, and user profiles. |
| **Hosting & Edge Delivery** | Vercel Edge CDN | Ultra-fast global static asset caching and deployment. |

---

## 📁 Repository Structure

```text
fresh_to_home/
├── app/                  # Next.js frontend application & API routes
│   ├── src/              # Application source code (components, stores, pages)
│   ├── public/           # Static assets, PWA manifest, and service worker
│   └── package.json      # Dependencies and npm scripts
├── docs/                 # Architectural and technical documentation
│   ├── technical-design.md              # In-depth technical specifications (TDD)
│   ├── infrastructure_design_document.md # Infrastructure architecture & trade-offs
│   ├── openapi.yaml                     # OpenAPI 3.0 API specifications
│   └── assets/                          # Diagrams and visual documentation
└── refrence_app/         # Reference mobile application codebase
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: v20.x or higher
- **npm** / **pnpm** / **yarn**

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JasimIhsan/fresh-to-home-assignment.git
   cd fresh-to-home-assignment/app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the `app` directory with your Firebase configuration:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Additional Documentation

For deeper architectural, schema, and API details, check the `/docs` directory:
- [Technical Design Document](file:///Users/jasimihsanm/Developer/Workspace/fresh_to_home/docs/technical-design.md)
- [Infrastructure Design Document](file:///Users/jasimihsanm/Developer/Workspace/fresh_to_home/docs/infrastructure_design_document.md)
- [OpenAPI Specification](file:///Users/jasimihsanm/Developer/Workspace/fresh_to_home/docs/openapi.yaml)
