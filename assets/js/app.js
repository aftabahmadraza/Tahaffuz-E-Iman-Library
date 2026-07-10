/* =====================================
Tahaffuz-E-Iman Library
Common JavaScript
Version : 2.0
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Tahaffuz-E-Iman Loaded");

    initTheme();
    initCounters();
    initScrollTop();

});

/* =====================================
Theme
===================================== */

function initTheme() {

    const btn = document.getElementById("theme-toggle");

    if (!btn) return;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        btn.innerHTML = "☀️";
    }

    btn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");
            btn.innerHTML = "☀️";

        } else {

            localStorage.setItem("theme", "light");
            btn.innerHTML = "🌙";

        }

    });

}

/* =====================================
Animated Counter
===================================== */

function initCounters() {

    const counters = document.querySelectorAll(".stat-card h2");

    counters.forEach(counter => {

        const target = parseInt(counter.innerText.replace(/\D/g, ""));

        if (isNaN(target)) return;

        let current = 0;

        const step = Math.ceil(target / 100);

        function update() {

            current += step;

            if (current >= target) {

                counter.innerText = target.toLocaleString() + "+";

                return;

            }

            counter.innerText = current.toLocaleString() + "+";

            requestAnimationFrame(update);

        }

        update();

    });

}

/* =====================================
Scroll To Top
===================================== */

function initScrollTop() {

    const btn = document.getElementById("scroll-top-btn");

    if (!btn) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            btn.style.display = "flex";

        } else {

            btn.style.display = "none";

        }

    });

    btn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}
