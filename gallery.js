document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initMusicPlayer();
});

function initGallery() {
  const gridEl = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox-modal");

  if (!gridEl || !GALLERY_DATA) return;

  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title-val");
  const lbCloseBtn = document.getElementById("lightbox-close");

  function renderGallery() {
    gridEl.innerHTML = "";

    if (GALLERY_DATA.length === 0) {
      gridEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ff00ff; font-weight: bold; padding: 20px;">ok</div>`;
      return;
    }

    GALLERY_DATA.forEach((item) => {
      const card = document.createElement("div");
      card.className = "art-card";

      const thumbSrc = item.thumbnail || item.image;

      card.innerHTML = `
        <div class="art-card-img-wrapper">
          <img src="${thumbSrc}" alt="${item.title}" loading="lazy">
        </div>
        <div class="art-card-info">
          <div class="art-card-title">${item.title}</div>
        </div>
      `;

      card.addEventListener("click", () => {
        openLightbox(item);
      });

      gridEl.appendChild(card);
    });
  }

  function openLightbox(item) {
    if (!lightbox) return;

    lbImg.src = item.image;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;

    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = "none";
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  if (lbCloseBtn) {
    lbCloseBtn.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });

  renderGallery();
}

function initMusicPlayer() {
  const playerContainer = document.getElementById("music-player");
  const playBtn = document.getElementById("player-play");
  const stopBtn = document.getElementById("player-stop");
  const muteBtn = document.getElementById("player-mute");
  const volumeSlider = document.getElementById("player-volume-slider");
  const timeDisplay = document.getElementById("player-time-display");
  const scrollerText = document.getElementById("track-name-scroller");

  if (!playerContainer) return;

  const audio = new Audio();
  audio.src =
    "https://lambda.vgmtreasurechest.com/soundtracks/crazybus-genesis/tkvwvoiy/01%20-%20Title%20Screen.mp3";
  audio.loop = true;
  audio.volume = 0.5;

  let isPlaying = false;
  let isMuted = false;

  const eqBars = document.querySelectorAll(".eq-bar");

  function formatTime(secs) {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updatePlayerUI() {
    if (isPlaying) {
      playerContainer.classList.add("playing");
      playBtn.textContent = "PAUSE";
      playBtn.style.color = "#00ffff";
      playBtn.style.borderColor = "#00ffff";
    } else {
      playerContainer.classList.remove("playing");
      playBtn.textContent = "PLAY";
      playBtn.style.color = "#ff00ff";
      playBtn.style.borderColor = "#555";

      eqBars.forEach((bar) => {
        bar.style.height = "2px";
      });
    }

    if (isMuted) {
      muteBtn.textContent = "UNMUTE";
      muteBtn.style.color = "#ffff00";
    } else {
      muteBtn.textContent = "MUTE";
      muteBtn.style.color = "#ff00ff";
    }
  }

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio
        .play()
        .then(() => {
          isPlaying = true;
          updatePlayerUI();
        })
        .catch((err) => {
          console.warn(
            "Autoplay blocked by browser. Interaction required first.",
            err,
          );
          alert("Click OK to enable music playback!");
          audio.play();
          isPlaying = true;
          updatePlayerUI();
        });
    }
    updatePlayerUI();
  });

  stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    updatePlayerUI();
    timeDisplay.textContent = "00:00";
  });

  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    updatePlayerUI();
  });

  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    if (val === 0) {
      isMuted = true;
      audio.muted = true;
    } else {
      isMuted = false;
      audio.muted = false;
    }
    updatePlayerUI();
  });

  audio.addEventListener("timeupdate", () => {
    timeDisplay.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("timeupdate", () => {
    if (!isPlaying) return;
    eqBars.forEach((bar) => {
      const randomHeight = Math.floor(Math.random() * 22) + 2;
      bar.style.height = `${randomHeight}px`;
    });
  });
}
