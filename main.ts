import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";

// Cookie helper
function getCookieValue(cookie: string | null, key: string): string | null {
  if (!cookie) return null;
  const cookies = cookie.split(";").map((c) => c.trim().split("="));
  const found = cookies.find(([k]) => k === key);
  return found ? decodeURIComponent(found[1]) : null;
}

// File load
async function loadAccounts() {
  const data = await Deno.readTextFile("./accounts.json");
  return JSON.parse(data);
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // ✅ API endpoint
  if (url.pathname === "/api") {
    const today = new Date().toISOString().split("T")[0];
    const cookie = req.headers.get("cookie");
    const generated = getCookieValue(cookie, "generated_today");

    if (generated === today) {
      return new Response(
        JSON.stringify({ error: "You already generated today! Try again tomorrow." }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const accountsByDate = await loadAccounts();
    const accounts = accountsByDate[today];

    if (!accounts || accounts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No accounts available for today." }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const randomAcc = accounts[Math.floor(Math.random() * accounts.length)];

    const headers = new Headers({
      "Content-Type": "application/json",
      "Set-Cookie": `generated_today=${today}; Path=/; Max-Age=86400`,
    });

    return new Response(JSON.stringify(randomAcc), { headers });
  }

  // Serve index.html
  if (url.pathname === "/") {
    return await serveFile(req, "./index.html");
  }

  return new Response("Not Found", { status: 404 });
});
