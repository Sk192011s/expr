import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Serve API
  if (url.pathname === "/api") {
    const text = url.searchParams.get("text") || "";
    const exp = `EXP-${btoa(text).slice(0, 10)}-${Math.floor(Math.random() * 9999)}`;
    return new Response(JSON.stringify({ exp }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Serve index.html
  if (url.pathname === "/") {
    return await serveFile(req, "./index.html");
  }

  return new Response("Not Found", { status: 404 });
});
