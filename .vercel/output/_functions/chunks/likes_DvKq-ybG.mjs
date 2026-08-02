import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { createClient } from "@sanity/client";
//#region src/pages/api/likes.ts
var likes_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	try {
		const results = await createClient({
			projectId: "nntbmkz8",
			dataset: "production",
			apiVersion: "2024-03-20",
			useCdn: false
		}).fetch(`*[_type == "artwork"] { _id, "likes": coalesce(likes, 0) }`);
		const likesMap = {};
		results.forEach((doc) => {
			likesMap[doc._id] = doc.likes;
		});
		return new Response(JSON.stringify(likesMap), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Failed to fetch likes:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch likes" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/likes@_@ts
var page = () => likes_exports;
//#endregion
export { page };
