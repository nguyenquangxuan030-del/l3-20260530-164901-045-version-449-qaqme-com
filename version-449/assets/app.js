const Hls = window.Hls;

const ready = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

ready(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let activeIndex = 0;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => showSlide(dotIndex));
    });

    if (slides.length > 1) {
      window.setInterval(() => showSlide(activeIndex + 1), 5200);
    }
  }

  const searchInput = document.getElementById('movieSearch');
  const typeSelect = document.getElementById('movieType');
  const cards = Array.from(document.querySelectorAll('#all-movies .movie-card'));

  const filterCards = () => {
    const keyword = (searchInput?.value || '').trim().toLowerCase();
    const type = typeSelect?.value || '';

    cards.forEach((card) => {
      const text = (card.dataset.search || '').toLowerCase();
      const cardType = card.dataset.type || '';
      const typeMatch = !type || cardType.includes(type);
      const textMatch = !keyword || text.includes(keyword);
      card.style.display = typeMatch && textMatch ? '' : 'none';
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', filterCards);
  }

  const player = document.querySelector('.movie-player');
  const playButton = document.querySelector('.play-button');

  if (player && playButton) {
    const stream = player.dataset.stream;
    let attached = false;

    const attachStream = () => {
      if (!stream || attached) {
        return;
      }

      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(player);
      } else {
        player.src = stream;
      }

      attached = true;
    };

    playButton.addEventListener('click', async () => {
      attachStream();
      playButton.classList.add('is-hidden');

      try {
        await player.play();
      } catch (error) {
        playButton.classList.remove('is-hidden');
      }
    });

    player.addEventListener('play', () => {
      playButton.classList.add('is-hidden');
    });

    player.addEventListener('pause', () => {
      if (player.currentTime === 0 || player.ended) {
        playButton.classList.remove('is-hidden');
      }
    });
  }
});
