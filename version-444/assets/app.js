(function () {
  function closestFilterArea(node) {
    while (node && node !== document) {
      if (node.hasAttribute && node.hasAttribute("data-filter-area")) {
        return node;
      }
      node = node.parentNode;
    }
    return document;
  }

  function applyFilters(area) {
    var input = area.querySelector("[data-search-input]");
    var region = area.querySelector("[data-region-filter]");
    var type = area.querySelector("[data-type-filter]");
    var query = input ? input.value.trim().toLowerCase() : "";
    var regionValue = region ? region.value : "";
    var typeValue = type ? type.value : "";
    var cards = area.querySelectorAll("[data-movie-card]");

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-type") || "",
        card.getAttribute("data-genre") || ""
      ].join(" ").toLowerCase();
      var okQuery = !query || text.indexOf(query) !== -1;
      var okRegion = !regionValue || card.getAttribute("data-region") === regionValue;
      var okType = !typeValue || card.getAttribute("data-type") === typeValue;
      card.classList.toggle("is-hidden", !(okQuery && okRegion && okType));
    });
  }

  document.querySelectorAll("[data-search-input], [data-region-filter], [data-type-filter]").forEach(function (control) {
    control.addEventListener("input", function () {
      applyFilters(closestFilterArea(control));
    });
    control.addEventListener("change", function () {
      applyFilters(closestFilterArea(control));
    });
  });

  var toggle = document.querySelector("[data-nav-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
    });
  });

  window.initMoviePlayer = function (source, videoId, overlayId) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var loaded = false;
    var hlsInstance = null;

    if (!video || !overlay || !source) {
      return;
    }

    function loadVideo() {
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
        loaded = true;
      }

      overlay.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    overlay.addEventListener("click", loadVideo);
    video.addEventListener("click", function () {
      if (!loaded) {
        loadVideo();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
