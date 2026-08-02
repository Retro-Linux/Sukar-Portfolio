import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { createClient } from "@sanity/client";
//#region src/pages/api/like.ts
var like_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request }) => {
	try {
		const { artworkId } = await request.json();
		if (!artworkId) return new Response(JSON.stringify({ error: "Missing artwork ID" }), { status: 400 });
		const token = process.env.SANITY_API_TOKEN;
		const projectId = "nntbmkz8";
		if (!token) return new Response(JSON.stringify({ error: "Server misconfiguration: missing SANITY_API_TOKEN" }), { status: 500 });
		await createClient({
			projectId,
			dataset: "production",
			apiVersion: "2024-03-20",
			useCdn: false,
			token
		}).patch(artworkId).inc({ likes: 1 }).commit();
		return new Response(JSON.stringify({
			success: true,
			message: "Like incremented"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Failed to update likes:", error);
		return new Response(JSON.stringify({ error: "Failed to update likes" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/like@_@ts
var page = () => like_exports;
//#endregion
export { page };
