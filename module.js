// Load Header
fetch("./modules/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        // 🔥 AFTER header is loaded, highlight the active page
        const currentPage = window.location.pathname.split("/").pop();

        document.querySelectorAll(".nav-link").forEach(link => {
            const linkPage = link.getAttribute("href");

            if (linkPage === currentPage) {
                link.classList.add("active");
            }
        });
    })
    .catch(err => console.log("Error loading header:", err));

//Load Footer
fetch("./modules/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });
//Load section-header
function loadSectionHeader(id) {
    const container = document.getElementById(id);

    fetch("modules/section-header.html")
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            container.querySelector(".core-title").textContent = container.dataset.title;
            container.querySelector(".word-1").textContent = container.dataset.word1;
            container.querySelector(".word-2").textContent = container.dataset.word2;
            container.querySelector(".word-3").textContent = container.dataset.word3;
            container.querySelector(".core-description").textContent = container.dataset.description;
        });
}
// Load cta-section
function loadCTA(id) {
    const container = document.getElementById(id);

    fetch("modules/cta-section.html")
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            container.querySelector(".cta-title").textContent = container.dataset.title;
            container.querySelector(".cta-description").textContent = container.dataset.description;
            container.querySelector(".cta-link").textContent = container.dataset.button;
            container.querySelector(".cta-link").href = container.dataset.link;
        });
}
