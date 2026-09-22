/* Hayes Creative — nav, scroll reveal, lightbox. No dependencies. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__links a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var ioFired = false;
    try {
      var io = new IntersectionObserver(function (entries) {
        ioFired = true;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealEls.forEach(function (el) { io.observe(el); });
    } catch (err) {
      revealAll();
    }
    // Safety nets: never leave content hidden when printing or if the observer stalls
    window.addEventListener("beforeprint", revealAll);
    setTimeout(function () {
      if (!ioFired) revealAll();
    }, 2000);
  }

  /* ---------- Lightbox ----------
     Markup: <button data-lightbox="group" data-full="img.jpg" data-caption="...">
     Buttons sharing a group are navigable with ←/→. */
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (!triggers.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Image viewer");
  box.innerHTML =
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Close (Esc)">&times;</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous image">&larr;</button>' +
    '<figure class="lightbox__figure">' +
    '<img class="lightbox__img" alt="">' +
    '<figcaption class="lightbox__caption"></figcaption>' +
    '<div class="lightbox__count" aria-live="polite"></div>' +
    "</figure>" +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Next image">&rarr;</button>';
  document.body.appendChild(box);

  var img = box.querySelector(".lightbox__img");
  var cap = box.querySelector(".lightbox__caption");
  var count = box.querySelector(".lightbox__count");
  var btnClose = box.querySelector(".lightbox__close");
  var btnPrev = box.querySelector(".lightbox__prev");
  var btnNext = box.querySelector(".lightbox__next");

  var group = [];
  var index = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var t = group[index];
    var thumb = t.querySelector("img");
    img.src = t.getAttribute("data-full") || (thumb && thumb.src) || "";
    img.alt = (thumb && thumb.alt) || "";
    cap.textContent = t.getAttribute("data-caption") || "";
    count.textContent = (index + 1) + " / " + group.length;
  }

  function open(trigger) {
    var name = trigger.getAttribute("data-lightbox");
    group = triggers.filter(function (t) { return t.getAttribute("data-lightbox") === name; });
    if (group.length < 2) box.setAttribute("data-single", "");
    else box.removeAttribute("data-single");
    lastFocus = trigger;
    show(group.indexOf(trigger));
    box.classList.add("is-open");
    document.body.classList.add("no-scroll");
    btnClose.focus();
  }

  function close() {
    box.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    img.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }

  triggers.forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      open(t);
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function () { show(index - 1); });
  btnNext.addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  // Touch swipe between images
  var touchX = null;
  box.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (touchX === null || group.length < 2) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (group.length > 1 && e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); return; }
    if (group.length > 1 && e.key === "ArrowRight") { e.preventDefault(); show(index + 1); return; }
    if (e.key === "Tab") {
      // Focus trap: cycle through visible buttons only
      var focusables = [btnClose, btnPrev, btnNext].filter(function (b) {
        return b.offsetParent !== null;
      });
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (focusables.indexOf(document.activeElement) === -1) { e.preventDefault(); first.focus(); }
    }
  });
})();
