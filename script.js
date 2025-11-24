const video = document.getElementById("mainVideo");
const thumb = document.getElementById("videoThumb");
const playBtn = document.getElementById("playBtn");
let isHovering = false;

const videoCard = document.querySelector(".video-card");
// auto-detect active page 
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});

// Detect hover
videoCard.addEventListener("mouseenter", () => {
    isHovering = true;
});

videoCard.addEventListener("mouseleave", () => {
    isHovering = false;
});

const controls = document.getElementById("videoControls");
const pauseBtn = document.getElementById("pauseBtn");
const progressBar = document.getElementById("progressBar");
const timeLabel = document.getElementById("timeLabel");

playBtn.onclick = () => {
    playBtn.style.display = "none";
    thumb.style.display = "none";
    video.style.display = "block";
    controls.style.display = "flex";
    video.play();
};

// Pause
pauseBtn.onclick = () => {
    if (video.paused) {
        video.play();
        pauseBtn.textContent = "⏸";
    } else {
        video.pause();
        pauseBtn.textContent = "▶";
    }
};

video.addEventListener("timeupdate", () => {
    if (!isHovering) return;  // ⬅️ IMPORTANT: update only on hover

    let progress = (video.currentTime / video.duration) * 100;
    progressBar.value = progress;

    let mins = Math.floor(video.currentTime / 60);
    let secs = Math.floor(video.currentTime % 60);

    timeLabel.textContent =
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});


// Scrub video
progressBar.addEventListener("input", () => {
    video.currentTime = (progressBar.value / 100) * video.duration;
});

var swiper = new Swiper(".feature-slider", {
    effect: "creative",
    creativeEffect: {
        prev: {
            shadow: true,
            translate: ["-120%", 0, -500],
            rotate: [0, 0, -5]
        },
        next: {
            shadow: true,
            translate: ["120%", 0, -500],
            rotate: [0, 0, 5]
        }
    },
    grabCursor: true,
    loop: true,
    speed: 900,
});

