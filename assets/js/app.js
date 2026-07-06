document.addEventListener("DOMContentLoaded", loadLatestQuestions);

async function loadLatestQuestions() {

    const container = document.getElementById("latestQuestions");

    if (!container) return;

    try {

        const response = await fetch("database/index.json");
        const questions = await response.json();

        container.innerHTML = "";

        questions.forEach(item => {

            container.innerHTML += `

            <div class="question-card">

                <h3>${item.title}</h3>

                <p>Category : ${item.category}</p>

                <a href="question.html?id=${item.id}">
                    View Answer →
                </a>

            </div>

            `;

        });

    }

    catch(error){

        container.innerHTML="<p>Questions could not be loaded.</p>";

        console.log(error);

    }

}
