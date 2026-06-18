(() => {
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const next = document.querySelector('[data-hero-next]');
    const prev = document.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    function startTimer() {
        if (!slides.length) {
            return;
        }
        window.clearInterval(timer);
        timer = window.setInterval(() => {
            showSlide(current + 1);
        }, 5200);
    }

    if (slides.length) {
        next?.addEventListener('click', () => {
            showSlide(current + 1);
            startTimer();
        });
        prev?.addEventListener('click', () => {
            showSlide(current - 1);
            startTimer();
        });
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                showSlide(Number(dot.dataset.heroDot || 0));
                startTimer();
            });
        });
        startTimer();
    }

    const searchInput = document.querySelector('.site-search');
    const sortSelect = document.querySelector('.site-sort');
    const quickFilters = Array.from(document.querySelectorAll('.quick-filter'));
    const cardList = document.querySelector('[data-card-list]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const emptyState = document.querySelector('[data-empty-state]');
    let quickValue = '';

    function cardText(card) {
        return [
            card.dataset.title,
            card.dataset.year,
            card.dataset.region,
            card.dataset.type,
            card.dataset.tags
        ].join(' ').toLowerCase();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }
        const query = (searchInput?.value || '').trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
            const text = cardText(card);
            const matchedQuery = !query || text.includes(query);
            const matchedQuick = !quickValue || text.includes(quickValue.toLowerCase());
            const show = matchedQuery && matchedQuick;
            card.classList.toggle('hidden', !show);
            if (show) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.classList.toggle('show', visible === 0);
        }
    }

    function applySort() {
        if (!cardList || !sortSelect) {
            return;
        }
        const value = sortSelect.value;
        const sorted = [...cards];
        if (value === 'score') {
            sorted.sort((a, b) => Number(b.dataset.score || 0) - Number(a.dataset.score || 0));
        } else if (value === 'year') {
            sorted.sort((a, b) => Number(b.dataset.year || 0) - Number(a.dataset.year || 0));
        } else if (value === 'title') {
            sorted.sort((a, b) => String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-CN'));
        } else {
            sorted.sort((a, b) => cards.indexOf(a) - cards.indexOf(b));
        }
        sorted.forEach((card) => cardList.appendChild(card));
        applyFilter();
    }

    searchInput?.addEventListener('input', applyFilter);
    sortSelect?.addEventListener('change', applySort);
    quickFilters.forEach((button) => {
        button.addEventListener('click', () => {
            quickValue = button.dataset.filter || '';
            quickFilters.forEach((item) => item.classList.toggle('active', item === button));
            applyFilter();
        });
    });
})();
