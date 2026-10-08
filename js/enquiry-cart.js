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
    // 1. Update Floating Pill & Badge
    var badges = document.querySelectorAll(".enquiry-count-badge");
    badges.forEach(function (b) {
      b.textContent = basket.length;
    });

    var floatBtn = document.getElementById("floatingEnquiryBtn");
    if (floatBtn) {
      floatBtn.classList.toggle("visible", basket.length > 0);
    }

    // 2. Update Product Card Buttons (Main + Related)
    var addButtons = document.querySelectorAll("[data-enquiry-id]");
    addButtons.forEach(function (btn) {
      var id = btn.getAttribute("data-enquiry-id");
      var added = hasItem(id);
      btn.classList.toggle("added", added);
      btn.setAttribute("aria-pressed", String(added));
      
      var isUpper = btn.classList.contains("btn-related-enquiry");
      if (added) {
        btn.textContent = "Added";
      } else {
        btn.textContent = isUpper ? "ADD TO ENQUIRY" : "Add to enquiry";
      }
    });

    // 3. Update Drawer Item List
    var listEl = document.getElementById("enquiryDrawerList");
    if (listEl) {
      if (basket.length === 0) {
        listEl.innerHTML = '<li class="empty-state">No products added to enquiry yet.<br>Browse our catalog to select items.</li>';
      } else {
        listEl.innerHTML = basket.map(function (item) {
          return '<li class="enquiry-item">' +
            '<div class="enquiry-item-info">' +
              '<span class="enquiry-item-name">' + escapeHtml(item.name) + '</span>' +
            '</div>' +
            '<div class="enquiry-item-actions">' +
              '<input type="number" min="1" value="' + (item.qty || 1) + '" class="enquiry-qty-input" data-qty-id="' + escapeHtml(item.id) + '" aria-label="Quantity">' +
              '<button type="button" class="enquiry-remove-btn" data-remove-id="' + escapeHtml(item.id) + '" title="Remove item" aria-label="Remove item">×</button>' +
            '</div>' +
          '</li>';
        }).join("");
      }
    }

    // 4. Update Contact Page Items List (#fitems)
    var fitems = document.getElementById("fitems");
    if (fitems) {
      if (basket.length === 0) {
        fitems.innerHTML = '<span class="fitems-empty">No products in enquiry list.</span>';
      } else {
        fitems.innerHTML = '<ul class="fitems-list">' +
          basket.map(function (b) {
            return '<li><span class="fitems-dot">•</span> ' + escapeHtml(b.name) + ' &times; ' + (b.qty || 1) + '</li>';
          }).join("") +
          '</ul>';
      }
    }

    var hiddenInput = document.getElementById("selectedProductsData");
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
        var name = addBtn.getAttribute("data-enquiry-name") || addBtn.getAttribute("data-product") || id;
        var cat = addBtn.getAttribute("data-enquiry-cat") || "";
        if (hasItem(id)) {
          removeItem(id);
        } else {
          addItem({ id: id, name: name, category: cat, qty: 1 });
        }
        return;
      }

      // Drawer open trigger (Floating button or any open-enquiry-btn)
      if (e.target.closest(".open-enquiry-btn") || e.target.closest("#floatingEnquiryBtn")) {
        toggleDrawer(true);
        return;
      }

      // Drawer close trigger (Close 'x' or Scrim overlay)
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
        // Navigate to contact.html
        window.location.href = "contact.html";
      }
    });

    // Close drawer on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        toggleDrawer(false);
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
