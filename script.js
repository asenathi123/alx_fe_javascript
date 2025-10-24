// =============== Dynamic Quote Generator ===============

// Constants
const STORAGE_KEY = "dqg_quotes_v1";
const FILTER_KEY = "dqg_selected_category";
const LAST_SHOWN_KEY = "dqg_last_quote";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";

let quotes = [];
let filteredCategory = "all";

// DOM elements
const quoteText = document.getElementById("quoteText");
const quoteCategory = document.getElementById("quoteCategory");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const quoteForm = document.getElementById("quoteForm");
const quoteInput = document.getElementById("quoteInput");
const categoryInput = document.getElementById("categoryInput");
const quoteList = document.getElementById("quoteList");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const clearBtn = document.getElementById("clearBtn");
const syncBtn = document.getElementById("syncBtn");
const notification = document.getElementById("notification");

// =============== Helpers ===============
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) quotes = JSON.parse(saved);
}

function showNotification(msg, color = "#4caf50") {
  notification.textContent = msg;
  notification.style.background = color;
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 3000);
}

// =============== Quote Display ===============
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteText.textContent = "No quotes available. Add one!";
    quoteCategory.textContent = "";
    return;
  }

  const available =
    filteredCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === filteredCategory);

  const random = available[Math.floor(Math.random() * available.length)];
  quoteText.textContent = `"${random.text}"`;
  quoteCategory.textContent = `— ${random.category}`;

  sessionStorage.setItem(LAST_SHOWN_KEY, JSON.stringify(random));
}

// =============== DOM Updates ===============
function renderQuotes() {
  quoteList.innerHTML = "";
  const filtered =
    filteredCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === filteredCategory);

  filtered.forEach((q, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>"${q.text}" — <em>${q.category}</em></span>
      <div>
        <button onclick="editQuote(${index})">Edit</button>
        <button onclick="deleteQuote(${index})">Delete</button>
      </div>`;
    quoteList.appendChild(li);
  });

  updateFilterOptions();
}

function updateFilterOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === filteredCategory) opt.selected = true;
    categoryFilter.appendChild(opt);
  });
  localStorage.setItem(FILTER_KEY, filteredCategory);
}

// =============== Actions ===============
quoteForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim();
  if (!text || !category) return;

  quotes.unshift({ text, category });
  saveQuotes();
  renderQuotes();
  showRandomQuote();
  quoteForm.reset();
});

function deleteQuote(index) {
  quotes.splice(index, 1);
  saveQuotes();
  renderQuotes();
  showNotification("Quote deleted", "#f44336");
}

function editQuote(index) {
  const newText = prompt("Edit quote:", quotes[index].text);
  if (newText) {
    quotes[index].text = newText;
    saveQuotes();
    renderQuotes();
    showNotification("Quote updated");
  }
}

// =============== Import/Export ===============
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
  showNotification("Quotes exported!");
});

importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    quotes = JSON.parse(e.target.result);
    saveQuotes();
    renderQuotes();
    showRandomQuote();
    showNotification("Quotes imported!");
  };
  reader.readAsText(file);
});

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all quotes?")) {
    localStorage.removeItem(STORAGE_KEY);
    quotes = [];
    renderQuotes();
    showRandomQuote();
    showNotification("All local quotes cleared", "#f44336");
  }
});

// =============== Filter ===============
categoryFilter.addEventListener("change", e => {
  filteredCategory = e.target.value;
  renderQuotes();
  showRandomQuote();
});

// =============== Keyboard Shortcut ===============
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "n") showRandomQuote();
});

// =============== Sync Simulation ===============
syncBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(SERVER_URL);
    const serverQuotes = await res.json();
    let conflicts = 0;

    serverQuotes.forEach(sq => {
      const exists = quotes.find(q => q.text === sq.title);
      if (!exists) {
        quotes.push({ text: sq.title, category: "Server" });
      } else {
        conflicts++;
        exists.text = sq.title; // server-wins
      }
    });

    saveQuotes();
    renderQuotes();
    showNotification(
      `Synced with server. ${conflicts} conflicts resolved.`,
      "#2196f3"
    );
  } catch (err) {
    showNotification("Sync failed!", "#f44336");
  }
});

// =============== Initialize ===============
function init() {
  loadQuotes();
  filteredCategory = localStorage.getItem(FILTER_KEY) || "all";
  renderQuotes();

  const last = sessionStorage.getItem(LAST_SHOWN_KEY);
  if (last) {
    const parsed = JSON.parse(last);
    quoteText.textContent = `"${parsed.text}"`;
    quoteCategory.textContent = `— ${parsed.category}`;
  } else {
    showRandomQuote();
  }
}

init();
