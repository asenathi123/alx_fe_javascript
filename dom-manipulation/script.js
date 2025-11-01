/*
  Dynamic Quote Generator - script.js
  
  This script implements a dynamic quote generator with advanced DOM manipulation features:
  - Maintains an array of quote objects with text and category
  - Displays random quotes from selected category with fade animations
  - Dynamically creates and manages add-quote form
  - Persists quotes to localStorage for data persistence across page reloads
  - Handles category filtering and updates category selector dynamically
  - Uses event listeners (no inline onclick attributes)
  - Creates/modifies DOM elements programmatically
  - Validates input and handles edge cases (empty input, duplicate categories)
*/

// Load quotes from localStorage or use default initial quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to predict the future is to invent it.", category: "inspirational" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Keep smiling, because life is a beautiful thing and there's so much to smile about.", category: "inspirational" },
  { text: "Why do programmers prefer dark mode? Because light attracts bugs!", category: "humor" },
  { text: "I'm not lazy, I'm just on energy-saving mode.", category: "humor" },
  { text: "The purpose of our lives is to be happy.", category: "life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Utility: get unique categories from quotes
function getCategories() {
  const set = new Set(quotes.map(q => q.category));
  return Array.from(set).sort();
}

// Populate category select - renamed to match requirements
function populateCategoryOptions() {
  const select = document.getElementById('categorySelect');
  // remove all except 'all'
  select.querySelectorAll('option:not([value="all"])').forEach(o => o.remove());
  getCategories().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat[0].toUpperCase() + cat.slice(1);
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

  if (pool.length === 0) {
    displayText.textContent = 'No quotes available for this category.';
    displayCategory.textContent = '';
    return;
  }

  // Fade out animation
  quoteDisplay.style.opacity = '0';
  
  setTimeout(() => {
    // Select and display random quote
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    displayText.textContent = `"${q.text}"`;
    displayCategory.textContent = `Category: ${q.category}`;
    
    // Fade in animation
    quoteDisplay.style.opacity = '1';
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

// Add a quote to the array and update the DOM
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

  // Add quote to array
  quotes.push({ text, category });
  
  // Save to localStorage
  saveQuotes();
  
  // Clear input fields
  textEl.value = '';
  catEl.value = '';

  // Update categories (handles new categories automatically)
  populateCategoryOptions();
  
  // Set selector to the new category and display the quote
  document.getElementById('categorySelect').value = category;
  showRandomQuote();
}

// Init function to wire up events
function init() {
  populateCategoryOptions();
  createAddQuoteForm();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Load last selected category from localStorage if available
  const lastCategory = localStorage.getItem('lastCategory');
  if (lastCategory) {
    document.getElementById('categorySelect').value = lastCategory;
  }
  
  // Save category selection to localStorage when changed
  document.getElementById('categorySelect').addEventListener('change', function() {
    localStorage.setItem('lastCategory', this.value);
  });
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}