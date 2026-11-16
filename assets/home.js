// Home page: course and batch list read live from the Academy (no course text is typed into this site).
(function () {
  document.querySelectorAll("[data-portal]").forEach(function (a) { a.href = ACADEMY.portal + "/accounts/login/"; });
  var box = document.getElementById("course-list");

  function el(tag, text, cls) { var e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; }
  function fmt(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  function fail() {
    box.replaceChildren(el("p", "Course details could not be loaded right now. You can still apply.", "muted"));
  }

  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, 75000);
  var slow = setTimeout(function () { box.replaceChildren(el("p", "Waking the Academy up, this can take up to a minute…", "muted")); }, 4000);
  fetch(ACADEMY.api + "/api/public/apply/", { signal: ctrl.signal, credentials: "omit" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      clearTimeout(slow);
      box.replaceChildren();
      if (!data.courses.length) { box.appendChild(el("p", "No courses are open for applications right now.", "muted")); return; }
      data.courses.forEach(function (c) {
        var card = el("div", "", "card");
        card.appendChild(el("h3", c.title));
        var batches = data.batches.filter(function (b) { return b.course === c.id; });
        if (batches.length) {
          var ul = el("ul", "", "batches");
          var today = new Date(); today.setHours(0, 0, 0, 0);
          batches.forEach(function (b) {
            var started = new Date(b.starts + "T00:00:00") < today;
            ul.appendChild(el("li", b.name + (started ? " · started " : " · starts ") + fmt(b.starts)));
          });
          card.appendChild(ul);
        } else {
          card.appendChild(el("p", "Next batch dates to be announced.", "muted"));
        }
        var a = el("a", "Apply for " + c.title, "button");
        a.href = "apply.html?course=" + encodeURIComponent(c.id);
        a.style.marginTop = ".75rem";
        card.appendChild(a);
        box.appendChild(card);
      });
    })
    .catch(function () { clearTimeout(slow); fail(); })
    .finally(function () { clearTimeout(timer); });
})();
