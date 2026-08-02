import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';

export const prerender = false;

const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-20',
  useCdn: false, // Ensure we get the freshest data, bypassing CDN cache
});

export const GET: APIRoute = async () => {
  try {
    const results = await sanityClient.fetch(`*[_type == "artwork"] { _id, "likes": coalesce(likes, 0) }`);
    const likesMap: Record<string, number> = {};
    
    results.forEach((doc: any) => {
      likesMap[doc._id] = doc.likes;
    });

    return new Response(JSON.stringify(likesMap), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch likes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), { status: 500 });
  }
};
