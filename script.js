// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categorySelect = document.getElementById('categorySelect');

// Initial quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" }
];

// Function to update category dropdown dynamically
function updateCategories() {
  const categories = ["All", ...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

// Function to display a random quote
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "All"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category yet!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" <span class="category">— ${quote.category}</span>`;
}

// Function to add a new quote dynamically
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill out both fields.");
    return;
  }

  quotes.push({ text, category });
  updateCategories();

  newQuoteText.value = '';
  newQuoteCategory.value = '';

  quoteDisplay.textContent = "✅ New quote added!";
  setTimeout(displayRandomQuote, 1500);
}

// Event listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Initialize categories on page load
updateCategories();
