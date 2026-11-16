// Where the Academy server (Render) is. These public pages are static (GitHub Pages); sign-in, the portals and
// everything that stores data run there. Decision 2026-11-16: landing at academy-preview (Pages), portal at
// portal-preview (Render). At launch: academy.bring2bettertech.com and portal.bring2bettertech.com.
(function () {
  var local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  var server = local ? "http://127.0.0.1:8000" : "https://portal-preview.bring2bettertech.com";
  window.ACADEMY = { api: server, portal: server };
})();
