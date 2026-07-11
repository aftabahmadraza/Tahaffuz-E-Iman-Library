/* =====================================
Tahaffuz-E-Iman Library
Smart Search Module V2.0
Real-time Search with Suggestions & Analytics
===================================== */

console.log("🔍 Search Module Loaded");

/* =====================================
SEARCH STATE
===================================== */
const SearchState = {
  questions: [],
  searchHistory: [],
  isLoading: false,
  debounceTimer: null
};

/* =====================================
INITIALIZE SEARCH
===================================== */
document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  loadSearchHistory();
});

async function initSearch() {
  const input = document.getElementById("searchInput");
  const suggestions = document.getElementById("searchSuggestions");
  const button = document.getElementById("searchBtn");

  if (!input || !suggestions) {
    console.warn("⚠️ Search elements not found on this page");
    return;
  }

  try {
    // Load questions database
    const response = await fetch("database/index.json");
    if (!response.ok) throw new Error("Search Index Not Found");
    
    SearchState.questions = await response.json();
    console.log(`✅ Search index loaded: ${SearchState.questions.length} questions`);

  } catch (e) {
    console.error("❌ Search Index Error:", e);
    showSearchError(suggestions);
    return;
  }

  // Input event listener with debounce
  input.addEventListener("input", (e) => {
    clearTimeout(SearchState.debounceTimer);
    SearchState.debounceTimer = setTimeout(() => {
      handleSearch(e.target.value, suggestions);
    }, 300);
  });

  // Button click listener
  if (button) {
    button.addEventListener("click", () => {
      const keyword = input.value.trim();
      performSearch(keyword);
    });
  }

  // Enter key listener
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = input.value.trim();
      performSearch(keyword);
    }
  });

  // Close suggestions on outside click
  document.addEventListener("click", (e) => {
    const searchContainer = input.closest(".hero-search") || input.closest(".search-container");
    if (searchContainer && !searchContainer.contains(e.target)) {
      suggestions.style.display = "none";
    }
  });

  // Focus event
  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 2) {
      suggestions.style.display = "block";
    }
  });
}

/* =====================================
HANDLE SEARCH INPUT
===================================== */
function handleSearch(keyword, suggestionsContainer) {
  const trimmedKeyword = keyword.trim().toLowerCase();
  suggestionsContainer.innerHTML = "";

  // Minimum 2 characters
  if (trimmedKeyword.length < 2) {
    suggestionsContainer.style.display = "none";
    return;
  }

  // Show loading state
  suggestionsContainer.style.display = "block";
  suggestionsContainer.innerHTML = `
    <div class="suggest-item" style="text-align: center; color: #999;">
      ⏳ Searching...
    </div>
  `;

  // Perform search
  const results = performQuestionSearch(trimmedKeyword);

  // Display results
  displaySearchResults(results, suggestionsContainer, trimmedKeyword);

  // Track search
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("search_performed", {
      query: trimmedKeyword,
      results: results.length
    });
  }
}

/* =====================================
PERFORM QUESTION SEARCH
===================================== */
function performQuestionSearch(keyword) {
  const keyword_lower = keyword.toLowerCase();

  // Exact matches get higher priority
  const exactMatches = SearchState.questions.filter(q =>
    q.id.toLowerCase() === keyword_lower ||
    q.title.toLowerCase() === keyword_lower
  );

  // Title matches
  const titleMatches = SearchState.questions.filter(q =>
    q.title.toLowerCase().includes(keyword_lower) &&
    !exactMatches.includes(q)
  );

  // ID and category matches
  const otherMatches = SearchState.questions.filter(q =>
    (q.id.toLowerCase().includes(keyword_lower) ||
    (q.category || "").toLowerCase().includes(keyword_lower) ||
    (q.description || "").toLowerCase().includes(keyword_lower)) &&
    !exactMatches.includes(q) &&
    !titleMatches.includes(q)
  );

  // Combine results (limit to 10)
  return [...exactMatches, ...titleMatches, ...otherMatches].slice(0, 10);
}

