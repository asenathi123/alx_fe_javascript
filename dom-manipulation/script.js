/*
 * Dynamic Quote Generator - script.js
 * 
 * This script implements a dynamic quote generator with the following features:
 * - Maintains an array of quote objects with text and category properties
 * - Displays random quotes from a selected category (or all categories)
 * - Animates quote transitions with fade-out/fade-in effects
 * - Dynamically creates and manages an "Add Quote" form in the DOM
 * - Validates user input when adding new quotes
 * - Handles edge cases like empty input and duplicate categories
 * - Persists quotes to localStorage so they survive page reloads
 * - Uses event listeners (no inline onclick attributes)
 * - Creates/modifies DOM elements programmatically
 */

// Load quotes from localStorage or use initial defaults
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored quotes:', e);
      return getDefaultQuotes();
    }
  }
  return getDefaultQuotes();
}

// Get default initial quotes spanning the required categories
function getDefaultQuotes() {
  return [
    { text: "The best way to predict the future is to invent it.", category: "inspirational" },
    { text: "Believe you can and you're halfway there.", category: "inspirational" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "In the end, we only regret the chances we didn't take.", category: "life" },
    { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", category: "humor" },
    { text: "Why don't scientists trust atoms? Because they make up everything!", category: "humor" }
  ];
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Quotes array initialized from localStorage or defaults
let quotes = loadQuotes();

// Utility: get unique categories from quotes
function getCategories() {
  const set = new Set(quotes.map(q => q.category));
  return Array.from(set).sort();
}

// Populate category select (alias for consistency with requirements)
function populateCategoryOptions() {
  populateCategories();
}

// Populate category select dropdown with current categories
function populateCategories() {
  const select = document.getElementById('categorySelect');
  // Remove all options except 'all'
  select.querySelectorAll('option:not([value="all"])').forEach(o => o.remove());
  
  getCategories().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });
}

// Show a random quote based on selected category with fade animation
function showRandomQuote() {
  const select = document.getElementById('categorySelect');
  const chosen = select.value;
  const pool = chosen === 'all' ? quotes : quotes.filter(q => q.category === chosen);
  const quoteDisplay = document.getElementById('quoteDisplay');
  const displayText = document.getElementById('quoteText');
  const displayCategory = document.getElementById('quoteCategory');

  // Handle empty pool
  if (pool.length === 0) {
    quoteDisplay.classList.add('fade-out');
    setTimeout(() => {
      displayText.textContent = 'No quotes available for this category.';
      displayCategory.textContent = '';
      quoteDisplay.classList.remove('fade-out');
      quoteDisplay.classList.add('fade-in');
    }, 500);
    return;
  }

  // Select a random quote from the pool
  const idx = Math.floor(Math.random() * pool.length);
  const q = pool[idx];

  // Fade out, update content, fade in
  quoteDisplay.classList.add('fade-out');
  
  setTimeout(() => {
    displayText.textContent = `"${q.text}"`;
    displayCategory.textContent = `Category: ${q.category}`;
    quoteDisplay.classList.remove('fade-out');
    quoteDisplay.classList.add('fade-in');
  }, 500);
}

// Create and attach the Add Quote form dynamically
function createAddQuoteForm() {
  const container = document.getElementById('addQuoteFormContainer');
  container.innerHTML = ''; // reset

  const form = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';

  const inputCategory = document.createElement('input');
  inputCategory.type = 'text';
  inputCategory.id = 'newQuoteCategory';
  inputCategory.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addBtn);

  container.appendChild(form);
}

// Add a quote to the array, validate input, and update the DOM
function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');
  const text = textEl.value.trim();
  const category = catEl.value.trim().toLowerCase();

  // Validate input
  if (!text) {
    alert('Please enter a quote.');
    return;
  }
  if (!category) {
    alert('Please enter a category.');
    return;
  }

  // Check if category is new (for updating dropdown)
  const isNewCategory = !quotes.some(q => q.category === category);

  // Add the quote to the array
  quotes.push({ text, category });
  
  // Persist to localStorage
  saveQuotes();
  
  // Clear input fields
  textEl.value = '';
  catEl.value = '';

  // Update category options if new category was added
  if (isNewCategory) {
    populateCategories();
  }
  
  // Select the new category and display the newly added quote
  document.getElementById('categorySelect').value = category;
  showRandomQuote();
}

// Init function to wire up events
function init() {
  populateCategories();
  createAddQuoteForm();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}