/* =====================================
Tahaffuz-E-Iman Library
Book Viewer Module V2.0
Complete PDF & Book Viewing System
===================================== */

console.log("📚 Book Viewer Module Loaded");

/* =====================================
BOOK VIEWER STATE
===================================== */
const BookViewer = {
  currentBook: null,
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  
  /* ===== Initialize Book Viewer ===== */
  init: function() {
    this.attachEventListeners();
    this.checkForPDF();
  },
  
  /* ===== Attach Event Listeners ===== */
  attachEventListeners: function() {
    const pdfOpen = document.getElementById("pdfOpen");
    const pdfDownload = document.getElementById("pdfDownload");
    const pdfPrev = document.getElementById("pdfPrev");
    const pdfNext = document.getElementById("pdfNext");
    
    if (pdfOpen) {
      pdfOpen.addEventListener("click", () => this.openPDF());
    }
    
    if (pdfDownload) {
      pdfDownload.addEventListener("click", () => this.downloadPDF());
    }
    
    if (pdfPrev) {
      pdfPrev.addEventListener("click", () => this.previousPage());
    }
    
    if (pdfNext) {
      pdfNext.addEventListener("click", () => this.nextPage());
    }
  },
  
  /* ===== Check for PDF in Question ===== */
  checkForPDF: function() {
    // This will be called from question.js with actual PDF data
    const pdfSection = document.getElementById("pdfSection");
    if (!pdfSection || !this.currentBook) {
      if (pdfSection) {
        pdfSection.style.display = "none";
      }
    }
  },
  
  /* ===== Load PDF ===== */
  loadPDF: function(pdfUrl) {
    this.isLoading = true;
    this.currentBook = pdfUrl;
    
    const viewer = document.getElementById("pdfViewer");
    if (!viewer) return;
    
    // Set iframe src
    viewer.src = pdfUrl;
    
    // Show the section
    const pdfSection = document.getElementById("pdfSection");
    if (pdfSection) {
      pdfSection.style.display = "block";
    }
    
    this.isLoading = false;
    console.log("📄 PDF loaded:", pdfUrl);
  },
  
  /* ===== Open PDF in New Tab ===== */
  openPDF: function() {
    if (!this.currentBook) {
      console.warn("No PDF loaded");
      return;
    }
    
    window.open(this.currentBook, "_blank");
    
    // Track event
    if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
      window.TahaffuzUtils.Analytics.track("pdf_opened", {
        pdf: this.currentBook
      });
    }
  },
  
  /* ===== Download PDF ===== */
  downloadPDF: function() {
    if (!this.currentBook) {
      console.warn("No PDF to download");
      return;
    }
    
    const link = document.createElement("a");
    link.href = this.currentBook;
    link.download = this.getPDFFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track event
    if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
      window.TahaffuzUtils.Analytics.track("pdf_downloaded", {
        pdf: this.currentBook
      });
    }
    
    console.log("⬇️ PDF download started");
  },
  
  /* ===== Get PDF Filename ===== */
  getPDFFilename: function() {
    if (!this.currentBook) return "document.pdf";
    
    const url = new URL(this.currentBook, window.location.origin);
    const pathname = url.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    
    return filename || "tahaffuz-iman-document.pdf";
  },
  
  /* ===== Previous Page ===== */
  previousPage: function() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageInfo();
    }
  },
  
  /* ===== Next Page ===== */
  nextPage: function() {
    this.currentPage++;
    this.updatePageInfo();
  },
  
  /* ===== Update Page Info Display ===== */
  updatePageInfo: function() {
    const pageInfo = document.getElementById("pdfPageInfo");
    if (pageInfo) {
      pageInfo.textContent = `Page ${this.currentPage}`;
    }
  },
  
  /* ===== Set Total Pages ===== */
  setTotalPages: function(total) {
    this.totalPages = total;
  }
};

/* =====================================
ADVANCED PDF VIEWER WITH PDF.JS
This is an advanced implementation using Mozilla's PDF.js
Uncomment to use with actual PDF.js library
===================================== */

/*
const AdvancedPDFViewer = {
  pdfdoc: null,
  pageNum: 1,
  pageRendering: false,
  pageNumPending: null,
  scale: 1.5,
  
  renderPage: function(num) {
    this.pageRendering = true;
    this.pdfdoc.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = document.getElementById('pdf-canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      page.render(renderContext).promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
      });
    });

    document.getElementById('page_num').textContent = num;
  },

  queuePage: function(num) {
    if (num < 1 || num > this.pdfdoc.numPages) {
      return;
    }
    this.pageNumPending = num;
    if (!this.pageRendering) {
      this.renderPage(num);
    }
  },

  prevPage: function() {
    this.queuePage(this.pageNum - 1);
    this.pageNum--;
  },

  nextPage: function() {
    this.queuePage(this.pageNum + 1);
    this.pageNum++;
  },

  init: function(pdfPath) {
    pdfjsLib.getDocument(pdfPath).promise.then((pdf) => {
      this.pdfdoc = pdf;
      document.getElementById('page_count').textContent = pdf.numPages;
      this.renderPage(this.pageNum);
    });
  }
};
*/

