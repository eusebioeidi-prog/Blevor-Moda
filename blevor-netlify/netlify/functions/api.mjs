import { getStore } from "@netlify/blobs";

const PASSWORD = process.env.ADMIN_PASSWORD || "505020@";
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const store = getStore({ name: "blevor", consistency: "strong" });
  const url = new URL(req.url);

  if (req.method === "GET") {
    const id = url.searchParams.get("img");
    if (id) {
      if (!/^[a-z0-9]+$/i.test(id)) return new Response("", { status: 400 });
      const entry = await store.getWithMetadata("img-" + id, { type: "arrayBuffer" });
      if (!entry) return new Response("", { status: 404 });
      return new Response(entry.data, {
        headers: {
          "content-type": (entry.metadata && entry.metadata.type) || "image/jpeg",
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
    return json((await store.get("state", { type: "json" })) || null);
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "pedido inválido" }, 400); }
    if (body.pw !== PASSWORD) return json({ error: "não autorizado" }, 401);
    if (body.check) return json({ ok: true });

    const st = body.state;
    if (!st || !Array.isArray(st.prods) || !Array.isArray(st.cats)) {
      return json({ error: "dados inválidos" }, 400);
    }
    const prods = [];
    for (const p of st.prods) {
      const item = { ...p };
      const m = typeof item.img === "string" && item.img.match(/^data:(image\/(?:jpeg|png));base64,(.+)$/);
      if (m) {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const buf = Buffer.from(m[2], "base64");
        await store.set("img-" + id, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), {
          metadata: { type: m[1] },
        });
        item.img = "/api?img=" + id;
      }
      prods.push(item);
    }
    const state = { cats: st.cats, prods, wa: String(st.wa || "").replace(/\D/g, "") };
    await store.setJSON("state", state);

    // apaga imagens que já não são usadas
    const used = new Set(prods.map((p) => (p.img || "").split("img=")[1]).filter(Boolean));
    const { blobs } = await store.list({ prefix: "img-" });
    for (const b of blobs) {
      if (!used.has(b.key.slice(4))) await store.delete(b.key);
    }
    return json(state);
  }

  return new Response("", { status: 405 });
};

export const config = { path: "/api" };
