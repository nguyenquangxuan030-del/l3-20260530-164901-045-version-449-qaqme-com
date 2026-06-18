(function () {
  var video = document.getElementById('video-player');
  var cover = document.getElementById('player-cover');
  var start = document.getElementById('player-start');

  if (!video) {
    return;
  }

  var stream = video.getAttribute('data-m3u8');
  var ready = false;
  var hls = null;

  function loadStream() {
    if (ready || !stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
      ready = true;
      return;
    }

    video.src = stream;
    ready = true;
  }

  function begin(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    loadStream();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    var playTask = video.play();

    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', begin);
  }

  if (start) {
    start.addEventListener('click', begin);
  }

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
