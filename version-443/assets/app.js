document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-movie-scope]").forEach(function (scope) {
    var search = scope.querySelector("[data-movie-search]");
    var filter = scope.querySelector("[data-movie-filter]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function updateCards() {
      var query = normalize(search ? search.value : "");
      var selected = normalize(filter ? filter.value : "all");

      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.category,
          card.dataset.tags
        ].join(" "));
        var queryMatch = !query || text.indexOf(query) !== -1;
        var filterMatch = selected === "all" || text.indexOf(selected) !== -1;
        card.classList.toggle("is-hidden", !(queryMatch && filterMatch));
      });
    }

    if (search) {
      search.addEventListener("input", updateCards);
    }

    if (filter) {
      filter.addEventListener("change", updateCards);
    }
  });

  var player = document.querySelector("[data-player]");

  if (player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector(".player-overlay");
    var stream = player.getAttribute("data-stream");
    var initialized = false;
    var hlsInstance = null;

    function attachStream() {
      if (!video || !stream || initialized) {
        return Promise.resolve();
      }

      initialized = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);

        return new Promise(function (resolve) {
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
          window.setTimeout(resolve, 1200);
        });
      }

      video.src = stream;
      return Promise.resolve();
    }

    function playVideo() {
      if (!video) {
        return;
      }

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      attachStream().then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            if (overlay) {
              overlay.classList.remove("is-hidden");
            }
          });
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", playVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
    }
  }
});
