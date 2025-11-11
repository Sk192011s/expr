// main.ts for Deno Deploy
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";

function randChars(len: number, chars: string) {
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function genEmail() {
  const name = randChars(8, "abcdefghijklmnopqrstuvwxyz0123456789");
  return `${name}@vpnwayz.top`;
}

function genPassword() {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  // mix some letters + special
  return randChars(6, letters) + randChars(2, special);
}

function genCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return randChars(25, chars);
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/api") {
    const text = url.searchParams.get("text") ?? "";

    // days left random between 7 and 30
    const daysLeft = Math.floor(Math.random() * 24) + 7;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + daysLeft);

    const payload = {
      email: genEmail(),
      password: genPassword(),
      code: genCode(),
      daysLeft,
      expiryDate: formatDate(expiry),
      note: `generated_from:${text}`
    };

    return new Response(JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // serve index.html
  if (url.pathname === "/") {
    return await serveFile(req, "./index.html");
  }

  return new Response("Not Found", { status: 404 });
});
