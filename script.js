class Application {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.backgroundColor = "transparent";
    this.images = [];
    this.loadedImages = 0;

    this.totalImages = 64;
    this.currentFrameIndex = 1;

    this.isVideoPlaying = false;
    this.videoElement = document.querySelector("video.value-props-video");
    this.videoControlBtn = document.querySelector("#videoControlBtn");
    for (let i = 0; i < this.totalImages; i++) {
      const img = new Image();
      img.onload = () => {
        this.loadedImages++;
        if (this.loadedImages === this.totalImages) {
          this.addEventListeners();
          this.render();
        }
      };
      img.src = `https://www.apple.com/105/media/us/airpods-pro/2022/d2deeb8e-83eb-48ea-9721-f567cf0fffa8/anim/hero/medium/${String(
        i
      ).padStart(4, "0")}.png`;
      this.images.push(img);
    }

    this.videoControlBtn.addEventListener("click", this.toggleVideoPlayback);
  }

  toggleVideoPlayback = () => {
    if (this.isVideoPlaying) {
      this.videoElement.pause();
      this.videoControlBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
      this.videoElement.play();
      this.videoControlBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    this.isVideoPlaying = !this.isVideoPlaying;
  };

  handleDifferentUIComponents = {
    handleHeadingAnimationBasedonScroll: () => {
      const heading = document.querySelector("h1.air");
      const soundText = document.querySelector("h2.sound");
      const video = document.querySelector("video.value-props-video");
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const startBtn = document.querySelector("button");
      const contentSection = document.querySelectorAll(".content-section");

      const handingOpacity = Math.max(
        0,
        2.8 - scrollTop / (3 * viewportHeight)
      );
      heading.style.opacity = handingOpacity;

      const scale = 1 + scrollTop / (2 * viewportHeight);
      heading.style.transform = `translate(-50%, -50%) scale(${scale})`;
      const SoundScale = 1 + scrollTop / (20 * viewportHeight);

      if (handingOpacity === 0 && SoundScale < 1.48) {
        soundText.style.display = "block";
        soundText.style.transform = `translate(-50%,-50%) scale(${SoundScale})`;
        soundText.style.opacity = "1";
        video.style.display = "none";
        startBtn.style.display = "none";
        video.style.opacity = 0;
      } else if (SoundScale >= 1.48) {
        soundText.style.display = "none";
        startBtn.style.display = "block";
        video.style.display = "block";
        video.style.opacity = "1";
        contentSection.classList.add("visible");
      } else {
        soundText.style.display = "none";
        video.style.display = "none";
        startBtn.style.display = "none";
      }
      console.log("Video element:", this.videoElement);
      console.log("Video display:", this.videoElement.style.display);
      console.log("Video opacity:", this.videoElement.style.opacity);
    },
  };

  addEventListeners() {
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScrollTop =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameCount = this.totalImages;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      this.currentFrameIndex = frameIndex;
      this.render();

      this.handleDifferentUIComponents.handleHeadingAnimationBasedonScroll();
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const img = this.images[this.currentFrameIndex];
    if (!img) return;

    const canvasRatio = this.canvas.width / this.canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth,
      drawHeight,
      offsetX = 0,
      offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = this.canvas.width;
      drawHeight = drawWidth / imgRatio;
      offsetY = (this.canvas.height - drawHeight) / 2;
    } else {
      drawHeight = this.canvas.height;
      drawWidth = drawHeight * imgRatio;
      offsetX = (this.canvas.width - drawWidth) / 2;
    }

    this.ctx.save();
    if (this.totalImages - this.currentFrameIndex < 10) {
      this.ctx.globalAlpha = (this.totalImages - this.currentFrameIndex) / 10;
    }
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    this.ctx.restore();
  }
}

window.onload = () => {
  window.app = new Application();
};
