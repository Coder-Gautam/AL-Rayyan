/**
 * Al Rayyan - Flanged Joint Interactive Scroll Animation
 * Mathematically controls SVG assembly of weld neck flanges, gasket, stud bolts, and hex nuts
 */
(function () {
  "use strict";

  var vh = window.innerHeight;
  var lastCap = -1;
  var ticking = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }
  function ease(x) { return 1 - Math.pow(1 - x, 3); }
  function lerp(a, b, x) { return a + (b - a) * x; }

  function getScrollProgress(el, startOffset) {
    if (!el) return 0;
    var r = el.getBoundingClientRect();
    var offset = startOffset || 0;
    var total = r.height - (vh - offset);
    if (total <= 0) return 1;
    var scrolled = offset - r.top;
    return clamp(scrolled / total);
  }

  function animateFlange(p) {
    var gL = $("#gL"), gR = $("#gR"), gG = $("#gG"), gB = $("#gB"), gN = $("#gN");
    if (!gL || !gR || !gG || !gB || !gN) return;

    var a = ease(seg(p, 0, 0.22));   // Phase 1: Flanges slide inward
    var b = ease(seg(p, 0.22, 0.42)); // Phase 2: Gasket drops down
    var c = ease(seg(p, 0.42, 0.62)); // Phase 3: Stud bolts slide in
    var d = ease(seg(p, 0.62, 0.80)); // Phase 4: Hex nuts rotate & tighten
    var f = seg(p, 0.80, 0.93);       // Phase 5: Fluid flow & pressure seal

    // 1. Left & Right Flanges
    var off = a < 1 ? lerp(320, 40, a) : lerp(40, 0, c);
    gL.setAttribute("transform", "translate(" + (-off) + " 0)");
    gR.setAttribute("transform", "translate(" + off + " 0)");
    gL.style.opacity = gR.style.opacity = Math.min(1, a * 2.5);

    // 2. Gasket
    gG.setAttribute("transform", "translate(0 " + lerp(-280, 0, b) + ")");
    gG.style.opacity = b > 0 ? 1 : 0;

    // 3. Stud Bolts
    gB.setAttribute("transform", "translate(" + lerp(620, 0, c) + " 0)");
    gB.style.opacity = c > 0 ? 1 : 0;

    // 4. Hex Nuts (staggered rotation & scale)
    $$(".nut", gN).forEach(function (nut, idx) {
      var k = clamp(d * 1.4 - idx * 0.12);
      nut.style.transform = "rotate(" + lerp(-240, 0, k) + "deg) scale(" + k + ")";
      nut.style.transformOrigin = "center";
    });

    // 5. Flow & Seal Indicator
    var flow = $("#flow"), seal = $("#seal");
    if (flow) flow.style.opacity = f;
    if (seal) seal.style.opacity = f;

    // 6. Labels & Indicators
    var lb1 = $("#lb1"), lb2 = $("#lb2"), lb3 = $("#lb3"), lb4 = $("#lb4");
    if (lb1) { lb1.style.opacity = seg(a, 0.85, 1); lb1.setAttribute("transform", "translate(" + (-off) + " 0)"); }
    if (lb2) lb2.style.opacity = seg(b, 0.85, 1);
    if (lb3) { lb3.style.opacity = seg(c, 0.85, 1); lb3.setAttribute("transform", "translate(" + lerp(620, 0, c) + " 0)"); }
    if (lb4) lb4.style.opacity = seg(d, 0.85, 1);
  }

  function onScroll() {
    ticking = false;
    var sceneEl = $("#scene") || $(".flange-scene");
    if (!sceneEl) return;

    var headerHeight = ($(".site-header") || $("#header") || {}).offsetHeight || 78;
    var progress = reduce ? 1 : getScrollProgress(sceneEl, headerHeight);
    animateFlange(progress);
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () {
    vh = window.innerHeight;
    requestTick();
  });

  // Initial trigger once DOM is ready
  document.addEventListener("DOMContentLoaded", requestTick);
  window.initFlangeAnimation = requestTick;
})();
