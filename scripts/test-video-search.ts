import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const queries = [
    "children cooking baking in a kitchen",
    "aerial drone shot of city skyline",
    "person walking through a forest trail",
    "close-up of food being prepared on a cutting board",
    "industrial warehouse factory workers",
  ];

  for (const q of queries) {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "text-embedding-3-small", input: q }),
    });
    const emb = (await res.json()).data[0].embedding;

    const { data, error } = await sb.rpc("match_video_index", {
      query_embedding: JSON.stringify(emb),
      match_count: 3,
    });

    console.log(`\n🔍 "${q}"`);
    if (error) { console.error("  ERROR:", error.message); continue; }
    if (!data || data.length === 0) { console.log("  No results above 40% threshold"); continue; }
    for (const r of data) {
      const pct = Math.round(r.similarity * 100);
      const file = r.s3_key.split("/").pop()?.slice(0, 25);
      const caption = r.caption_text?.slice(0, 100);
      console.log(`  ${pct}% | ${file} | ${caption}...`);
    }
  }
}

main().catch(console.error);
