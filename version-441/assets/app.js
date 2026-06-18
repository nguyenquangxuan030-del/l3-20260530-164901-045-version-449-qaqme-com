(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[type="search"]');
        var value = input ? input.value.trim() : '';
        var target = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
        window.location.href = target;
      });
    });

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
      var current = 0;
      var timer = null;
      var show = function (index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      };
      var start = function () {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5600);
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          if (timer) {
            window.clearInterval(timer);
          }
          show(index);
          start();
        });
      });
      if (slides.length) {
        show(0);
        start();
      }
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && filterInput) {
      filterInput.value = query;
    }
    var applyFilter = function () {
      var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
      var typeValue = typeFilter ? typeFilter.value : '';
      var yearValue = yearFilter ? yearFilter.value : '';
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !typeValue || card.getAttribute('data-type') === typeValue;
        var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
        card.classList.toggle('is-hidden', !(matchesKeyword && matchesType && matchesYear));
      });
    };
    [filterInput, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
    if (cards.length) {
      applyFilter();
    }

    var player = document.querySelector('[data-player]');
    if (player) {
      var video = player.querySelector('video');
      var overlay = player.querySelector('.player-overlay');
      var streamUrl = player.getAttribute('data-stream');
      var loaded = false;
      var wantsPlay = false;
      var hlsInstance = null;
      var tryPlay = function () {
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      };
      var load = function () {
        if (loaded || !video || !streamUrl) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.load();
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.on(window.Hls.Events.MEDIA_ATTACHED, function () {
            hlsInstance.loadSource(streamUrl);
          });
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            if (wantsPlay) {
              tryPlay();
            }
          });
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
          video.load();
        }
      };
      var startPlay = function () {
        wantsPlay = true;
        load();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        tryPlay();
      };
      if (overlay) {
        overlay.addEventListener('click', startPlay);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startPlay();
          }
        });
        video.addEventListener('play', function () {
          if (overlay) {
            overlay.classList.add('is-hidden');
          }
        });
      }
      window.addEventListener('pagehide', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  });
})();
