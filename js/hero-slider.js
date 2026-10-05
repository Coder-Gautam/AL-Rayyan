/**
 * Al Rayyan - Modern Expanding Hero Slider
 * Exact Figma Flow:
 * - Slide 1 active -> Banners 2 & 3 wait on right
 * - Slide 2 active -> Only Banner 3 waits on right
 * - Slide 3 active -> Banners 1 & 2 wait on right
 * - Auto-slide enabled (pauses on hover, resets on click)
 * - Cinematic expanding animation ("chote se badi hoti hui")
 */
(function () {
  "use strict";

  var slides = [
    {
      id: 1,
      num: "01",
      label: "BANNER 01",
      image: "assets/images/home/homepage_banner_img_1.png",
      title: "YOUR TRUSTED<br>PARTNER FOR OIL & GAS",
      subtitle: "EQUIPMENT IN UAE & MENA",
      desc: "Al Rayyan Energy & Industrial Solutions LLC supplies critical engineering materials to the oil & gas, energy, and industrial sectors.",
      btnText: "EXPLORE OUR SERVICES",
      btnLink: "#services"
    },
    {
      id: 2,
      num: "02",
      label: "BANNER 02",
      image: "assets/images/home/homepage_banner_img_2.png",
      title: "CRITICAL PIPING &<br>SPECIALTY SOLUTIONS",
      subtitle: "ENGINEERED FOR EXTREME ENVIRONMENTS",
      desc: "Abu Dhabi based partner supplying high-integrity seamless pipes, valves, and bulk materials for EPC contractors across UAE and MENA.",
      btnText: "VIEW PRODUCT RANGE",
      btnLink: "#products"
    },
    {
      id: 3,
      num: "03",
      label: "BANNER 03",
      image: "assets/images/home/homepage_banner_img_3.png",
      title: "SUSTAINABLE INFRASTRUCTURE<br>& PRECISION SUPPLY",
      subtitle: "FAST-TRACK REGIONAL PROCUREMENT",
      desc: "Comprehensive procurement and delivery partner for mega industrial facilities, structural steel, and critical packages.",
      btnText: "REQUEST A QUOTE",
      btnLink: "#contact"
    }
  ];

  var currentIndex = 0;
  var isAnimating = false;
  var autoSlideTimer = null;
  var AUTO_INTERVAL = 5000; // 5 seconds per slide
  var isPaused = false;

  function initSlider() {
    var heroEl = document.getElementById("heroSlider");
    if (!heroEl) return;

    renderActiveSlide(currentIndex, false);
    renderPreviewStrips(currentIndex);

    // Event delegation for preview strips click
    heroEl.addEventListener("click", function (e) {
      var strip = e.target.closest(".hero-preview-strip");
      if (!strip || isAnimating) return;

      var targetIndex = parseInt(strip.getAttribute("data-slide-index"), 10);
      if (targetIndex !== currentIndex) {
        goToSlide(targetIndex, strip);
        resetAutoSlide();
      }
    });

    // Pause on hover, resume on mouse leave
    heroEl.addEventListener("mouseenter", function () {
      isPaused = true;
    });
    heroEl.addEventListener("mouseleave", function () {
      isPaused = false;
    });

    startAutoSlide();
  }

  /**
   * Exact waiting strips logic requested:
   * - Slide 1 active (index 0) -> [Slide 2, Slide 3]
   * - Slide 2 active (index 1) -> [Slide 3] (Only 3 waits!)
   * - Slide 3 active (index 2) -> [Slide 1, Slide 2]
   */
  function getWaitingSlides(activeIdx) {
    if (activeIdx === 0) {
      return [
        { slide: slides[1], index: 1 },
        { slide: slides[2], index: 2 }
      ];
    } else if (activeIdx === 1) {
      return [
        { slide: slides[2], index: 2 }
      ];
    } else {
      return [
        { slide: slides[0], index: 0 },
        { slide: slides[1], index: 1 }
      ];
    }
  }

  function renderActiveSlide(index, animate) {
    var s = slides[index];
    var activeContainer = document.getElementById("heroActiveSlide");
    if (!activeContainer) return;

    if (!animate) {
      activeContainer.innerHTML = buildSlideMarkup(s);
      return;
    }

    // Expanding animation: incoming layer expands from right strip into full view
    var incoming = document.createElement("div");
    incoming.className = "hero-slide-layer incoming-expanding";
    incoming.innerHTML = buildSlideMarkup(s);

    activeContainer.appendChild(incoming);

    requestAnimationFrame(function () {
      incoming.classList.add("expanded");
    });

    setTimeout(function () {
      activeContainer.innerHTML = buildSlideMarkup(s);
      isAnimating = false;
    }, 700);
  }

  function buildSlideMarkup(s) {
    return (
      '<div class="hero-bg-wrapper">' +
        '<img src="' + s.image + '" alt="' + s.subtitle + '" class="hero-bg-img">' +
        '<div class="hero-left-vignette"></div>' +
      '</div>' +
      '<div class="site-container hero-content-container">' +
        '<div class="hero-content-box">' +
          '<h1 class="major-heading">' + s.title + '</h1>' +
          '<h3 class="sub-heading">' + s.subtitle + '</h3>' +
          '<p class="body-text">' + s.desc + '</p>' +
          '<a href="' + s.btnLink + '" class="btn-navy-arrow">' +
            '<span>' + s.btnText + '</span>' +
            '<span class="btn-arrow-icon">' +
              '<img src="assets/images/global/arrow-icon.svg" alt="Arrow">' +
            '</span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderPreviewStrips(activeIdx) {
    var stripsContainer = document.getElementById("heroPreviewStrips");
    if (!stripsContainer) return;

    var waitingList = getWaitingSlides(activeIdx);
    var html = "";

    waitingList.forEach(function (item) {
      var s = item.slide;
      var idx = item.index;
      html +=
        '<div class="hero-preview-strip" data-slide-index="' + idx + '" title="Click to view ' + s.label + '">' +
          '<div class="strip-bg" style="background-image: url(' + s.image + ')"></div>' +
          '<div class="strip-gradient-overlay"></div>' +
          '<div class="strip-label-wrapper">' +
            '<span class="strip-vertical-label">' + s.label + '</span>' +
          '</div>' +
        '</div>';
    });

    stripsContainer.innerHTML = html;
  }

  function goToSlide(targetIndex, clickedStripEl) {
    if (isAnimating) return;
    isAnimating = true;

    if (clickedStripEl) {
      clickedStripEl.classList.add("expanding-out");
    }

    renderActiveSlide(targetIndex, true);
    currentIndex = targetIndex;
    renderPreviewStrips(targetIndex);
  }

  function nextSlide() {
    if (isPaused || isAnimating) return;
    var next = (currentIndex + 1) % slides.length;
    goToSlide(next);
  }

  function startAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, AUTO_INTERVAL);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, AUTO_INTERVAL);
  }

  document.addEventListener("DOMContentLoaded", initSlider);
})();
