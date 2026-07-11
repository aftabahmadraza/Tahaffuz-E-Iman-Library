/* ==========================================
   QUESTION PAGE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();
});

async function loadQuestion() {

    try {

        const params = new URLSearchParams(window.location.search);

        const id = params.get("id");

        if (!id) {
            showError("Question ID Missing.");
            return;
        }

        const response = await fetch(`database/questions/${id}.json`);

        if (!response.ok) {
            showError("Question Not Found.");
            return;
        }

        const data = await response.json();

        document.title = data.title + " | Tahaffuz-Eiman Library";

        renderHero(data);

        renderAnswer(data);

        renderBooks(data);

        // renderGallery(data); // अभी Disabled

    } catch (err) {

        console.error(err);

        showError("Unable to load question.");

    }

}

/* ==========================================
   HERO
========================================== */

function renderHero(data) {

    setText("questionTitle", data.title);

    setText("questionCategory", data.category);

    setText("questionID", data.id);

    setText("badgeID", data.id);

    setText("badgeCategory", data.category);

    setText("badgeStatus", data.status || "Published");

}

/* ==========================================
   ANSWER
========================================== */

function renderAnswer(data) {

    const container = document.getElementById("questionAnswer");

    if (!container) return;

    container.innerHTML = data.answer || "<p>Answer Not Available.</p>";

}

/* ==========================================
   BOOK REFERENCES
========================================== */

function renderBooks(data) {

    const container = document.getElementById("bookReferenceCards");

    if (!container) return;

    if (!data.references || data.references.length === 0) {

        container.innerHTML = "<p>No Book References Found.</p>";

        return;

    }

    container.innerHTML = "";

    data.references.forEach(book => {

        container.innerHTML += `
        <div class="book-card">

            <img
                src="${book.scan || ''}"
                alt="${book.book}"
                class="book-image"
                loading="lazy"
            >

            <div class="book-content">

                <h3>${book.book}</h3>

                <p><strong>Author:</strong> ${book.author}</p>

                <p><strong>Publisher:</strong> ${book.publisher}</p>

                <p><strong>Volume:</strong> ${book.volume}</p>

                <p><strong>Page:</strong> ${book.page}</p>

                <p><strong>Line:</strong> ${book.line}</p>

                <p><strong>Language:</strong> ${book.language}</p>

                ${book.pdf ? `
                <a
                    href="${book.pdf}"
                    target="_blank"
                    class="btn-primary">
                    Open PDF
                </a>
                ` : ""}

            </div>

        </div>
        `;

    });

}

function setText(id, value) {

    const el = document.getElementById(id);

    if (el) {

        el.textContent = value || "";

    }

}

/* ==========================================
   GALLERY
========================================== */

function renderGallery(data) {

    const container = document.getElementById("evidenceGallery");

    if (!container) return;

    if (!data.references || data.references.length === 0) {

        container.innerHTML = "<p>No Evidence Available.</p>";

        return;

    }

    container.innerHTML = "";

    data.references.forEach(item => {

        if (item.scan) {

            container.innerHTML += `
            <div class="gallery-card">

                <img
                    src="${item.scan}"
                    alt="Book Scan"
                    loading="lazy"
                    onclick="openImage('${item.scan}')">

                <div class="gallery-info">
                    <h4>Book Scan</h4>
                </div>

            </div>
            `;

        }

        if (item.highlight) {

            container.innerHTML += `
            <div class="gallery-card">

                <img
                    src="${item.highlight}"
                    alt="Highlighted Evidence"
                    loading="lazy"
                    onclick="openImage('${item.highlight}')">

                <div class="gallery-info">
                    <h4>Highlighted Evidence</h4>
                </div>

            </div>
            `;

        }

    });

}

/* ==========================================
   IMAGE VIEWER
========================================== */

function openImage(src) {

    const modal = document.getElementById("imageViewer");

    if (!modal) return;

    modal.style.display = "flex";

    document.getElementById("viewerImage").src = src;

}

function closeImage() {

    const modal = document.getElementById("imageViewer");

    if (modal) {

        modal.style.display = "none";

    }

}

/* ==========================================
   PDF VIEWER
========================================== */

function openPDF(url) {

    window.open(url, "_blank");

}

/* ==========================================
   ERROR
========================================== */

function showError(message) {

    const title = document.getElementById("questionTitle");

    if (title) {

        title.textContent = "Error";

    }

    const answer = document.getElementById("questionAnswer");

    if (answer) {

        answer.innerHTML = `
            <div class="error-box">

                <h2>⚠ Error</h2>

                <p>${message}</p>

            </div>
        `;

    }

}
