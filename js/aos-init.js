/**
 * Al Rayyan - AOS (Animate on Scroll) Configuration
 * Smooth, elegant animations with strict zero-horizontal-overflow protection.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
      disable: function () {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
    });
  }
});
