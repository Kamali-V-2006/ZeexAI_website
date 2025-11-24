fetch("./modules/header.html")
    .then(res => res.text())
    .then(data => {
    const headerElement = document.getElementById("header");
    if (!headerElement)
        return;
    headerElement.innerHTML = data;
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
})
    .catch(err => console.error("Error loading header:", err));
fetch("./modules/footer.html")
    .then(response => response.text())
    .then(data => {
    const footerElement = document.getElementById("footer");
    if (!footerElement)
        return;
    footerElement.innerHTML = data;
});
function loadSectionHeader(id) {
    const container = document.getElementById(id);
    if (!container)
        return;
    fetch("./modules/section-header.html")
        .then(res => res.text())
        .then(html => {
        var _a, _b, _c, _d, _e;
        container.innerHTML = html;
        const title = (_a = container.dataset.title) !== null && _a !== void 0 ? _a : "";
        const word1 = (_b = container.dataset.word1) !== null && _b !== void 0 ? _b : "";
        const word2 = (_c = container.dataset.word2) !== null && _c !== void 0 ? _c : "";
        const word3 = (_d = container.dataset.word3) !== null && _d !== void 0 ? _d : "";
        const description = (_e = container.dataset.description) !== null && _e !== void 0 ? _e : "";
        container.querySelector(".core-title").textContent = title;
        container.querySelector(".word-1").textContent = word1;
        container.querySelector(".word-2").textContent = word2;
        container.querySelector(".word-3").textContent = word3;
        container.querySelector(".core-description").textContent = description;
    });
}
function loadCTA(id) {
    const container = document.getElementById(id);
    if (!container)
        return;
    fetch("./modules/cta-section.html")
        .then(res => res.text())
        .then(html => {
        var _a, _b, _c, _d;
        container.innerHTML = html;
        const title = (_a = container.dataset.title) !== null && _a !== void 0 ? _a : "";
        const description = (_b = container.dataset.description) !== null && _b !== void 0 ? _b : "";
        const buttonText = (_c = container.dataset.button) !== null && _c !== void 0 ? _c : "";
        const buttonLink = (_d = container.dataset.link) !== null && _d !== void 0 ? _d : "#";
        const btn = container.querySelector(".cta-link");
        if (btn) {
            btn.textContent = buttonText;
            btn.href = buttonLink;
        }
        container.querySelector(".cta-title").textContent = title;
        container.querySelector(".cta-description").textContent = description;
    });
}
const video = document.getElementById("mainVideo");
const thumb = document.getElementById("videoThumb");
const playBtn = document.getElementById("playBtn");
let isHovering = false;
const videoCard = document.querySelector(".video-card");
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop() || "";
    document.querySelectorAll(".nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});
if (videoCard) {
    videoCard.addEventListener("mouseenter", () => {
        isHovering = true;
    });
    videoCard.addEventListener("mouseleave", () => {
        isHovering = false;
    });
}
const controls = document.getElementById("videoControls");
const pauseBtn = document.getElementById("pauseBtn");
const progressBar = document.getElementById("progressBar");
const timeLabel = document.getElementById("timeLabel");
if (playBtn && thumb && video && controls) {
    playBtn.onclick = () => {
        playBtn.style.display = "none";
        thumb.style.display = "none";
        video.style.display = "block";
        controls.style.display = "flex";
        video.play();
    };
}
if (pauseBtn && video) {
    pauseBtn.onclick = () => {
        if (video.paused) {
            video.play();
            pauseBtn.textContent = "⏸";
        }
        else {
            video.pause();
            pauseBtn.textContent = "▶";
        }
    };
}
if (video && progressBar && timeLabel) {
    video.addEventListener("timeupdate", () => {
        if (!isHovering)
            return;
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.value = progress.toString();
        const mins = Math.floor(video.currentTime / 60);
        const secs = Math.floor(video.currentTime % 60);
        timeLabel.textContent =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    });
    progressBar.addEventListener("input", () => {
        const val = Number(progressBar.value);
        video.currentTime = (val / 100) * video.duration;
    });
}
new Swiper(".feature-slider", {
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
(() => {
    const slides = Array.from(document.querySelectorAll('.vs-slide'));
    const prevBtn = document.querySelector('.vs-prev');
    const nextBtn = document.querySelector('.vs-next');
    const viewport = document.querySelector('.vs-viewport');
    let current = 0;
    let busy = false;
    const animDuration = 700;
    function init() {
        slides.forEach((s, i) => {
            s.classList.remove('is-active', 'is-next', 'is-out-up', 'is-enter-from-bottom');
            s.setAttribute('aria-hidden', 'true');
            if (i === current) {
                s.classList.add('is-active');
                s.setAttribute('aria-hidden', 'false');
                s.style.zIndex = "20";
            }
            else {
                s.style.zIndex = "10";
                if (i === current + 1 || (current === slides.length - 1 && i === 0)) {
                    s.classList.add('is-next');
                }
            }
        });
    }
    function moveTo(nextIndex) {
        if (busy)
            return;
        busy = true;
        const total = slides.length;
        nextIndex = (nextIndex + total) % total;
        if (nextIndex === current) {
            busy = false;
            return;
        }
        const currSlide = slides[current];
        const nextSlide = slides[nextIndex];
        nextSlide.classList.remove('is-next', 'is-out-up', 'is-enter-from-bottom', 'is-active');
        nextSlide.style.zIndex = "18";
        nextSlide.classList.add('is-next');
        nextSlide.setAttribute('aria-hidden', 'false');
        currSlide.classList.remove('is-active');
        currSlide.classList.add('is-out-up');
        setTimeout(() => {
            nextSlide.classList.remove('is-next');
            nextSlide.classList.add('is-enter-from-bottom');
            nextSlide.classList.add('is-active');
            setTimeout(() => {
                slides.forEach((s, i) => {
                    s.classList.remove('is-out-up', 'is-enter-from-bottom');
                    s.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
                    s.style.zIndex = (i === nextIndex) ? "20" : "10";
                });
                current = nextIndex;
                busy = false;
            }, animDuration);
        }, 60);
    }
    function movePrev() {
        moveTo(current - 1);
    }
    if (nextBtn)
        nextBtn.addEventListener('click', () => moveTo(current + 1));
    if (prevBtn)
        prevBtn.addEventListener('click', () => movePrev());
    if (viewport)
        viewport.addEventListener('wheel', (e) => {
            if (e.deltaY > 0)
                moveTo(current + 1);
            else
                movePrev();
        }, { passive: true });
    init();
})();
let index = 0;
const cards = document.querySelectorAll(".blog-card");
const carousel = document.getElementById("carousel");
const cardWidth = 330 + 40;
function updateCarousel() {
    if (carousel) {
        carousel.style.transform = `translateX(-${index * cardWidth}px)`;
    }
}
const nextCarouselBtn = document.getElementById("nextBtn");
if (nextCarouselBtn) {
    nextCarouselBtn.onclick = () => {
        if (index < cards.length - 1) {
            index++;
            updateCarousel();
        }
    };
}
const prevCarouselBtn = document.getElementById("prevBtn");
if (prevCarouselBtn) {
    prevCarouselBtn.onclick = () => {
        if (index > 0) {
            index--;
            updateCarousel();
        }
    };
}
updateCarousel();
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
applyFilter("all");
const form = document.getElementById("newsletterForm");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("newsletterEmail");
        if (!emailInput)
            return;
        const email = emailInput.value.trim();
        if (!email)
            return;
        alert("Subscribed: " + email);
        form.reset();
    });
}
