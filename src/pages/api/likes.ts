import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

// Instantiated per request to prevent top-level crashes

export const GET: APIRoute = async () => {
  try {
    const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
    
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
      useCdn: false, // Ensure we get the freshest data
    });

    const results = await sanityClient.fetch(`*[_type == "artwork"] { _id, "likes": coalesce(likes, 0) }`);
    const likesMap: Record<string, number> = {};
    
    results.forEach((doc: any) => {
      likesMap[doc._id] = doc.likes;
    });

    return new Response(JSON.stringify(likesMap), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Failed to fetch likes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), { status: 500 });
  }
};
