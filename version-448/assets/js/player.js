(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll(".js-player"));

    players.forEach(function (frame) {
        var video = frame.querySelector("video");
        var cover = frame.querySelector(".player-cover");
        var source = video ? video.getAttribute("data-src") : "";
        var loaded = false;
        var hls = null;

        function begin() {
            if (!video || !source) {
                return;
            }

            if (!loaded) {
                loaded = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                                hls.startLoad();
                            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                                hls.recoverMediaError();
                            } else {
                                hls.destroy();
                            }
                        }
                    });
                } else {
                    video.src = source;
                }
            }

            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
            video.play().catch(function () {
                if (cover) {
                    cover.classList.remove("is-hidden");
                }
            });
        }

        if (cover) {
            cover.addEventListener("click", begin);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (!loaded) {
                    begin();
                }
            });
            video.addEventListener("play", function () {
                if (cover) {
                    cover.classList.add("is-hidden");
                }
            });
            video.addEventListener("ended", function () {
                if (cover) {
                    cover.classList.remove("is-hidden");
                }
            });
        }
    });
})();
