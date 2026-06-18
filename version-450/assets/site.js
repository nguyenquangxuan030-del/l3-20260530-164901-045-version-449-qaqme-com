(function () {
  var body = document.body;
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      body.classList.toggle('is-menu-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function activate(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        activate(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener('click', function () {
        activate(current);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    activate(0);
    start();
  });

  document.querySelectorAll('.filter-panel').forEach(function (panel) {
    var scope = panel.parentElement || document;
    var input = panel.querySelector('[data-filter-input]');
    var year = panel.querySelector('[data-filter-year]');
    var region = panel.querySelector('[data-filter-region]');
    var category = panel.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var grid = scope.querySelector('.movie-grid');
    var empty = document.createElement('div');
    empty.className = 'filter-empty';
    empty.textContent = '没有找到匹配影片';
    empty.hidden = true;

    if (grid) {
      grid.appendChild(empty);
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(input && input.value);
      var pickedYear = normalize(year && year.value);
      var pickedRegion = normalize(region && region.value);
      var pickedCategory = normalize(category && category.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.type,
          card.dataset.category
        ].join(' '));
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (pickedYear && normalize(card.dataset.year) !== pickedYear) {
          matched = false;
        }
        if (pickedRegion && normalize(card.dataset.region).indexOf(pickedRegion) === -1) {
          matched = false;
        }
        if (pickedCategory && normalize(card.dataset.category) !== pickedCategory) {
          matched = false;
        }

        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      empty.hidden = visible !== 0;
    }

    [input, year, region, category].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && input) {
      input.value = query;
      applyFilter();
    }
  });
})();
