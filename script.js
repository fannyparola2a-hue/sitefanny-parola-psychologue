// Année auto
document.getElementById("year").textContent = new Date().getFullYear();

// Respect "réduire les animations"
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el, to, duration = 900) {
  if (reduceMotion) { el.textContent = String(to); return; }

  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = String(Math.round(to * progress));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll(".count");
if (counters.length) {
  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      counters.forEach((c) => {
        if (seen.has(c)) return;
        seen.add(c);
        animateCount(c, Number(c.dataset.to || "0"), 900);
      });
      io.disconnect();
    }
  }, { threshold: 0.35 });

  io.observe(counters[0]);
}
// Dropdown "Consultations"
document.querySelectorAll(".dropdown").forEach((dd) => {
  const btn = dd.querySelector(".dropbtn");
  const menu = dd.querySelector(".dropmenu");
  if (!btn || !menu) return;

  function close() {
    dd.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dd.classList.contains("open");
    document.querySelectorAll(".dropdown.open").forEach((other) => {
      if (other !== dd) other.classList.remove("open");
    });
    if (isOpen) close();
    else {
      dd.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", () => close());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => close()));
});
// --- Fix ancres (Adultes / Ados / Enfants) avec header sticky ---
function scrollToHashWithOffset() {
  const id = window.location.hash.replace("#", "");
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector(".site-header");
  const offset = (header ? header.getBoundingClientRect().height : 0) + 16;

  const y = target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({ top: y, behavior: "smooth" });
}

// Au chargement (quand on arrive depuis une autre page avec #adultes)
window.addEventListener("load", () => {
  if (window.location.hash) {
    // petit délai pour éviter le décalage dû aux images / polices
    setTimeout(scrollToHashWithOffset, 50);
  }
});

// Si on change de hash sur place
window.addEventListener("hashchange", () => {
  scrollToHashWithOffset();
});
