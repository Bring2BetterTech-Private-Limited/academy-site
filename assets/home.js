// Home page. Everything shows immediately; the batch list is added when the Academy server answers.
(function () {
  document.querySelectorAll("[data-portal]").forEach(function (a) { a.href = ACADEMY.portal + "/accounts/login/"; });

  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy"), label = b.textContent;
      function done(msg) { b.textContent = msg; setTimeout(function () { b.textContent = label; }, 2000); }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { done(text); });
      else done(text);
    });
  });

  // Open batches, read live (the server may take up to a minute to wake; the page does not wait for it).
  var box = document.getElementById("batches"), list = document.getElementById("batch-list");
  function fmt(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, 75000);
  fetch(ACADEMY.api + "/api/public/apply/", { signal: ctrl.signal, credentials: "omit" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      data.batches.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b.name + (new Date(b.starts + "T00:00:00") < today ? " · started " : " · starts ") + fmt(b.starts);
        list.appendChild(li);
      });
      box.hidden = !data.batches.length;
    })
    .catch(function () { /* the page is complete without the batch list */ })
    .finally(function () { clearTimeout(timer); });
})();
