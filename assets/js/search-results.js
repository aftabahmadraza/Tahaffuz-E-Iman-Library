/* =====================================
Tahaffuz-E-Iman Library
Advanced Search Results V1.0
===================================== */

let allQuestions = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadAllQuestions();
  
  // Get initial search from URL
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  
  if (query) {
    document.getElementById("advSearchInput").value = query;
  }
  if (category) {
    document.getElementById("categoryFilter").value = category;
  }
  
  performSearch();
  
  // Event listeners
  document.getElementById("searchFilterBtn").addEventListener("click", performSearch);
  document.getElementById("advSearchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });
  document.getElementById("categoryFilter").addEventListener("change", performSearch);
});

async function loadAllQuestions() {
  try {
    const response = await fetch("database/index.json");
    allQuestions = await response.json();
  } catch (error) {
    console.error("Questions load error:", error);
  }
}

function performSearch() {
  const query = document.getElementById("advSearchInput").value.toLowerCase().trim();
  const category = document.getElementById("categoryFilter").value;
  
  let results = allQuestions;
  
  // Filter by query
  if (query) {
    results = results.filter(q =>
      q.id.toLowerCase().includes(query) ||
      q.title.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (category) {
    results = results.filter(q => q.category === category);
  }
  
  displayResults(results, query);
}

function displayResults(results, query) {
  const container = document.getElementById("searchResults");
  const titleEl = document.getElementById("searchTitle");
  
  if (query) {
    titleEl.textContent = `🔍 Results for "${query}" (${results.length} found)`;
  } else {
    const cat = document.getElementById("categoryFilter").value;
    if (cat) {
      titleEl.textContent = `📂 Category: ${cat} (${results.length} questions)`;
    } else {
      titleEl.textContent = `📚 All Questions (${results.length})`;
    }
  }
  
  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;padding:50px;text-align:center;color:#999;">
        <p style="font-size:18px;margin:0;">No questions found matching your criteria.</p>
        <p style="font-size:14px;margin:10px 0 0;">Try different keywords or browse <a href="categories.html" style="color:#0f7b4d;text-decoration:underline;">categories</a></p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  
  results.forEach(q => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `
      <div class="question-id">${q.id}</div>
      <h3>${q.title}</h3>
      <div class="question-category">${q.category}</div>
      <a href="question.html?id=${q.id}" class="view-btn">View Answer →</a>
    `;
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}
