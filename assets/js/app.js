/* =======================================
Tahaffuz-E-Iman Library
Main App
======================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Tahaffuz-E-Iman Library Loaded");

    initCounters();

    loadLatestQuestions();

});

/* =======================================
Counter Animation
======================================= */

function initCounters() {

    const counters = document.querySelectorAll(".stat-card h2");

    counters.forEach(counter => {

        const target = parseInt(counter.innerText);

        let current = 0;

        const speed = Math.ceil(target / 100);

        function updateCounter() {

            current += speed;

            if (current >= target) {

                counter.innerText = target.toLocaleString() + "+";

                return;

            }

            counter.innerText = current.toLocaleString() + "+";

            requestAnimationFrame(updateCounter);

        }

        updateCounter();

    });

}
