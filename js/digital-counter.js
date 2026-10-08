/**
 * Al Rayyan - Digital Clock Style Smooth Animated Counter
 * High-performance 60fps counter using requestAnimationFrame & easeOutExpo easing.
 * Supports single numbers with suffixes (e.g. 500+, 15+ Years) and dual split ratios (e.g. 24/7).
 */
(function () {
  "use strict";

  // Ease-out cubic curve: energetic clock ticker start, silky smooth deceleration
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function animateNumber(el, target, suffix, prefix, duration) {
    prefix = prefix || "";
    suffix = suffix || "";
    duration = duration || 1900;

    var startTime = null;

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);

      var current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(frame);
  }

  function animateDual(el, targetLeft, targetRight, sep, duration) {
    sep = sep || "/";
    duration = duration || 1900;

    var startTime = null;

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);

      var curLeft = Math.round(targetLeft * eased);
      var curRight = Math.round(targetRight * eased);
      el.textContent = curLeft + sep + curRight;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = targetLeft + sep + targetRight;
      }
    }

    requestAnimationFrame(frame);
  }

  function initDigitalCounters() {
    var statItems = document.querySelectorAll("[data-counter], [data-counter-dual]");
    if (!statItems.length) return;

    var animated = false;

    function triggerCounters() {
      if (animated) return;
      animated = true;

      statItems.forEach(function (el) {
        if (el.hasAttribute("data-counter-dual")) {
          var val = el.getAttribute("data-counter-dual") || "24/7";
          var parts = val.split("/");
          var left = parseInt(parts[0], 10) || 24;
          var right = parseInt(parts[1], 10) || 7;
          animateDual(el, left, right, "/", 2000);
        } else {
          var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var prefix = el.getAttribute("data-prefix") || "";
          animateNumber(el, target, suffix, prefix, 2000);
        }
      });
    }

    // Trigger via IntersectionObserver when entering viewport
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              triggerCounters();
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.25,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      // Observe the about section or the first stat item
      var targetSection = document.getElementById("about") || statItems[0];
      observer.observe(targetSection);
    } else {
      // Fallback
      triggerCounters();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDigitalCounters);
  } else {
    initDigitalCounters();
  }
})();