/* =====================================
DISPLAY SEARCH RESULTS
===================================== */
function displaySearchResults(results, suggestionsContainer, keyword) {
  suggestionsContainer.innerHTML = "";

  if (results.length === 0) {
    suggestionsContainer.innerHTML = `
      <div class="suggest-item" style="text-align: center;">
        <p style="margin: 0; color: #999;">❌ No results found for "${keyword}"</p>
        <p style="margin: 5px 0 0; color: #ccc; font-size: 12px;">Try different keywords</p>
      </div>
    `;
    suggestionsContainer.style.display = "block";
    return;
  }

  const fragment = document.createDocumentFragment();

  results.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "suggest-item";
    
    // Highlight matching text
    const highlightedTitle = highlightText(item.title, keyword);

    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="flex: 1;">
          <b style="color: #0f7b4d;">${item.id}</b>
          <span style="margin-left: 10px; font-size: 12px; background: #eafbf2; padding: 2px 6px; border-radius: 4px; color: #0f7b4d;">${item.category}</span>
          <p style="margin: 5px 0 0; color: #333; font-size: 14px;">${highlightedTitle}</p>
        </div>
      </div>
    `;

    // Click handler
    div.addEventListener("click", () => {
      navigateToQuestion(item.id);
      addToSearchHistory(item.id, item.title);
    });

    // Keyboard navigation
    div.setAttribute("role", "option");
    div.setAttribute("tabindex", "0");
    div.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        navigateToQuestion(item.id);
        addToSearchHistory(item.id, item.title);
      }
    });

    fragment.appendChild(div);
  });

  suggestionsContainer.appendChild(fragment);
  suggestionsContainer.style.display = "block";
}

/* =====================================
HIGHLIGHT TEXT
===================================== */
function highlightText(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<mark style='background: #ffd700; padding: 0 2px; border-radius: 2px;'>$1</mark>");
}

/* =====================================
PERFORM SEARCH (Full Search)
===================================== */
function performSearch(keyword) {
  if (!keyword.trim()) return;

  const results = performQuestionSearch(keyword.toLowerCase());

  if (results.length === 0) {
    if (window.TahaffuzUtils && window.TahaffuzUtils.showNotification) {
      window.TahaffuzUtils.showNotification("No results found", "warning");
    }
    return;
  }

  if (results.length === 1) {
    navigateToQuestion(results[0].id);
  } else {
    // Go to search results page
    navigateToSearchResults(keyword);
  }

  addToSearchHistory(keyword, keyword);

  // Track search
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("search_submitted", {
      query: keyword,
      results: results.length
    });
  }
}

/* =====================================
NAVIGATE TO QUESTION
===================================== */
function navigateToQuestion(questionId) {
  window.location.href = `question.html?id=${questionId}`;
}

/* =====================================
NAVIGATE TO SEARCH RESULTS
===================================== */
function navigateToSearchResults(keyword) {
  window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
}

/* =====================================
SEARCH HISTORY
===================================== */
function loadSearchHistory() {
  if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
    SearchState.searchHistory = window.TahaffuzUtils.Storage.get("tahaffuz_search_history") || [];
  }
}

function addToSearchHistory(id, title) {
  const historyItem = {
    id,
    title,
    timestamp: new Date().toISOString()
  };

  // Remove duplicates
  SearchState.searchHistory = SearchState.searchHistory.filter(item => item.id !== id);

  // Add to beginning
  SearchState.searchHistory.unshift(historyItem);

  // Limit to 20 items
  SearchState.searchHistory = SearchState.searchHistory.slice(0, 20);

  // Save to localStorage
  if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
    window.TahaffuzUtils.Storage.set("tahaffuz_search_history", SearchState.searchHistory);
  }
}

function getSearchHistory() {
  return SearchState.searchHistory;
}

function clearSearchHistory() {
  SearchState.searchHistory = [];
  if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
    window.TahaffuzUtils.Storage.remove("tahaffuz_search_history");
  }
  if (window.TahaffuzUtils && window.TahaffuzUtils.showNotification) {
    window.TahaffuzUtils.showNotification("Search history cleared", "success");
  }
}

/* =====================================
ADVANCED SEARCH FILTERS
===================================== */
function searchWithFilters(keyword, category = "", sortBy = "relevance") {
  let results = performQuestionSearch(keyword);

  // Filter by category
  if (category) {
    results = results.filter(q => q.category === category);
  }

  // Sort results
  switch (sortBy) {
    case "newest":
      results.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case "oldest":
      results.sort((a, b) => a.id.localeCompare(b.id));
      break;
    case "a-z":
      results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "z-a":
      results.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "relevance":
    default:
      // Already sorted by relevance
      break;
  }

  return results;
}

/* =====================================
SEARCH SUGGESTIONS BY CATEGORY
===================================== */
function getSuggestionsByCategory(category) {
  return SearchState.questions
    .filter(q => q.category === category)
    .slice(0, 10);
}

/* =====================================
SEARCH SUGGESTIONS BY KEYWORDS
===================================== */
function getSuggestionsByKeywords(keyword) {
  const keyword_lower = keyword.toLowerCase();
  return SearchState.questions
    .filter(q =>
      q.title.toLowerCase().includes(keyword_lower) ||
      (q.description || "").toLowerCase().includes(keyword_lower)
    )
    .slice(0, 5);
}

/* =====================================
TRENDING SEARCHES
===================================== */
const TrendingSearches = {
  data: [],
  
  init: async function() {
    // Load trending data or calculate from history
    this.data = this.calculateTrending();
  },
  
  calculateTrending: function() {
    const frequency = {};
    SearchState.searchHistory.forEach(item => {
      frequency[item.title] = (frequency[item.title] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },
  
  get: function() {
    return this.data;
  }
};

/* =====================================
ERROR HANDLING
===================================== */
function showSearchError(container) {
  container.innerHTML = `
    <div class="suggest-item" style="color: #f44336;">
      ❌ Search service unavailable
    </div>
  `;
  container.style.display = "block";
}

/* =====================================
EXPORT FUNCTIONS GLOBALLY
===================================== */
window.performSearch = performSearch;
window.navigateToQuestion = navigateToQuestion;
window.navigateToSearchResults = navigateToSearchResults;
window.getSearchHistory = getSearchHistory;
window.clearSearchHistory = clearSearchHistory;
window.searchWithFilters = searchWithFilters;
window.getSuggestionsByCategory = getSuggestionsByCategory;
window.getSuggestionsByKeywords = getSuggestionsByKeywords;
window.TrendingSearches = TrendingSearches;

console.log("✅ Search Module - All functions initialized");
