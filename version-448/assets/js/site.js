(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var previous = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === current);
        });
    }

    function startCarousel() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    if (previous) {
        previous.addEventListener("click", function () {
            showSlide(current - 1);
            startCarousel();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(current + 1);
            startCarousel();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            showSlide(Number(dot.getAttribute("data-target")) || 0);
            startCarousel();
        });
    });

    startCarousel();

    var filters = Array.prototype.slice.call(document.querySelectorAll(".page-filter"));

    filters.forEach(function (input) {
        input.addEventListener("input", function () {
            var value = input.value.trim().toLowerCase();
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .ranking-row"));
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.textContent
                ].join(" ").toLowerCase();
                card.classList.toggle("is-hidden-by-filter", value && haystack.indexOf(value) === -1);
            });
        });
    });

    var searchInput = document.getElementById("searchInput");
    var searchResults = document.getElementById("searchResults");
    var searchSummary = document.getElementById("searchSummary");

    function makeCard(item) {
        return [
            '<article class="movie-card">',
            '<a class="poster-wrap" href="' + item.href + '" aria-label="' + escapeHtml(item.title) + '">',
            '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
            '<span class="poster-play">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="movie-card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>',
            '<h3><a href="' + item.href + '">' + escapeHtml(item.title) + '</a></h3>',
            '<p>' + escapeHtml(item.line) + '</p>',
            '<div class="movie-card-tags"><span>' + escapeHtml(item.genre) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function renderSearch() {
        if (!searchInput || !searchResults || !window.SEARCH_INDEX) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || searchInput.value || "";
        searchInput.value = query;
        var trimmed = query.trim().toLowerCase();
        if (!trimmed) {
            searchResults.innerHTML = "";
            if (searchSummary) {
                searchSummary.textContent = "";
            }
            return;
        }
        var matched = window.SEARCH_INDEX.filter(function (item) {
            return item.search.indexOf(trimmed) !== -1;
        }).slice(0, 120);
        searchResults.innerHTML = matched.map(makeCard).join("");
        if (searchSummary) {
            searchSummary.textContent = "找到 " + matched.length + " 条相关影片";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", renderSearch);
        renderSearch();
    }
})();
