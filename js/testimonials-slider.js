/**
 * Al Rayyan - What Client Say About Us Testimonials Slider
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", initTestimonialsSlider);

  function initTestimonialsSlider() {
    var slider = document.querySelector("#testiSlider");
    var track = document.querySelector("#testiTrack");
    var prevBtn = document.querySelector("#testiPrevBtn");
    var nextBtn = document.querySelector("#testiNextBtn");

    if (!slider || !track || !prevBtn || !nextBtn) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll(".testimonials-slide"));
    var totalSlides = slides.length;
    var currentIndex = 0;
    var isTransitioning = false;

    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";

      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", String(i !== currentIndex));
      });

      prevBtn.setAttribute("aria-label", "Go to testimonial slide " + (currentIndex === 0 ? totalSlides : currentIndex));
      nextBtn.setAttribute("aria-label", "Go to testimonial slide " + (currentIndex + 2 > totalSlides ? 1 : currentIndex + 2));

      setTimeout(function () {
        isTransitioning = false;
      }, 500);
    }

    prevBtn.addEventListener("click", function () {
      goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener("click", function () {
      goToSlide(currentIndex + 1);
    });

    // Touch Swipe
    var touchStartX = 0;
    var touchEndX = 0;

    slider.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });

    goToSlide(0);
  }
})();
