/**
 * Al Rayyan - FAQ Accordion Controller
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", initFaqAccordion);

  function initFaqAccordion() {
    var faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq-btn");
      if (!btn) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("active");

        // Close all items
        faqItems.forEach(function (other) {
          other.classList.remove("active");
          var otherBtn = other.querySelector(".faq-btn");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        });

        // Toggle clicked item (if was closed, open it)
        if (!isOpen) {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
})();
