// Where the Academy server (Render) is. The public pages are static; everything that stores data goes there.
// Preview: the FAKE-data preview. At launch this becomes the real portal address (docs/decisions.md 2026-11-16).
(function () {
  var local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  window.ACADEMY = {
    api: local ? "http://127.0.0.1:8000" : "https://academy-preview.bring2bettertech.com",
    portal: local ? "http://127.0.0.1:8000" : "https://academy-preview.bring2bettertech.com",
  };
})();
