document.addEventListener("DOMContentLoaded", () => {

    loadQuestion();

});

/* ===============================
   LOAD QUESTION
================================ */

async function loadQuestion() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        alert("Question ID Missing");

        return;

    }

    try {

        const response = await fetch(`database/questions/${id}.json`);

        if (!response.ok) {

            throw new Error("Question Not Found");

        }

        const data = await response.json();

        renderHero(data);

        renderAnswer(data);

        renderBooks(data);

    }

    catch(error){

        console.log(error);

        document.body.innerHTML = `
        <h1 style="text-align:center;margin-top:100px">
        Question Not Found
        </h1>
        `;

    }

}

/* ===============================
   HERO
================================ */

function renderHero(data){

    document.getElementById("questionTitle").innerHTML = data.title;

    document.getElementById("questionCategory").innerHTML = data.category;

    document.getElementById("questionID").innerHTML = data.id;

    document.getElementById("badgeID").innerHTML = data.id;

    document.getElementById("badgeCategory").innerHTML = data.category;

    document.getElementById("badgeStatus").innerHTML = data.status;

}

/* ===============================
   ANSWER
================================ */

function renderAnswer(data){

    document.getElementById("questionAnswer").innerHTML = data.answer;

}

/* ===============================
   BOOKS
================================ */

function renderBooks(data){

    const container = document.getElementById("bookReferenceCards");

    if(!container) return;

    container.innerHTML="";

    if(!data.referenceBooks || data.referenceBooks.length===0){

        container.innerHTML="<h3>No Book Reference Found</h3>";

        return;

    }

    data.referenceBooks.forEach(book=>{

        container.innerHTML+=`

<div class="book-card">

<div class="book-cover">

📖

</div>

<div class="book-info">

<h3>${book.bookName}</h3>

<div class="book-meta">

<div>

<b>Author</b><br>

${book.author}

</div>

<div>

<b>Volume</b><br>

${book.volume}

</div>

<div>

<b>Page</b><br>

${book.page}

</div>

<div>

<b>Line</b><br>

${book.line}

</div>

</div>

<div class="book-buttons">

<a href="${book.scan}" target="_blank">

📷 Scan

</a>

<a href="${book.pdf}" target="_blank">

📄 PDF

</a>

</div>

</div>

</div>

`;

    });

}
