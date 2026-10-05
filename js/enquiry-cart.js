/**
 * Al Rayyan - Product Enquiry Tray & Cart System
 * Handles Add-to-Enquiry, Drawer Tray, LocalStorage, and Form Prefill
 */
(function () {
  "use strict";

  var STORAGE_KEY = "ar_enquiry_items";
  var basket = [];

  try {
    basket = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") || [];
  } catch (e) {
    basket = [];
  }

  function saveBasket() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    } catch (e) {}
    updateUI();
  }

  function getBasket() {
    return basket;
  }

  function addItem(item) {
    var existing = basket.find(function (b) { return b.id === item.id; });
    if (!existing) {
      basket.push({
        id: item.id,
        name: item.name,
        category: item.category || "",
        image: item.image || "",
        qty: item.qty || 1
      });
    }
    saveBasket();
    showToast(item.name + " added to enquiry");
  }

  function removeItem(id) {
    basket = basket.filter(function (b) { return b.id !== id; });
    saveBasket();
  }

  function updateQty(id, qty) {
    var item = basket.find(function (b) { return b.id === id; });
    if (item) {
      item.qty = Math.max(1, parseInt(qty, 10) || 1);
      saveBasket();
    }
  }

  function hasItem(id) {
    return basket.some(function (b) { return b.id === id; });
  }

  function toggleDrawer(open) {
    var drawer = document.getElementById("enquiryDrawer");
    var scrim = document.getElementById("scrimOverlay");
    if (!drawer) return;

    var isOpen = open !== undefined ? open : !drawer.classList.contains("open");
    drawer.classList.toggle("open", isOpen);
    if (scrim) scrim.classList.toggle("open", isOpen);
    drawer.setAttribute("aria-hidden", String(!isOpen));
  }

  function showToast(msg) {
    var toast = document.getElementById("toastNotification");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function updateUI() {
    // 1. Update Floating Badge
    var badges = document.querySelectorAll(".enquiry-count-badge");
    badges.forEach(function (b) {
      b.textContent = basket.length;
    });

    var floatBtn = document.getElementById("floatingEnquiryBtn");
    if (floatBtn) {
      floatBtn.classList.toggle("visible", basket.length > 0);
    }

    // 2. Update Product Card Buttons
    var addButtons = document.querySelectorAll("[data-enquiry-id]");
    addButtons.forEach(function (btn) {
      var id = btn.getAttribute("data-enquiry-id");
      var added = hasItem(id);
      btn.classList.toggle("added", added);
      btn.textContent = added ? "Added" : "Add to enquiry";
      btn.setAttribute("aria-pressed", String(added));
    });

    // 3. Update Drawer Item List
    var listEl = document.getElementById("enquiryDrawerList");
    if (listEl) {
      if (basket.length === 0) {
        listEl.innerHTML = '<li class="empty-state">No products added yet. Browse our catalog to request a quote.</li>';
      } else {
        listEl.innerHTML = basket.map(function (item, index) {
          return '<li class="enquiry-item">' +
            '<div class="enquiry-item-info">' +
              '<span class="enquiry-item-name">' + escapeHtml(item.name) + '</span>' +
              (item.category ? '<span class="enquiry-item-cat">' + escapeHtml(item.category) + '</span>' : '') +
            '</div>' +
            '<div class="enquiry-item-actions">' +
              '<input type="number" min="1" value="' + (item.qty || 1) + '" class="enquiry-qty-input" data-qty-id="' + item.id + '">' +
              '<button type="button" class="enquiry-remove-btn" data-remove-id="' + item.id + '" title="Remove item">×</button>' +
            '</div>' +
          '</li>';
        }).join("");
      }
    }

    // 4. Update Form Prefill (if on contact page or quote form is visible)
    var quoteItemsContainer = document.getElementById("quoteSelectedItems");
    var hiddenInput = document.getElementById("selectedProductsData");
    if (quoteItemsContainer) {
      if (basket.length === 0) {
        quoteItemsContainer.innerHTML = '<p class="text-muted">No items selected.</p>';
      } else {
        quoteItemsContainer.innerHTML = '<ul>' + basket.map(function (it) {
          return '<li><strong>' + escapeHtml(it.name) + '</strong> (' + it.qty + ' units)</li>';
        }).join("") + '</ul>';
      }
    }
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(basket);
    }
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  // Event Listeners for Delegation
  document.addEventListener("DOMContentLoaded", function () {
    updateUI();

    // Add / Remove from product card
    document.addEventListener("click", function (e) {
      var addBtn = e.target.closest("[data-enquiry-id]");
      if (addBtn) {
        var id = addBtn.getAttribute("data-enquiry-id");
        var name = addBtn.getAttribute("data-enquiry-name") || id;
        var cat = addBtn.getAttribute("data-enquiry-cat") || "";
        if (hasItem(id)) {
          removeItem(id);
        } else {
          addItem({ id: id, name: name, category: cat, qty: 1 });
        }
        return;
      }

      // Drawer trigger
      if (e.target.closest(".open-enquiry-btn") || e.target.closest("#floatingEnquiryBtn")) {
        toggleDrawer(true);
        return;
      }

      // Drawer close
      if (e.target.closest(".close-enquiry-btn") || e.target.closest("#scrimOverlay")) {
        toggleDrawer(false);
        return;
      }

      // Remove from drawer
      var removeBtn = e.target.closest("[data-remove-id]");
      if (removeBtn) {
        var remId = removeBtn.getAttribute("data-remove-id");
        removeItem(remId);
        return;
      }

      // Continue to send enquiry CTA button
      var continueBtn = e.target.closest("#continueEnquiryBtn");
      if (continueBtn) {
        toggleDrawer(false);
        var quoteSection = document.getElementById("requestQuoteSection") || document.getElementById("contact");
        if (quoteSection) {
          quoteSection.scrollIntoView({ behavior: "smooth" });
          var firstInput = quoteSection.querySelector("input:not([type=hidden]), textarea");
          if (firstInput) setTimeout(function () { firstInput.focus(); }, 400);
        } else {
          // If multi-page
          window.location.href = "contact.html#quote";
        }
      }
    });

    // Quantity change inside drawer
    document.addEventListener("input", function (e) {
      var qtyInput = e.target.closest("[data-qty-id]");
      if (qtyInput) {
        var id = qtyInput.getAttribute("data-qty-id");
        updateQty(id, qtyInput.value);
      }
    });
  });

  // Global API
  window.EnquiryCart = {
    getBasket: getBasket,
    addItem: addItem,
    removeItem: removeItem,
    updateQty: updateQty,
    hasItem: hasItem,
    toggleDrawer: toggleDrawer,
    updateUI: updateUI
  };
})();
