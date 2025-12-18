document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const overlay = document.querySelector(".overlay");
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  overlay.addEventListener("click", () => {
    burger.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
  });

  const video = document.querySelector(".food-video");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");

  const videos = [
    "video/854105-hd_1920_1080_25fps.mp4",
    "video/1745532-hd_1920_1080_30fps.mp4",
    "video/3015488-hd_1920_1080_24fps.mp4",
    "video/7141501-uhd_2160_4096_30fps.mp4"
  ];

  let currentIndex = 0;

  function changeVideo(index) {
    currentIndex = (index + videos.length) % videos.length;
    video.src = videos[currentIndex];
    video.play();
  }

  rightBtn.addEventListener("click", () => {
    changeVideo(currentIndex + 1);
  });

  leftBtn.addEventListener("click", () => {
    changeVideo(currentIndex - 1);
  });
});
