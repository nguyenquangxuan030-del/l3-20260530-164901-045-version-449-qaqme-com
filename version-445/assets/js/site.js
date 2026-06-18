(function () {
  var navButton = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === current);
      });
    }

    var next = hero.querySelector('.hero-next');
    var prev = hero.querySelector('.hero-prev');

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5000);
    }
  }

  var filterRoot = document.querySelector('[data-filter-root]');

  if (filterRoot) {
    var input = filterRoot.querySelector('.page-search');
    var buttons = Array.prototype.slice.call(filterRoot.querySelectorAll('.filter-button'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var selected = 'all';

    if (input) {
      input.value = q;
    }

    function cardText(card) {
      return [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-category') || ''
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var term = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var category = card.getAttribute('data-category') || '';
        var byCategory = selected === 'all' || category === selected;
        var byTerm = !term || cardText(card).indexOf(term) !== -1;
        card.classList.toggle('is-hidden', !(byCategory && byTerm));
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        selected = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilter();
      });
    });

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    applyFilter();
  }
})();
