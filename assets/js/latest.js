/* =======================================
Latest Questions Loader
======================================= */

async function loadLatestQuestions() {

    const container = document.getElementById("latestQuestions");

    if (!container) {
        console.error("latestQuestions container not found.");
        return;
    }

    try {

        const response = await fetch("database/index.json");

        if (!response.ok) {
            throw new Error("HTTP Error : " + response.status);
        }

        const questions = await response.json();

        container.innerHTML = "";

        questions.slice(0, 6).forEach(item => {

            container.innerHTML += `
                <div class="question-card">

                    <div class="question-id">
                        ${item.id}
                    </div>

                    <h3>${item.title}</h3>

                    <div class="question-category">
                        ${item.category}
                    </div>

                    <a href="question.html?id=${item.id}" class="view-btn">
                        View Answer →
                    </a>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p style="color:red;text-align:center;">
                Questions could not be loaded.
            </p>
        `;

    }

}
