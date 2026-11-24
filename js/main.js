(function () {
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  var follow = document.querySelector(".follow-wrap");
  var followBtn = document.querySelector(".follow-btn");
  if (followBtn && follow) {
    followBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      follow.classList.toggle("open");
      followBtn.setAttribute("aria-expanded", follow.classList.contains("open") ? "true" : "false");
    });
    document.addEventListener("click", function () {
      follow.classList.remove("open");
      followBtn.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      if (!text || !navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        var prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = prev; }, 1600);
      }).catch(function () {});
    });
  });
})();
