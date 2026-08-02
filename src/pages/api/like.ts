import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

// Instantiated per request to prevent top-level crashes

export const POST: APIRoute = async ({ request }) => {
  try {
    const { artworkId } = await request.json();

    if (!artworkId) {
      return new Response(JSON.stringify({ error: 'Missing artwork ID' }), { status: 400 });
    }

    const token = import.meta.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN;
    const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration: missing SANITY_API_TOKEN' }),
        { status: 500 }
      );
    }
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration: missing PUBLIC_SANITY_PROJECT_ID' }),
        { status: 500 }
      );
    }

    const sanityClient = createClient({
      projectId: projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-03-20',
      useCdn: false,
      token: token,
    });

    // Increment the 'likes' field by 1 for the specific document
    await sanityClient.patch(artworkId).inc({ likes: 1 }).commit();

    return new Response(JSON.stringify({ success: true, message: 'Like incremented' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to update likes:', error);
    return new Response(JSON.stringify({ error: 'Failed to update likes' }), { status: 500 });
  }
};
