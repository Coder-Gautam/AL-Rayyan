/**
 * Al Rayyan - Our Services Grid Slider
 * Controls the 2-slide 4-card showcase on the right while left container stays static.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", initServicesSlider);

  function initServicesSlider() {
    var slider = document.querySelector("#servicesSlider");
    var track = document.querySelector("#servicesTrack");
    var prevBtn = document.querySelector("#servicesPrevBtn");
    var nextBtn = document.querySelector("#servicesNextBtn");

    if (!slider || !track || !prevBtn || !nextBtn) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll(".services-slide"));
    var totalSlides = slides.length;
    var currentIndex = 0;
    var isTransitioning = false;

    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      // Handle wrapping
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      // Slide track horizontally
      track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";

      // Accessibility updates
      slides.forEach(function (slide, i) {
        var isActive = i === currentIndex;
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      // Update button aria states
      prevBtn.setAttribute("aria-label", "Go to slide " + (currentIndex === 0 ? totalSlides : currentIndex));
      nextBtn.setAttribute("aria-label", "Go to slide " + (currentIndex + 2 > totalSlides ? 1 : currentIndex + 2));

      setTimeout(function () {
        isTransitioning = false;
      }, 550);
    }

    // Button Clicks
    prevBtn.addEventListener("click", function () {
      goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener("click", function () {
      goToSlide(currentIndex + 1);
    });

    // Touch / Swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;

    slider.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(currentIndex + 1); // Swipe left -> Next
        } else {
          goToSlide(currentIndex - 1); // Swipe right -> Prev
        }
      }
    }, { passive: true });

    // Keyboard navigation
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        goToSlide(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        goToSlide(currentIndex + 1);
      }
    });

    // Initial state
    goToSlide(0);
  }
})();
