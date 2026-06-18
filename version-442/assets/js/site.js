(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var nav = document.querySelector(".site-nav");
        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
            var input = scope.querySelector(".filter-input");
            var select = scope.querySelector(".sort-select");
            var list = scope.querySelector("[data-card-list]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.children);

            function applyFilter() {
                var term = input ? input.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                    card.classList.toggle("is-hidden", term && haystack.indexOf(term) === -1);
                });
            }

            function applySort() {
                var value = select ? select.value : "default";
                var sorted = cards.slice();
                if (value === "year-desc") {
                    sorted.sort(function (a, b) {
                        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
                    });
                } else if (value === "year-asc") {
                    sorted.sort(function (a, b) {
                        return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
                    });
                } else if (value === "title-asc") {
                    sorted.sort(function (a, b) {
                        return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                    });
                }
                sorted.forEach(function (card) {
                    list.appendChild(card);
                });
            }

            if (input) {
                input.addEventListener("input", applyFilter);
            }
            if (select) {
                select.addEventListener("change", applySort);
            }
        });

        document.querySelectorAll(".player-shell").forEach(function (shell) {
            var video = shell.querySelector("video");
            var cover = shell.querySelector(".player-cover");
            var stream = shell.getAttribute("data-stream");
            var loaded = false;
            var hlsInstance = null;

            function attachStream() {
                if (!video || !stream || loaded) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }
                loaded = true;
            }

            function playVideo() {
                attachStream();
                shell.classList.add("is-playing");
                if (video) {
                    var promise = video.play();
                    if (promise && typeof promise.catch === "function") {
                        promise.catch(function () {});
                    }
                }
            }

            if (cover) {
                cover.addEventListener("click", playVideo);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (video.paused) {
                        playVideo();
                    }
                });
                video.addEventListener("ended", function () {
                    if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
                        hlsInstance.stopLoad();
                    }
                });
            }
        });
    });
})();
