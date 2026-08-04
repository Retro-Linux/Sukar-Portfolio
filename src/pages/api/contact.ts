export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createClient } from '@sanity/client';

// 1. Zod Schema for validation
const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject is too short').max(150, 'Subject is too long'),
  message: z.string().min(10, 'Message is too short').max(5000, 'Message is too long'),
  favorite_color: z.string().optional(), // Honeypot
  'cf-turnstile-response': z.string().min(1, 'Turnstile token missing'),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // 2. Validate with Zod
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.issues[0].message }), { status: 400 });
    }

    const { name, email, subject, message, favorite_color, 'cf-turnstile-response': turnstileToken } = parsed.data;

    // 3. Honeypot check
    if (favorite_color) {
      // Silently accept but do nothing (bot trap)
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 4. Rate Limiting check
    if (import.meta.env.UPSTASH_REDIS_REST_URL && import.meta.env.UPSTASH_REDIS_REST_TOKEN) {
      const redis = new Redis({
        url: import.meta.env.UPSTASH_REDIS_REST_URL,
        token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
      });
      // Allow 3 requests per IP per hour
      const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
      });
      const identifier = clientAddress || 'unknown';
      const { success } = await ratelimit.limit(identifier);
      if (!success) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), { status: 429 });
      }
    }

    // 5. Cloudflare Turnstile Verification
    if (import.meta.env.TURNSTILE_SECRET_KEY) {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: import.meta.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: clientAddress || '',
        }),
      });
      const turnstileOutcome = await turnstileRes.json();
      if (!turnstileOutcome.success) {
        return new Response(JSON.stringify({ error: 'Security check failed. Please refresh and try again.' }), { status: 400 });
      }
    }

    // 6. Save to Sanity
    if (import.meta.env.PUBLIC_SANITY_PROJECT_ID && import.meta.env.SANITY_API_TOKEN) {
      const sanity = createClient({
        projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
        dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2024-01-01',
        token: import.meta.env.SANITY_API_TOKEN,
        useCdn: false,
      });

      await sanity.create({
        _type: 'message',
        name,
        email,
        subject,
        message,
        status: 'unread',
        createdAt: new Date().toISOString(),
      });
    }

    // 7. Send Email via Resend to the Portfolio Owner
    if (import.meta.env.RESEND_API_KEY && import.meta.env.CONTACT_EMAIL) {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      
      // Email to Sukar
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>', // Use a verified domain in production
        to: import.meta.env.CONTACT_EMAIL,
        subject: `New Commission Inquiry: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
              .header { background: linear-gradient(135deg, #D4853A, #F47B89); padding: 30px 20px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
              .content { padding: 30px; }
              .field { margin-bottom: 24px; }
              .label { font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 6px; font-weight: 700; }
              .value { font-size: 16px; color: #111; margin: 0; }
              .message-box { background: #fdfdfd; padding: 20px; border-radius: 8px; border-left: 4px solid #F47B89; margin-top: 30px; box-shadow: inset 0 0 0 1px #eee; }
              .message-text { font-size: 15px; line-height: 1.6; color: #333; margin: 0; white-space: pre-wrap; }
              .footer { text-align: center; padding: 20px; font-size: 12px; color: #aaa; background: #fafafa; border-top: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ New Portfolio Inquiry</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From</div>
                  <p class="value"><strong>${name}</strong> &lt;${email}&gt;</p>
                </div>
                <div class="field">
                  <div class="label">Subject</div>
                  <p class="value">${subject}</p>
                </div>
                
                <div class="message-box">
                  <div class="label" style="margin-bottom: 12px; color: #F47B89;">Message Content</div>
                  <p class="message-text">${message}</p>
                </div>
              </div>
              <div class="footer">
                Sent securely from Sukar Portfolio
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Email back to the User (Auto-reply)
      await resend.emails.send({
        from: 'Sukar <onboarding@resend.dev>', // Should be a verified domain in production
        to: email, // Sending directly to the user who filled the form
        subject: `Thank you for reaching out! 🎨✨`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf9f2; color: #444; margin: 0; padding: 20px; }
              .container { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04); border: 1px solid #f0e9d8; }
              .header { background: #F47B89; padding: 30px 20px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 26px; font-family: 'Comic Sans MS', cursive, sans-serif; font-weight: normal; }
              .content { padding: 40px 30px; text-align: center; line-height: 1.7; font-size: 16px; }
              .highlight { color: #D4853A; font-weight: bold; }
              .signoff { margin-top: 30px; font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 20px; color: #F47B89; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Yay! I got your message! 💌</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${name}</strong>!</p>
                <p>Thank you so much for visiting my portfolio and reaching out. It means the world to me! 🌍💖</p>
                <p>I just wanted to let you know that your message flew straight into my inbox safely. Between school, homework, and drawing in my sketchbook, it might take me a little bit of time to reply, but I'll get back to you as soon as I can! ⏳🎨</p>
                <p>Keep shining and creating beautiful things!</p>
                <div class="signoff">
                  Lots of love,<br/>
                  Sukar 🇪🇬🖌️
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
};
