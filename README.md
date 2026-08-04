# Sukar's Portfolio 🎨✨

A highly optimized, bilingual (English/Arabic), full-stack portfolio built for Sukar, a talented 13-year-old Egyptian artist. This project leverages a modern, server-rendered architecture to deliver blazing-fast performance, dynamic localized content, and a robust, secure backend for commission inquiries.

## 🚀 Tech Stack Overview

This project was built with a "gold standard" modern web stack, prioritizing performance, developer experience, and enterprise-grade security.

### Frontend
- **Framework:** [Astro](https://astro.build/) (Server-Side Rendered mode)
- **UI Components:** React (Islands Architecture for partial hydration)
- **Styling:** Custom CSS with CSS Variables & Dark Mode support (responsive and themable)
- **Internationalization (i18n):** Full bilingual support (English & Arabic) built natively

### Backend & Infrastructure
- **Headless CMS:** [Sanity](https://www.sanity.io/) (Manages Artwork, Timeline, and incoming Messages)
- **Email Delivery:** [Resend](https://resend.com/) (Handles transactional emails and auto-replies)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/) (Protects API routes from spam and abuse)
- **Spam Protection:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (Invisible, privacy-first CAPTCHA alternative)
- **Schema Validation:** [Zod](https://zod.dev/) (Strict backend payload validation)
- **Deployment:** [Vercel](https://vercel.com/) (Serverless edge hosting)

---

## 🏗️ Architecture & Features

### 1. The Contact Pipeline
The contact form isn't just a simple email forwarder. It is a fully fortified pipeline designed to prevent spam and ensure message delivery:
1. **Frontend:** User submits the form. Cloudflare Turnstile generates an invisible security token. A hidden "Honeypot" field traps automated bots.
2. **Backend (Astro API Route):**
   - **Zod** validates the payload (email format, message length).
   - **Upstash Redis** enforces a sliding-window rate limit (max 3 submissions per hour per IP).
   - **Cloudflare API** verifies the Turnstile token.
3. **Storage & Delivery:**
   - Validated messages are saved directly into the **Sanity CMS** as `message` documents for permanent backup.
   - **Resend** fires a beautiful HTML email to the portfolio owner.
   - **Resend** fires a customized, friendly auto-reply back to the sender.

### 2. Sanity CMS Integration
The Sanity Studio (located in `/studio-portfolio`) is configured with custom schemas:
- **Artwork:** Stores the artist's gallery (Title, Category, Medium, Images). Includes custom document actions to auto-translate English fields to Arabic via a translation API.
- **Messages:** A custom inbox interface using Sanity Fieldsets to cleanly read incoming inquiries directly within the CMS.

### 3. Theming & Dark Mode
The UI implements a sophisticated color system using CSS `color-mix()` and native CSS variables. Dark mode seamlessly swaps out the bright, warm palette for a vibrant, high-contrast dark aesthetic without flashing or performance penalties.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v22+)
- API Keys for Sanity, Resend, Upstash, and Cloudflare Turnstile

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Retro-Linux/Sukar-Portfolio.git
   cd "Sukar-Portfolio"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   PUBLIC_SANITY_PROJECT_ID=your_project_id
   PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token

   RESEND_API_KEY=your_resend_key
   CONTACT_EMAIL=your_destination_email

   PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   TURNSTILE_SECRET_KEY=your_secret_key

   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. **Run the Astro Development Server:**
   ```bash
   npm run dev
   ```

5. **Run the Sanity Studio (in a separate terminal):**
   ```bash
   cd studio-portfolio
   npm run dev
   ```

---

## 🌐 Deployment
This project is optimized for **Vercel**. When deploying, ensure that you switch Astro's output mode to `server` (or configure the Vercel adapter) and supply all the environment variables listed above in your Vercel Project Settings.

---
*Built with ❤️ for Sukar.*