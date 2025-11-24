// modules loader 

// Load Header
fetch("./modules/header.html")
    .then(res => res.text())
    .then(data => {
        const headerElement = document.getElementById("header");
        if (!headerElement) return;
        headerElement.innerHTML = data;

        const currentPage = window.location.pathname.split("/").pop();

        const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
        navLinks.forEach(link => {
            const linkPage = link.getAttribute("href");
            if (linkPage === currentPage) {
                link.classList.add("active");
            }
        });
    })
    .catch(err => console.error("Error loading header:", err));

// Load Footer
fetch("./modules/footer.html")
    .then(response => response.text())
    .then(data => {
        const footerElement = document.getElementById("footer");
        if (!footerElement) return;
        footerElement.innerHTML = data;
    });

// Load section-header
function loadSectionHeader(id: string): void {
    const container = document.getElementById(id);
    if (!container) return;

    fetch("./modules/section-header.html")
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            const title = container.dataset.title ?? "";
            const word1 = container.dataset.word1 ?? "";
            const word2 = container.dataset.word2 ?? "";
            const word3 = container.dataset.word3 ?? "";
            const description = container.dataset.description ?? "";

            container.querySelector(".core-title")!.textContent = title;
            container.querySelector(".word-1")!.textContent = word1;
            container.querySelector(".word-2")!.textContent = word2;
            container.querySelector(".word-3")!.textContent = word3;
            container.querySelector(".core-description")!.textContent = description;
        });
}

// Load CTA Section
function loadCTA(id: string): void {
    const container = document.getElementById(id);
    if (!container) return;

    fetch("./modules/cta-section.html")
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            const title = container.dataset.title ?? "";
            const description = container.dataset.description ?? "";
            const buttonText = container.dataset.button ?? "";
            const buttonLink = container.dataset.link ?? "#";

            const btn = container.querySelector<HTMLAnchorElement>(".cta-link");
            if (btn) {
                btn.textContent = buttonText;
                btn.href = buttonLink;
            }

            container.querySelector(".cta-title")!.textContent = title;
            container.querySelector(".cta-description")!.textContent = description;
        });
}

const video = document.getElementById("mainVideo") as HTMLVideoElement | null;
const thumb = document.getElementById("videoThumb") as HTMLElement | null;
const playBtn = document.getElementById("playBtn") as HTMLButtonElement | null;
let isHovering: boolean = false;

const videoCard = document.querySelector(".video-card") as HTMLElement | null;

// auto-detect active page 
document.addEventListener("DOMContentLoaded", () => {
    const currentPage: string = window.location.pathname.split("/").pop() || "";

    document.querySelectorAll(".nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});

// Detect hover
if (videoCard) {
    videoCard.addEventListener("mouseenter", () => {
        isHovering = true;
    });

    videoCard.addEventListener("mouseleave", () => {
        isHovering = false;
    });
}

const controls = document.getElementById("videoControls") as HTMLElement | null;
const pauseBtn = document.getElementById("pauseBtn") as HTMLButtonElement | null;
const progressBar = document.getElementById("progressBar") as HTMLInputElement | null;
const timeLabel = document.getElementById("timeLabel") as HTMLElement | null;

if (playBtn && thumb && video && controls) {
    playBtn.onclick = () => {
        playBtn.style.display = "none";
        thumb.style.display = "none";
        video.style.display = "block";
        controls.style.display = "flex";
        video.play();
    };
}

// Pause
if (pauseBtn && video) {
    pauseBtn.onclick = () => {
        if (video.paused) {
            video.play();
            pauseBtn.textContent = "⏸";
        } else {
            video.pause();
            pauseBtn.textContent = "▶";
        }
    };
}

if (video && progressBar && timeLabel) {
    video.addEventListener("timeupdate", () => {
        if (!isHovering) return;

        const progress = (video.currentTime / video.duration) * 100;
        progressBar.value = progress.toString();

        const mins = Math.floor(video.currentTime / 60);
        const secs = Math.floor(video.currentTime % 60);

        timeLabel.textContent =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    });

    // Scrub video
    progressBar.addEventListener("input", () => {
        const val = Number(progressBar.value);
        video.currentTime = (val / 100) * video.duration;
    });
}

// Swiper (temporarily disabled typing warning)
declare var Swiper: any;
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

// Slider function
(() => {
    const slides = Array.from(document.querySelectorAll('.vs-slide')) as HTMLElement[];
    const prevBtn = document.querySelector('.vs-prev') as HTMLElement | null;
    const nextBtn = document.querySelector('.vs-next') as HTMLElement | null;
    const viewport = document.querySelector('.vs-viewport') as HTMLElement | null;

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
            } else {
                s.style.zIndex = "10";
                if (i === current + 1 || (current === slides.length - 1 && i === 0)) {
                    s.classList.add('is-next');
                }
            }
        });
    }

    function moveTo(nextIndex: number) {
        if (busy) return;
        busy = true;

        const total = slides.length;
        nextIndex = (nextIndex + total) % total;
        if (nextIndex === current) { busy = false; return; }

        const currSlide = slides[current];
        const nextSlide = slides[nextIndex];

        nextSlide!.classList.remove('is-next', 'is-out-up', 'is-enter-from-bottom', 'is-active');
        nextSlide!.style.zIndex = "18";
        nextSlide!.classList.add('is-next');
        nextSlide!.setAttribute('aria-hidden', 'false');

        currSlide!.classList.remove('is-active');
        currSlide!.classList.add('is-out-up');

        setTimeout(() => {
            nextSlide!.classList.remove('is-next');
            nextSlide!.classList.add('is-enter-from-bottom');
            nextSlide!.classList.add('is-active');

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

    if (nextBtn) nextBtn.addEventListener('click', () => moveTo(current + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => movePrev());
    if (viewport) viewport.addEventListener('wheel', (e: WheelEvent) => {
        if (e.deltaY > 0) moveTo(current + 1);
        else movePrev();
    }, { passive: true });

    init();
})();

let index = 0;
const cards = document.querySelectorAll(".blog-card") as NodeListOf<HTMLElement>;
const carousel = document.getElementById("carousel") as HTMLElement | null;

const cardWidth = 330 + 40; // card width + gap

function updateCarousel() {
    if (carousel) {
        carousel.style.transform = `translateX(-${index * cardWidth}px)`;
    }
}

const nextCarouselBtn = document.getElementById("nextBtn") as HTMLElement | null;
if (nextCarouselBtn) {
    nextCarouselBtn.onclick = () => {
        if (index < cards.length - 1) {
            index++;
            updateCarousel();
        }
    };
}

const prevCarouselBtn = document.getElementById("prevBtn") as HTMLElement | null;
if (prevCarouselBtn) {
    prevCarouselBtn.onclick = () => {
        if (index > 0) {
            index--;
            updateCarousel();
        }
    };
}

updateCarousel();

// blogs.ts

// Robust filters: normalize values
const filterBtns = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
const blogCards = document.querySelectorAll<HTMLElement>(".blog-card");

function applyFilter(selected?: string) {
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
const form = document.getElementById("newsletterForm") as HTMLFormElement | null;
if (form) {
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletterEmail") as HTMLInputElement | null;
    if (!emailInput) return;

    const email = emailInput.value.trim();
    if (!email) return;

    alert("Subscribed: " + email);
    form.reset();
  });
}

