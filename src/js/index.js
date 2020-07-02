const track = document.querySelector(".carousel__track");
let elmnt = document.getElementsByTagName("li")[0];
let cln = elmnt.cloneNode(true);
cln.classList.remove("current-slide");
track.appendChild(cln);

const carousel = document.querySelector(".carousel");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".carousel__button--right");
const prevButton = document.querySelector(".carousel__button--left");
const dotsNavs = document.querySelector(".carousel__nav");
const createButton = () => {
  let button = document.createElement("button");
  button.classList.add("carousel__indicator");
  console.log(button);
  dotsNavs.appendChild(button);
};

for (let i = 0; i < slides.length - 2; i++) {
  createButton();
}
const dots = Array.from(dotsNavs.children);
const slideWidth = slides[0].getBoundingClientRect().width;

// arrage the sliders nex to one another
const setSlidePosition = (slide, i) => {
  slide.style.left = slideWidth * i + "px";
};

slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";
  currentSlide.classList.remove("current-slide");
  targetSlide.classList.add("current-slide");
};

const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove("current-dot");
  targetDot.classList.add("current-dot");
};

prevButton.addEventListener("click", (e) => {
  const currentSlide = track.querySelector(".current-slide");
  let prevSlide = currentSlide.previousElementSibling;
  if (prevSlide == null) prevSlide = slides[slides.length - 1];

  let currentDot = dotsNavs.querySelector(".current-dot");
  let targetDot = currentDot.previousElementSibling;
  if (targetDot == null) {
    targetDot = dots[dots.length - 1];
  }

  moveToSlide(track, currentSlide, prevSlide);

  if (currentSlide != slides[0]) {
    updateDots(currentDot, targetDot);
    track.style.transitionProperty = "transform";
  } else {
    track.style.transitionProperty = "none";
  }
});

nextButton.addEventListener("click", (e) => {
  const currentSlide = track.querySelector(".current-slide");
  let nextSlide = currentSlide.nextElementSibling;

  if (nextSlide == null) nextSlide = slides[0];

  let currentDot = dotsNavs.querySelector(".current-dot");
  let targetDot = currentDot.nextElementSibling;
  if (targetDot == null) targetDot = dots[0];
  moveToSlide(track, currentSlide, nextSlide);

  if (currentSlide != slides[slides.length - 1]) {
    updateDots(currentDot, targetDot);
    track.style.transitionProperty = "transform";
  } else {
    track.style.transitionProperty = "none";
  }
});

dotsNavs.addEventListener("click", (e) => {
  const targetDot = e.target.closest("button");
  if (!targetDot) return;
  const currentSlide = track.querySelector(".current-slide");
  const currentDot = dotsNavs.querySelector(".current-dot");
  const targetIndex = dots.findIndex((dot) => dot === targetDot);
  const targetSlide = slides[targetIndex];
  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  track.style.transitionProperty = "transform";
});

carousel.addEventListener("transitionend", (e) => {
  const currentSlide = track.querySelector(".current-slide");
  let nextSlide = currentSlide.nextElementSibling;
  let prevSlide = currentSlide.previousElementSibling;
  if (nextSlide == slides[slides.length] || nextSlide == null) {
    nextButton.click();
  }
  if (prevSlide == slides[slides.length] || prevSlide == null) {
    prevButton.click();
  }
});

let loop = setInterval(() => nextButton.click(), 5000);
let isSwiping = false;

const swipe = (event) => {
  isSwiping = true;
  let touch = event.targetTouches[0];
  const px = touch.pageX;
  const midpoint = Math.floor(screen.width / 2);
  if (px > midpoint) {
    nextButton.click();
  } else {
    prevButton.click();
  }

  setTimeout(() => (isSwiping = false), 600);
};

carousel.addEventListener("touchmove", (e) => {
  if (!isSwiping) {
    swipe(e);
  }
});
