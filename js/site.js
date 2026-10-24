/* site.js — Kiln & Lough signature: the contrast round.
   Without motion (no JS / reduced motion) the three phases are simply stacked blocks. */
(() => {
  if (!window.site || !window.gsap) return;
  const round = document.querySelector(".round");
  if (!round) return;

  const stage = round.querySelector(".round__stage");
  const phases = [...round.querySelectorAll(".phase")];
  const nums = phases.map((p) => p.querySelector(".num"));
  const original = nums.map((n) => n.textContent);
  const bars = [...round.querySelectorAll(".round__progress i")];
  const css = getComputedStyle(document.documentElement);
  const colors = ["--peat", "--glacier", "--spruce"].map((v) => css.getPropertyValue(v).trim());

  window.site.mm.add("(prefers-reduced-motion: no-preference)", () => {
    round.classList.add("is-pinned");
    gsap.set(phases.slice(1), { autoAlpha: 0, y: 60 });
    gsap.set(stage, { backgroundColor: colors[0], color: "#e4e8e3" });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: stage, start: "top top", end: "+=260%", pin: true, scrub: 0.6, anticipatePin: 1 }
    });

    const counter = (el, from, to) => {
      const o = { v: from };
      return gsap.to(o, { v: to, duration: 1, onUpdate: () => (el.textContent = Math.round(o.v)) });
    };

    // phase i -> i+1
    const step = (i) => {
      const label = "p" + i;
      tl.to(bars[i], { scaleX: 1, duration: 1.2 }, label)
        .add(counter(nums[i], +original[i], +original[i + 1]), label + "+=0.4")
        .to(stage, { backgroundColor: colors[i + 1], color: i + 1 === 1 ? "#14201c" : "#e4e8e3", duration: 1 }, label + "+=0.4")
        .to(phases[i], { autoAlpha: 0, y: -60, duration: 0.6, ease: "power2.in" }, label + "+=1.1")
        .to(phases[i + 1], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, label + "+=1.5");
    };
    step(0);
    step(1);
    tl.to(bars[2], { scaleX: 1, duration: 1.2 });

    return () => {
      round.classList.remove("is-pinned");
      nums.forEach((n, i) => (n.textContent = original[i]));
      gsap.set([...phases, stage, ...bars], { clearProps: "all" });
    };
  });
})();
