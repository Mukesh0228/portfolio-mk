import { createFileRoute } from "@tanstack/react-router";
// Vite inlines the file as a string at build time — works in the Worker runtime.
import html from "../../public/portfolio.html?raw";

// Serves the standalone HTML/CSS/JS portfolio at "/" so the requested
// 3-file structure (index/portfolio.html, style.css, script.js) is preserved.
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
