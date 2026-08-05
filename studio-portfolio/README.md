# Sukar Studio 🎨 (Sanity CMS)

This is the headless CMS backend for Sukar's Portfolio, built using **Sanity Studio v3**. It provides a fully custom, beautifully themed dashboard for managing artwork and reading incoming messages.

## 🌟 Key Features

- **Custom Theming:** A warm, inviting color palette tailored to Sukar's artistic brand, complete with a custom `Sukar Studio` logo.
- **Optimized Editor Experience:**
  - **Artwork Schema (`artwork.ts`):** We use Sanity `fieldsets` to organize the massive list of fields into logical groups (`🎨 General`, `🌐 Arabic Translations`, `🖼️ Media`, and `⚙️ Settings`). This keeps the editor interface incredibly clean and focused.
  - **Message Schema (`message.ts`):** Serves as an internal inbox for the contact form. Inquiries sent from the portfolio are automatically saved here via API for permanent backup.
- **Custom Emojis:** The sidebar utilizes intuitive emojis (🖼️ for Artwork, ✉️ for Messages) for easy navigation.

## 🏗️ Structure

- `/schemaTypes/artwork.ts` - The schema defining how artwork is structured, including title, medium, description, Arabic translations, and images.
- `/schemaTypes/message.ts` - The read-only schema designed to store contact form submissions securely.
- `/components/CustomLogo.tsx` - A React component injecting Sukar's custom branding directly into the Studio header.
- `sanity.config.ts` - The core configuration file linking schemas, components, and the studio's deployed URL.

## 💻 Local Development

To run the Sanity Studio locally on your machine alongside the Astro frontend:

1. Navigate to this directory:
   ```bash
   cd studio-portfolio
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The studio will open at `http://localhost:3333`.*

## 🚀 Deployment

The studio is currently deployed and hosted directly by Sanity at [https://sukar-sketchbook.sanity.studio/](https://sukar-sketchbook.sanity.studio/).

To deploy new changes (like adding a new schema or updating the layout):
```bash
npx sanity deploy
```
*(Ensure you select `yes` when it asks to verify local content.)*
