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

    // 7. Send Email via Resend
    if (import.meta.env.RESEND_API_KEY && import.meta.env.CONTACT_EMAIL) {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>', // Use a verified domain in production
        to: import.meta.env.CONTACT_EMAIL,
        subject: `New Commission Inquiry: ${subject}`,
        html: `
          <h3>New message from your portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
};
