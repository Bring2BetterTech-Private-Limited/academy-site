// Apply page. Loads the choices and a form token from the Academy, sends the application there, and shows
// field errors the server returns. The server checks everything again; nothing here is trusted.
// If the Academy cannot be reached, the page points to the same form on the Academy itself (the fallback).
(function () {
  var API = ACADEMY.api + "/api/public/apply/";
  var form = document.getElementById("apply");
  var status = document.getElementById("status");
  var problem = document.getElementById("problem");
  var send = document.getElementById("send");
  var fallback = ACADEMY.portal + "/apply/";
  var maxBytes = 2 * 1024 * 1024;

  document.querySelectorAll("[data-portal]").forEach(function (a) { a.href = ACADEMY.portal + "/accounts/login/"; });

  function el(tag, text, cls) { var e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; }
  function option(value, label) { var o = document.createElement("option"); o.value = value; o.textContent = label; return o; }
  function say(text) { status.replaceChildren(text ? el("p", text, "muted") : ""); }

  function showProblem(message, withFallback) {
    problem.replaceChildren(el("span", message + " "));
    if (withFallback) {
      var a = el("a", "Apply on the Academy site instead");
      a.href = fallback;
      problem.appendChild(a);
    }
    problem.hidden = false;
    problem.focus();
  }

  function request(url, options, ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, ms);
    options = Object.assign({ signal: ctrl.signal, credentials: "omit" }, options || {});
    return fetch(url, options).finally(function () { clearTimeout(t); });
  }

  // 1. Load choices, consent text and the form token.
  var slow = setTimeout(function () { say("Connecting to the Academy. The first visit can take up to a minute…"); }, 3000);
  request(API, {}, 75000)
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (data) {
      clearTimeout(slow); say("");
      fallback = data.fallback_url || fallback;
      maxBytes = data.max_file_bytes || maxBytes;
      document.getElementById("f-opened").value = data.token;
      document.getElementById("consent-text").textContent = data.consent_text;

      var course = document.getElementById("f-course");
      course.replaceChildren(option("", "Choose a course"));
      data.courses.forEach(function (c) { course.appendChild(option(c.id, c.title)); });
      var wanted = new URLSearchParams(location.search).get("course");
      if (wanted) course.value = wanted;

      var batch = document.getElementById("f-preferred_batch");
      function fillBatches() {
        batch.replaceChildren(option("", "No preference"));
        data.batches.filter(function (b) { return String(b.course) === course.value; })
          .forEach(function (b) { batch.appendChild(option(b.id, b.name)); });
      }
      course.addEventListener("change", fillBatches);
      fillBatches();

      var work = document.getElementById("f-work_status");
      work.replaceChildren(option("", "Choose"));
      data.work_statuses.forEach(function (w) { work.appendChild(option(w.value, w.label)); });

      form.hidden = false;
    })
    .catch(function () {
      clearTimeout(slow); say("");
      showProblem("The application form could not be loaded right now.", true);
    });

  // 2. Field errors next to each field.
  function clearErrors() {
    problem.hidden = true;
    form.querySelectorAll(".field-error").forEach(function (e) { e.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (e) { e.removeAttribute("aria-invalid"); e.removeAttribute("aria-describedby"); });
  }
  function fieldError(name, messages) {
    var input = form.elements[name];
    if (!input || input.type === "hidden") return false;
    var p = el("p", messages.join(" "), "field-error");
    p.id = "err-" + name;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", p.id);
    (input.type === "checkbox" ? input.closest("label") : input).insertAdjacentElement("afterend", p);
    return true;
  }
  function showErrors(errors) {
    var general = (errors.__all__ || []).slice();
    Object.keys(errors).forEach(function (name) {
      if (name !== "__all__" && !fieldError(name, errors[name])) general = general.concat(errors[name]);
    });
    showProblem(general.length ? general.join(" ") : "Please fix the highlighted answers.", false);
    var first = form.querySelector("[aria-invalid=true]");
    if (first && !general.length) first.focus();
  }

  // 3. Send.
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    var local = {};
    [["id_proof", "f-id_proof"], ["photo", "f-photo"]].forEach(function (pair) {
      var f = document.getElementById(pair[1]).files[0];
      if (f && f.size > maxBytes) local[pair[0]] = ["The file is larger than 2 MB."];
    });
    if (Object.keys(local).length) { showErrors(local); return; }

    send.disabled = true;
    say("Sending your application…");
    request(API, { method: "POST", body: new FormData(form) }, 90000)
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { status: r.status, body: b }; }); })
      .then(function (res) {
        say("");
        if (res.status === 201 && res.body.ok) {
          document.getElementById("form-view").hidden = true;
          var done = document.getElementById("done-view");
          done.hidden = false;
          done.focus();
          window.scrollTo(0, 0);
          return;
        }
        if (res.body && res.body.errors) { showErrors(res.body.errors); return; }
        showProblem("The application could not be sent (error " + res.status + ").", true);
      })
      .catch(function () {
        say("");
        showProblem("The Academy could not be reached, so your application was not sent.", true);
      })
      .finally(function () { send.disabled = false; });
  });
})();