(function(){
  const slides = Array.from(document.querySelectorAll('.vs-slide'));
  const prevBtn = document.querySelector('.vs-prev');
  const nextBtn = document.querySelector('.vs-next');
  const viewport = document.querySelector('.vs-viewport');
  let current = 0;
  let busy = false;
  const animDuration = 700;

  // initialize positions
  function init(){
    slides.forEach((s,i)=>{
      s.classList.remove('is-active','is-next','is-out-up','is-enter-from-bottom');
      s.setAttribute('aria-hidden','true');
      if(i === current){
        s.classList.add('is-active');
        s.setAttribute('aria-hidden','false');
      } else if(i === current + 1 || (current === slides.length -1 && i === 0)){
        s.classList.add('is-next');
      }
      // set z-index baseline
      s.style.zIndex = (i === current) ? 20 : 10;
    });
  }

  function moveTo(nextIndex){
    if(busy) return;
    busy = true;
    const total = slides.length;
    nextIndex = (nextIndex + total) % total;
    if(nextIndex === current){ busy=false; return; }

    const currSlide = slides[current];
    const nextSlide = slides[nextIndex];

    // Prepare next slide below (if not immediate neighbor styles are set)
    nextSlide.classList.remove('is-next','is-out-up','is-enter-from-bottom','is-active');
    nextSlide.style.zIndex = 18;
    nextSlide.classList.add('is-next');
    nextSlide.setAttribute('aria-hidden','false');

    // Animate current slide up and out
    currSlide.classList.remove('is-active');
    currSlide.classList.add('is-out-up');

    // After small delay, animate next into active
    setTimeout(()=>{
      nextSlide.classList.remove('is-next');
      nextSlide.classList.add('is-enter-from-bottom');
      nextSlide.classList.add('is-active');

      // cleanup after animation
      setTimeout(()=>{
        // reset classes on all except new current
        slides.forEach((s, i)=>{
          s.classList.remove('is-out-up','is-enter-from-bottom');
          s.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
          s.style.zIndex = (i === nextIndex) ? 20 : 10;
        });
        current = nextIndex;
        busy = false;
      }, animDuration);
    }, 60);
  }

  // prev (go to previous card — bring from top down)
  function movePrev(){
    if(busy) return;
    busy = true;
    const total = slides.length;
    let prevIndex = (current - 1 + total) % total;
    const currSlide = slides[current];
    const prevSlide = slides[prevIndex];

    // Place prev slide above (make it translateY(-40px) then animate down into place)
    prevSlide.classList.remove('is-next','is-out-up','is-enter-from-bottom','is-active');
    // set it above visually by using negative translate via inline style temporarily
    prevSlide.style.zIndex = 22;
    prevSlide.style.transform = 'translateY(-40px) rotateX(6deg) scale(.98)';
    prevSlide.style.opacity = 0;

    // animate current down and out (reverse of next)
    currSlide.classList.remove('is-active');
    currSlide.classList.add('is-out-up'); // use same out-up but will be behind

    // trigger reflow then animate prev into place
    requestAnimationFrame(()=> {
      prevSlide.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1), opacity 500ms ease';
      prevSlide.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
      prevSlide.style.opacity = 1;

      setTimeout(()=>{
        // cleanup: remove inline styles and set classes
        prevSlide.style.transition = '';
        prevSlide.style.transform = '';
        prevSlide.style.opacity = '';
        slides.forEach((s,i)=>{
          s.classList.remove('is-out-up','is-enter-from-bottom','is-next','is-active');
          s.setAttribute('aria-hidden', i === prevIndex ? 'false' : 'true');
          s.style.zIndex = (i === prevIndex) ? 20 : 10;
        });
        prevSlide.classList.add('is-active');
        current = prevIndex;
        busy = false;
      }, animDuration);
    });
  }

  // Mouse wheel / touch support (throttle)
  let wheelTimeout = null;
  function onWheel(e){
    if(wheelTimeout) return;
    wheelTimeout = setTimeout(()=> wheelTimeout = null, 450);
    if(e.deltaY > 0) moveTo(current + 1);
    else movePrev();
  }

  // touch swipe
  let startY = null;
  viewport.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
  viewport.addEventListener('touchend', e => {
    if(startY === null) return;
    const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : null;
    if(endY === null) { startY = null; return; }
    const diff = startY - endY;
    if(Math.abs(diff) > 30){
      if(diff > 0) moveTo(current + 1);
      else movePrev();
    }
    startY = null;
  });

  // attach handlers
  nextBtn.addEventListener('click', ()=> moveTo(current + 1));
  prevBtn.addEventListener('click', ()=> movePrev());
  viewport.addEventListener('wheel', onWheel, { passive:true });

  // keyboard
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown' || e.key === 'PageDown') moveTo(current + 1);
    if(e.key === 'ArrowUp' || e.key === 'PageUp') movePrev();
  });

  // init
  init();

  // expose for debugging
  window.vs = { moveTo, movePrev, slides };
})();

let index = 0;
const cards = document.querySelectorAll(".blog-card");
const carousel = document.getElementById("carousel");

const cardWidth = 330 + 40; // card width + gap

function updateCarousel() {
    carousel.style.transform = `translateX(-${index * cardWidth}px)`;
}

document.getElementById("nextBtn").onclick = () => {
    if (index < cards.length - 1) {
        index++;
        updateCarousel();
    }
};

document.getElementById("prevBtn").onclick = () => {
    if (index > 0) {
        index--;
        updateCarousel();
    }
};

updateCarousel();

// blogs.html js

    // Robust filters: normalize values
    const filterBtns = document.querySelectorAll(".filter-btn");
    const blogCards = document.querySelectorAll(".blog-card");

    function applyFilter(selected) {
      const sel = (selected || "all").trim().toLowerCase();
      blogCards.forEach(card => {
        const cat = (card.dataset.category || "").trim().toLowerCase();
        const match = sel === "all" || cat === sel;
        card.classList.toggle("hide", !match);
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter(btn.dataset.category);
      });
    });

    // Initialize
    applyFilter("all");

    // Newsletter mock submit
    const form = document.getElementById("newsletterForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value.trim();
      if (!email) return;
      alert("Subscribed: " + email);
      form.reset();
    });


