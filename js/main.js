/* ==========================================================
   main.js — shared motion + UI. Requires (defer, in this order):
   gsap 3.15.0, ScrollTrigger, SplitText, lenis 1.3.27, then this file.
   Everything degrades: no JS / no CDN / reduced motion = static, visible page.
   Hooks (HTML attributes):
     data-split        headline lines rise from a mask (use on 1–2 headings max)
     data-split="load" same, on page load (hero)
     data-reveal       fade/rise when scrolled into view (sections, not paragraphs)
     data-parallax="12" image drifts by N yPercent while its parent scrolls past
     data-magnetic     pulls toward the pointer (primary CTA only)
     data-hide-sticky  hides .cta-sticky while this element is on screen (put on hero)
   ========================================================== */
(() => {
  const root = document.documentElement;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  // Safety net: if the animation libs failed to load, show everything.
  if (!hasGSAP) root.classList.remove("js");

  /* ---------- UI that works without GSAP ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  let lenis = null;
  const setNav = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) nav.querySelector("a")?.focus();
  };
  toggle?.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });

  // Sticky mobile CTA hides while the booking section (its href) or any [data-hide-sticky] is on screen
  const sticky = document.querySelector(".cta-sticky");
  if (sticky && "IntersectionObserver" in window) {
    const watched = [document.querySelector(sticky.getAttribute("href")), ...document.querySelectorAll("[data-hide-sticky]")].filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      sticky.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.15 });
    watched.forEach((el) => io.observe(el));
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  if (!hasGSAP) return;

  /* ---------- Motion ---------- */
  gsap.registerPlugin(ScrollTrigger);
  const hasSplit = typeof window.SplitText !== "undefined";
  if (hasSplit) gsap.registerPlugin(SplitText);

  // Smooth scroll (respects prefers-reduced-motion by default)
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ anchors: { offset: -80 } });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
  }

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // 1. Headline line reveal
    document.querySelectorAll("[data-split]").forEach((el) => {
      const onLoad = el.dataset.split === "load";
      if (!hasSplit) { el.style.visibility = "visible"; return; }
      SplitText.create(el, {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit(self) {
          el.style.visibility = "visible";
          return gsap.from(self.lines, {
            yPercent: 110, duration: 1.15, ease: "expo.out", stagger: 0.09,
            delay: onLoad ? 0.15 : 0,
            scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 85%", once: true }
          });
        }
      });
    });

    // 2. Section reveal in batches
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%", once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true })
    });

    // 3. Parallax
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.dataset.parallax) || 10;
      gsap.fromTo(el, { yPercent: -amount / 2 }, {
        yPercent: amount / 2, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  });

  // 4. Magnetic CTA — fine pointers only
  mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const off = [];
    document.querySelectorAll("[data-magnetic]").forEach((wrap) => {
      const inner = wrap.firstElementChild || wrap;
      const xTo = gsap.quickTo(inner, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(inner, "y", { duration: 0.45, ease: "power3" });
      const move = (e) => {
        const r = wrap.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const leave = () => { xTo(0); yTo(0); };
      wrap.addEventListener("pointermove", move);
      wrap.addEventListener("pointerleave", leave);
      off.push(() => { wrap.removeEventListener("pointermove", move); wrap.removeEventListener("pointerleave", leave); });
    });
    return () => off.forEach((fn) => fn());
  });

  // Expose for page-specific scripts (js/site.js)
  window.site = { mm, lenis };
})();
