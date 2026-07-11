/* =====================================
Latest Questions
Tahaffuz-E-Iman Library
Version 1.1 (Optimized)
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  loadLatestQuestions();
});

async function loadLatestQuestions() {
  const container = document.getElementById("latestQuestions");
  if (!container) return;

  try {
    const response = await fetch("database/index.json");
    if (!response.ok) throw new Error("index.json Not Found");

    const data = await response.json();
    container.innerHTML = "";

    // Use DocumentFragment for performance
    const fragment = document.createDocumentFragment();

    data.slice(0, 6).forEach(item => {
      const card = document.createElement("div");
      card.className = "question-card";
      card.innerHTML = `
        <div class="question-id">${item.id}</div>
        <h3>${item.title}</h3>
        <div class="question-category">${item.category}</div>
        <a href="question.html?id=${item.id}" class="view-btn">View Answer →</a>
      `;
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div style="padding:30px;text-align:center">
        ❌ Latest Questions could not be loaded.
      </div>
    `;
  }
}
