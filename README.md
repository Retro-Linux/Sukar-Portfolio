# Sukar's Portfolio 🎨✨

A highly optimized, bilingual (English/Arabic), full-stack portfolio built for Sukar, a talented 13-year-old Egyptian artist. This project leverages a modern, server-rendered architecture to deliver blazing-fast performance, dynamic localized content, and a robust, secure backend for commission inquiries.

## 🎯 Design Challenges & Solutions

**The Challenge:** 
Create a portfolio that accurately reflects the personality of a 13-year-old artist—creative, warm, and approachable—without sacrificing the professional credibility, reliability, and security expected by paying customers and clients.

**The Solution:**
- **Visual Identity:** We steered clear of rigid, hyper-corporate layouts. Instead, the UI uses a warm, custom color palette (`color-coral`, `color-amber`, `color-cream`) paired with soft, rounded corners and tasteful micro-animations (like hover tilts and float effects).
- **Typography & Tone:** Friendly, rounded typography combined with a conversational tone and appropriate emojis (🎨, 💌, ✨) makes the site feel highly personal.
- **Enterprise-Grade Infrastructure:** Beneath the playful exterior lies a deeply fortified backend. Customers experience a flawless, instant UI, while robust spam protection, rate limiting, and automated transactional emails ensure a highly professional communication pipeline. 

---

## 🚀 Tech Stack Overview

This project was built with a "gold standard" modern web stack, prioritizing performance, developer experience, and enterprise-grade security.

### Frontend
- **Framework:** [Astro](https://astro.build/) (Server-Side Rendered mode)
- **UI Components:** React (Islands Architecture for partial hydration)
- **Styling:** Custom CSS with CSS Variables & Dark Mode support (responsive and themable)
- **Internationalization (i18n):** Full bilingual support (English & Arabic) built natively

### Backend & Infrastructure
- **Headless CMS:** [Sanity](https://www.sanity.io/) (Manages Artwork, Timeline, and incoming Messages)
- **Email Delivery (Hybrid Setup):** 
  - [Resend](https://resend.com/): Blazing-fast delivery for incoming inquiries sent to the portfolio owner.
  - **Nodemailer (Gmail SMTP):** Bypasses strict domain verification on free Vercel hosting by sending personalized, beautiful HTML auto-replies to users directly from a personal Gmail account via an App Password.
- **Rate Limiting:** [Upstash Redis](https://upstash.com/) (Protects API routes from spam and abuse)
- **Spam Protection:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (Invisible, privacy-first CAPTCHA alternative)
- **Schema Validation:** [Zod](https://zod.dev/) (Strict backend payload validation)
- **Deployment:** [Vercel](https://vercel.com/) (Serverless edge hosting)

---

## 🏗️ Architecture & Features

### 1. The Bulletproof Contact Pipeline
The contact form isn't just a simple email forwarder. It is a fully fortified pipeline designed to prevent spam and ensure message delivery:
1. **Frontend UI:** User submits the form. Cloudflare Turnstile generates an invisible security token. A hidden "Honeypot" field traps automated bots. A beautiful floating success modal appears instantly upon success.
2. **Backend (Astro API Route):**
   - **Zod** validates the payload (email format, message length).
   - **Upstash Redis** enforces a sliding-window rate limit (max 3 submissions per hour per IP).
   - **Cloudflare API** verifies the Turnstile token to guarantee a human sender.
3. **Storage & Delivery:**
   - Validated messages are saved directly into the **Sanity CMS** as `message` documents for a permanent, readable backup.
   - **Resend** fires a beautiful, branded HTML email to the portfolio owner.
   - **Nodemailer (Gmail)** securely logs into the owner's Gmail account and sends a cute, age-appropriate HTML "Thank You" auto-reply back to the sender, letting them know their message was received between homework and sketchbook sessions!

### 2. Custom Sanity CMS Studio
The Sanity Studio (located in `/studio-portfolio`) has been heavily customized to provide a beautiful, editor-friendly experience:
- **Custom Branding:** The studio features a custom `Sukar Studio` logo and matching brand colors.
- **Artwork Schema:** Stores the artist's gallery (Title, Category, Medium, Images). The schema is perfectly organized using Sanity `fieldsets` (grouping fields into `🎨 General`, `🌐 Arabic`, `🖼️ Media`, and `⚙️ Metadata`) so the editor form is clean and never overwhelming.
- **Messages Schema:** A custom inbox interface to cleanly read incoming inquiries directly within the CMS. Custom emojis (🖼️, ✉️) replace the default generic icons for quick visual navigation.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v22+)
- API Keys for Sanity, Resend, Upstash, Cloudflare Turnstile, and a Google App Password.

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
   Review the provided `.env.example` file. Create a `.env` file in the root directory and add your keys exactly as formatted in the example file.

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
This project is optimized for **Vercel**. When deploying, ensure that you switch Astro's output mode to `server` (or configure the Vercel adapter) and supply all the environment variables listed in `.env.example` directly in your Vercel Project Settings.

---
*Built with ❤️ for Sukar.*