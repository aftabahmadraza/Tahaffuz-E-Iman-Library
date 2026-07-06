document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialization
    initTheme();
    setupEventListeners();
    
    // 2. Fetch Data
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    if (questionId) {
        loadQuestion(questionId);
    } else {
        showError();
    }
});

/* =========================================
   CORE LOGIC & DATA FETCHING
========================================= */
async function loadQuestion(id) {
    try {
        // Fetch specific question JSON. (Requires local server, e.g. VSCode Live Server)
        const response = await fetch(`database/questions/${id}.json`);
        if (!response.ok) throw new Error('Question not found');
        
        const data = await response.json();
        
        populateSEO(data);
        renderUI(data);
        
        // Hide skeleton, show content
        document.getElementById('skeleton-loader').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');

        startCountdown();
        
        // Fetch related questions if they exist
        if (data.related && data.related.length > 0) {
            loadRelatedQuestions(data.related);
        } else {
            document.getElementById('related-section').classList.add('hidden');
        }

    } catch (error) {
        console.error("Error loading question:", error);
        showError();
    }
}

function showError() {
    document.getElementById('skeleton-loader').classList.add('hidden');
    document.getElementById('error-container').classList.remove('hidden');
}

/* =========================================
   UI RENDERING
========================================= */
function renderUI(data) {
    // Breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = `<a href="index.html">Home</a> > <a href="category.html?name=${data.category}">${data.category}</a> > ${data.id}`;

    // Header
    document.getElementById('category-badge').textContent = data.category;
    document.getElementById('question-id-display').textContent = data.id;
    document.getElementById('question-title').textContent = data.title;
    document.getElementById('question-text').textContent = data.question;

    // Answers
    document.getElementById('short-answer').textContent = data.shortAnswer;
    document.getElementById('full-answer').innerHTML = data.fullAnswer; // Assuming HTML inside fullAnswer

    // Evidences
    renderEvidences(data.proof);
}

function renderEvidences(proofs) {
    const tabsNav = document.getElementById('tabs-nav');
    const tabsContent = document.getElementById('tabs-content');
    const evidenceContainer = document.getElementById('evidence-container');
    
    let hasEvidence = false;
    let isFirst = true;

    // Helper to create tab
    const createTab = (id, label) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${isFirst ? 'active' : ''}`;
        btn.setAttribute('data-target', id);
        btn.textContent = label;
        tabsNav.appendChild(btn);
    };

    // Helper to create pane
    const createPane = (id, contentHTML) => {
        const pane = document.createElement('div');
        pane.className = `tab-pane ${isFirst ? 'active' : ''}`;
        pane.id = id;
        pane.innerHTML = contentHTML;
        tabsContent.appendChild(pane);
    };

    if (proofs) {
        if (proofs.quran && proofs.quran.length > 0) {
            hasEvidence = true;
            createTab('tab-quran', 'Quran');
            let html = proofs.quran.map(q => `
                <div class="proof-card">
                    <div class="proof-meta">Surah ${q.surah}, Ayat ${q.ayat}</div>
                    <div class="arabic-text">${q.text}</div>
                </div>
            `).join('');
            createPane('tab-quran', html);
            isFirst = false;
        }

        if (proofs.hadith && proofs.hadith.length > 0) {
            hasEvidence = true;
            createTab('tab-hadith', 'Hadith');
            let html = proofs.hadith.map(h => `
                <div class="proof-card">
                    <div class="proof-meta">${h.book} - Hadith ${h.number}</div>
                    <p>${h.text}</p>
                </div>
            `).join('');
            createPane('tab-hadith', html);
            isFirst = false;
        }
        
        if (proofs.books && proofs.books.length > 0) {
            hasEvidence = true;
            createTab('tab-books', 'Books');
            let html = proofs.books.map(b => `
                <div class="proof-card">
                    <div class="proof-meta">${b.name} - Page ${b.page}</div>
                    <p>${b.text}</p>
                </div>
            `).join('');
            createPane('tab-books', html);
            isFirst = false;
        }

        if (proofs.youtube && proofs.youtube.length > 0) {
            hasEvidence = true;
            createTab('tab-video', 'Videos');
            let html = proofs.youtube.map(yt => {
                // Extract Video ID
                let vid = yt.split('v=')[1] || yt.split('youtu.be/')[1];
                let ampersandPosition = vid ? vid.indexOf('&') : -1;
                if(ampersandPosition != -1) vid = vid.substring(0, ampersandPosition);
                
                return `
                <div class="embed-responsive">
                    <iframe src="https://www.youtube.com/embed/${vid}" allowfullscreen></iframe>
                </div>`;
            }).join('');
            createPane('tab-video', html);
            isFirst = false;
        }

        // Add similar logic for PDF, Images, Instagram, Audio as needed...
    }

    if (!hasEvidence) {
        evidenceContainer.classList.add('hidden');
    } else {
        setupTabs();
    }
}

async function loadRelatedQuestions(relatedIds) {
    const grid = document.getElementById('related-grid');
    try {
        // Fetch master index to get titles (Or fetch individual JSONs)
        // For production, assume index.json maps ID -> Title
        const response = await fetch(`database/index.json`);
        const indexData = await response.json();
        
        let html = '';
        relatedIds.forEach(id => {
            const match = indexData.find(item => item.id === id);
            if (match) {
                html += `
                <a href="question.html?id=${match.id}" class="related-card">
                    <span class="badge">${match.category}</span>
                    <h4 style="margin-top:0.5rem">${match.title}</h4>
                </a>`;
            }
        });
        grid.innerHTML = html;
    } catch (e) {
        console.warn("Could not load related questions", e);
    }
}

/* =========================================
   INTERACTIONS & LOGIC
========================================= */
function startCountdown() {
    let timeLeft = 10;
    const timerEl = document.getElementById('countdown-timer');
    const revealBtn = document.getElementById('reveal-btn');
    
    const timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerEl.textContent = "Time's up!";
            revealBtn.disabled = false;
            revealBtn.innerHTML = 'Reveal Answer 🔓';
        }
    }, 1000);

    revealBtn.addEventListener('click', () => {
        document.getElementById('answer-section').classList.remove('hidden');
        revealBtn.style.display = 'none';
        document.querySelector('.think-box').style.display = 'none'; // Hide think box after reveal
    });
}

function setupTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active
            buttons.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            // Add active
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });
}

/* =========================================
   UTILITIES (Theme, Share, SEO)
========================================= */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
    }
}

function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Share API
    document.getElementById('share-btn').addEventListener('click', async () => {
        const title = document.title;
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title, url }); } catch (err) {}
        } else {
            alert('Web Share API not supported on your browser.');
        }
    });

    // Copy Link
    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    });

    // Print
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print();
    });

    // Scroll to Top
    const topBtn = document.getElementById('scroll-top-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) topBtn.style.display = 'flex';
        else topBtn.style.display = 'none';
    });
    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function populateSEO(data) {
    document.title = `${data.title} | Tahaffuz-Eiman Library`;
    document.getElementById('meta-desc').content = data.question;
    document.getElementById('og-title').content = data.title;
    document.getElementById('og-desc').content = data.shortAnswer;
    document.getElementById('canonical-url').href = window.location.href;

    // JSON-LD FAQ Schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": data.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": data.shortAnswer
            }
        }]
    };
    document.getElementById('schema-script').textContent = JSON.stringify(schema);
}