/* =====================================
BOOK REFERENCE HANDLER
===================================== */
const BookReference = {
  /* ===== Open Book Reference ===== */
  openReference: function(referenceId, bookId) {
    console.log(`Opening reference: ${referenceId} from book: ${bookId}`);
    
    // Track event
    if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
      window.TahaffuzUtils.Analytics.track("book_reference_opened", {
        reference_id: referenceId,
        book_id: bookId
      });
    }
  },
  
  /* ===== View Book Scan ===== */
  viewScan: function(scanUrl, title) {
    if (!scanUrl) {
      console.warn("No scan URL provided");
      return;
    }
    
    // Use the Evidence Viewer Modal
    if (window.openEvidenceViewer) {
      window.openEvidenceViewer(scanUrl, title);
    }
  },
  
  /* ===== View Highlight ===== */
  viewHighlight: function(highlightUrl, title) {
    if (!highlightUrl) {
      console.warn("No highlight URL provided");
      return;
    }
    
    // Use the Evidence Viewer Modal
    if (window.openEvidenceViewer) {
      window.openEvidenceViewer(highlightUrl, title);
    }
  },
  
  /* ===== Download Book PDF ===== */
  downloadBook: function(pdfUrl, bookName) {
    if (!pdfUrl) {
      console.warn("No PDF URL provided");
      return;
    }
    
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${bookName || "book"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`⬇️ Book downloaded: ${bookName}`);
    
    // Track event
    if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
      window.TahaffuzUtils.Analytics.track("book_downloaded", {
        book_name: bookName
      });
    }
  }
};

/* =====================================
BOOK SEARCH & CATALOG
===================================== */
const BookCatalog = {
  books: [],
  
  /* ===== Initialize Catalog ===== */
  init: async function() {
    try {
      const response = await fetch("database/books/books-index.json");
      if (response.ok) {
        this.books = await response.json();
        console.log(`📚 Book catalog loaded: ${this.books.length} books`);
      }
    } catch (error) {
      console.error("Failed to load book catalog:", error);
    }
  },
  
  /* ===== Search Books ===== */
  search: function(query) {
    const lowerQuery = query.toLowerCase();
    return this.books.filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      (book.description && book.description.toLowerCase().includes(lowerQuery))
    );
  },
  
  /* ===== Get Book by ID ===== */
  getBook: function(bookId) {
    return this.books.find(book => book.id === bookId);
  },
  
  /* ===== Get Books by Category ===== */
  getByCategory: function(category) {
    return this.books.filter(book => book.category === category);
  },
  
  /* ===== Get Books by Author ===== */
  getByAuthor: function(author) {
    return this.books.filter(book => book.author === author);
  }
};

/* =====================================
BOOKMARK & READING PROGRESS
===================================== */
const Bookmarks = {
  storageKey: "tahaffuz_bookmarks",
  
  /* ===== Get All Bookmarks ===== */
  getAll: function() {
    if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
      return window.TahaffuzUtils.Storage.get(this.storageKey) || [];
    }
    return [];
  },
  
  /* ===== Add Bookmark ===== */
  add: function(questionId, bookId, page, note = "") {
    const bookmarks = this.getAll();
    const bookmark = {
      id: Date.now(),
      questionId,
      bookId,
      page,
      note,
      createdAt: new Date().toISOString()
    };
    
    bookmarks.push(bookmark);
    
    if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
      window.TahaffuzUtils.Storage.set(this.storageKey, bookmarks);
    }
    
    console.log("🔖 Bookmark added");
    return bookmark;
  },
  
  /* ===== Remove Bookmark ===== */
  remove: function(bookmarkId) {
    const bookmarks = this.getAll();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    
    if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
      window.TahaffuzUtils.Storage.set(this.storageKey, filtered);
    }
    
    console.log("🔖 Bookmark removed");
  },
  
  /* ===== Get Bookmarks for Question ===== */
  getForQuestion: function(questionId) {
    return this.getAll().filter(b => b.questionId === questionId);
  }
};

/* =====================================
READING PROGRESS TRACKER
===================================== */
const ReadingProgress = {
  storageKey: "tahaffuz_reading_progress",
  
  /* ===== Save Progress ===== */
  saveProgress: function(questionId, progress) {
    const progressData = {
      questionId,
      progress,
      lastUpdated: new Date().toISOString()
    };
    
    if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
      const allProgress = window.TahaffuzUtils.Storage.get(this.storageKey) || {};
      allProgress[questionId] = progressData;
      window.TahaffuzUtils.Storage.set(this.storageKey, allProgress);
    }
  },
  
  /* ===== Get Progress ===== */
  getProgress: function(questionId) {
    if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
      const allProgress = window.TahaffuzUtils.Storage.get(this.storageKey) || {};
      return allProgress[questionId];
    }
    return null;
  }
};

/* =====================================
INITIALIZATION
===================================== */
document.addEventListener("DOMContentLoaded", () => {
  BookViewer.init();
  BookCatalog.init();
  console.log("✅ Book Viewer systems initialized");
});

/* =====================================
EXPORT FOR GLOBAL USE
===================================== */
window.BookViewer = BookViewer;
window.BookReference = BookReference;
window.BookCatalog = BookCatalog;
window.Bookmarks = Bookmarks;
window.ReadingProgress = ReadingProgress;

// Global function for opening book references
window.openBookReference = function(referenceId, bookId) {
  BookReference.openReference(referenceId, bookId);
};

// Global function for viewing scans
window.viewBookScan = function(scanUrl, title) {
  BookReference.viewScan(scanUrl, title);
};

// Global function for viewing highlights
window.viewBookHighlight = function(highlightUrl, title) {
  BookReference.viewHighlight(highlightUrl, title);
};

// Global function for downloading books
window.downloadBook = function(pdfUrl, bookName) {
  BookReference.downloadBook(pdfUrl, bookName);
};

console.log("🌟 Book Viewer Module - All functions exported globally");
