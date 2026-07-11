/* =====================================
Tahaffuz-E-Iman Library
Question Engine V1
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadQuestion();

});

/* =====================================
LOAD QUESTION
===================================== */

async function loadQuestion() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        showError("Question ID Missing");

        return;

    }

    try {

        const response = await fetch(`database/questions/${id}.json`);

        if (!response.ok) {

            throw new Error("Question JSON Not Found");

        }

        const data = await response.json();

        renderHero(data);

        renderAnswer(data);

        renderBooks(data);
        
        renderGallery(data);

       

    }

        /* Related Questions */

.related-grid{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));

    gap:20px;

    margin-top:25px;

}

.related-card{

    display:block;

    padding:18px;

    border:1px solid #ddd;

    border-radius:12px;

    background:#fff;

    text-decoration:none;

    color:#222;

    transition:.3s;

}

.related-card:hover{

    transform:translateY(-3px);

    box-shadow:0 8px 20px rgba(0,0,0,.08);

}

.related-card h3{

    font-size:18px;

    margin-bottom:10px;

}

.related-card span{

    color:#0f7b4d;

    font-weight:600;

}

    catch(error){

        console.error(error);

        showError(error.message);

    }

}

/* =====================================
HERO
===================================== */

function renderHero(data){

    setText("questionTitle",data.title);

    setText("questionCategory",data.category);

    setText("questionID",data.id);

    setText("badgeID",data.id);

    setText("badgeCategory",data.category);

    setText("badgeStatus",data.status);

}

/* =====================================
ANSWER
===================================== */

function renderAnswer(data){

    const container = document.getElementById("questionAnswer");

    if(!container) return;

    container.innerHTML = data.answer || "<p>Answer Not Available.</p>";

}

/* =====================================
BOOKS
===================================== */

function renderBooks(data){

    const container=document.getElementById("bookReferenceCards");

    if(!container) return;

    container.innerHTML="";

    if(!data.references || data.references.length===0){

        container.innerHTML="<p>No Book Reference Found.</p>";

        return;

    }

    data.references.forEach(book=>{

       container.innerHTML += `
<div class="book-card">

    <img
        src="${book.scan}"
        alt="${book.book}"
        class="book-image"
        loading="lazy"
    >

    <div class="book-content">

        <h3>${book.book}</h3>

        <p><strong>Author:</strong> ${book.author}</p>

        <p><strong>Volume:</strong> ${book.volume}</p>

        <p><strong>Page:</strong> ${book.page}</p>

        <p><strong>Lines:</strong> ${book.line}</p>

        <p><strong>Language:</strong> ${book.language}</p>

        <a
            href="${book.pdf}"
            target="_blank"
            class="btn-primary"
        >
            Open PDF
        </a>

    </div>

</div>
`;
    });

}

/* =====================================
HELPERS
===================================== */

function setText(id,text){

    const el=document.getElementById(id);

    if(el){

        el.textContent=text;

    }

}

/* =====================================
GALLERY
===================================== */

function renderGallery(data){

    const container=document.getElementById("evidenceGallery");

    if(!container) return;

    container.innerHTML="";

    if(!data.references || data.references.length===0){
        
        container.innerHTML="<p>No Evidence Available.</p>";

        return;

    }

    data.references.forEach(item=>{

       if(item.scan){

    container.innerHTML += `
        <div class="gallery-card">
            <img src="${item.scan}" alt="Book Scan" loading="lazy">
            <div class="gallery-info">
                <h4>Book Scan</h4>
            </div>
        </div>
    `;

}

if(item.highlight){

    container.innerHTML += `
        <div class="gallery-card">
            <img src="${item.highlight}" alt="Highlighted Evidence" loading="lazy">
            <div class="gallery-info">
                <h4>Highlighted Evidence</h4>
            </div>
        </div>
    `;

}
    });

}

/* =====================================
ERROR
===================================== */

function showError(message){

    document.body.innerHTML=`

<div style="padding:80px;text-align:center;font-family:Arial">

<h1>⚠️ Question Not Found</h1>

<p>${message}</p>

<p>

Please check Question ID.

</p>

<a href="index.html">

⬅ Back To Homepage

</a>

</div>

`;

}

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("copy-reference")){

navigator.clipboard.writeText(

e.target.dataset.reference

);

alert("Citation Copied");

}

});

/* =====================================
EVIDENCE VIEWER
===================================== */

let zoomLevel = 1;

document.addEventListener("click", function(e){

    if(e.target.classList.contains("view-scan")){

        e.preventDefault();

        document.getElementById("evidenceModal").style.display="flex";

        document.getElementById("viewerImage").src=e.target.dataset.image;

        document.getElementById("viewerTitle").innerText=e.target.dataset.title;

        zoomLevel=1;

        document.getElementById("viewerImage").style.transform="scale(1)";

    }

});

document.getElementById("closeViewer").onclick=function(){

document.getElementById("evidenceModal").style.display="none";

};

document.getElementById("zoomIn").onclick=function(){

zoomLevel+=0.2;

document.getElementById("viewerImage").style.transform=`scale(${zoomLevel})`;

};

document.getElementById("zoomOut").onclick=function(){

if(zoomLevel>0.4){

zoomLevel-=0.2;

}

document.getElementById("viewerImage").style.transform=`scale(${zoomLevel})`;

};

document.getElementById("fullScreen").onclick=function(){

document.getElementById("viewerImage").requestFullscreen();

};
