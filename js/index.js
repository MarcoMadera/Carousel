const track = document.querySelector(".carousel__track");

fetch("https://wallhaven.cc/api/v1/search?sorting=favorites")
.then((res)=>res.json())
.then(({data})=>{
  data.forEach((image, i)=> {
    const liElement = document.createElement("li");
    const imgElement = document.createElement("img");
    const className = i === 0 ? "carousel__slide current-slide" : "carousel__slide"
  
    liElement.className= className;
    imgElement.src = image.path;
    imgElement.className = "carousel__image";
    imgElement.alt = "carousel image";
    liElement.append(imgElement)
    track.append(liElement);
  })
  doStuff();
});

function doStuff() {
  const element = document.getElementsByTagName("li")[0];

  const clone = element.cloneNode(true);

  clone.classList.remove("current-slide");

  track.appendChild(clone);


  const carousel = document.querySelector(".carousel");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel__button--right");
  const prevButton = document.querySelector(".carousel__button--left");
  const dotsNavs = document.querySelector(".carousel__nav");
  const createButton = () => {
    const button = document.createElement("button");
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

    const currentDot = dotsNavs.querySelector(".current-dot");
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

    const currentDot = dotsNavs.querySelector(".current-dot");
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

  setInterval(() => nextButton.click(), 5000);
  let isSwiping = false;

  const swipe = (event) => {
    isSwiping = true;
    const touch = event.targetTouches[0];
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
}
