/**
 * Dynamic Quote Generator - script.js
 * 
 * This JavaScript file implements a dynamic quote generator with advanced DOM manipulation.
 * 
 * Key Features:
 * - Maintains an array of quote objects with text and category properties
 * - Displays random quotes based on selected category filter
 * - Animates quote transitions with fade-out/fade-in effects
 * - Dynamically creates and manages an "Add Quote" form
 * - Persists quotes to localStorage for data retention across page reloads
 * - Handles edge cases: empty input validation, duplicate category management
 * - Uses event listeners instead of inline onclick attributes
 * - Creates/modifies DOM elements programmatically without replacing innerHTML wholesale
 * 
 * Main Functions:
 * - showRandomQuote(): Displays a random quote from the selected category with animation
 * - createAddQuoteForm(): Dynamically creates the form for adding new quotes
 * - addQuote(): Validates input, updates quotes array, saves to localStorage, updates UI
 * - populateCategoryOptions(): Updates the category dropdown with available categories
 * - loadQuotes(): Loads quotes from localStorage on page load
 * - saveQuotes(): Saves quotes array to localStorage
 */

// Initial quotes array with quotes across different categories
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "inspirational" },
  { text: "Believe you can and you're halfway there.", category: "inspirational" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The purpose of our lives is to be happy.", category: "life" },
  { text: "Why do programmers prefer dark mode? Because light attracts bugs!", category: "humor" },
  { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", category: "humor" }
];

/**
 * Save quotes to localStorage
 */
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * Load quotes from localStorage
 */
function loadQuotes() {
  const saved = localStorage.getItem('quotes');
  if (saved) {
    quotes = JSON.parse(saved);
  }
}

// Utility: get unique categories from quotes
function getCategories() {
  const set = new Set(quotes.map(q => q.category));
  return Array.from(set).sort();
}

/**
 * Populate category select dropdown with available categories
 * This function is exported/global as per requirements
 */
function populateCategoryOptions() {
  const select = document.getElementById('categorySelect');
  // Remove all options except 'all'
  select.querySelectorAll('option:not([value="all"])').forEach(o => o.remove());
  
  // Add category options
  getCategories().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });
}

/**
 * Show a random quote based on selected category with fade animation
 * This function is exported/global as per requirements
 */
function showRandomQuote() {
  const select = document.getElementById('categorySelect');
  const chosen = select.value;
  const pool = chosen === 'all' ? quotes : quotes.filter(q => q.category === chosen);
  const displayText = document.getElementById('quoteText');
  const displayCategory = document.getElementById('quoteCategory');
  const quoteDisplay = document.getElementById('quoteDisplay');

  if (pool.length === 0) {
    displayText.textContent = 'No quotes available for this category.';
    displayCategory.textContent = '';
    return;
  }

  // Fade out animation
  quoteDisplay.classList.add('fade-out');
  
  // Wait for fade out, then update content and fade in
  setTimeout(() => {
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    displayText.textContent = `"${q.text}"`;
    displayCategory.textContent = `Category: ${q.category}`;
    
    // Fade in animation
    quoteDisplay.classList.remove('fade-out');
    quoteDisplay.classList.add('fade-in');
  }, 300);
}

/**
 * Create and attach the Add Quote form dynamically
 * This function is exported/global as per requirements
 */
function createAddQuoteForm() {
  const container = document.getElementById('addQuoteFormContainer');
  container.innerHTML = ''; // Reset container

  const form = document.createElement('div');

  // Create text input for quote
  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';

  // Create text input for category
  const inputCategory = document.createElement('input');
  inputCategory.type = 'text';
  inputCategory.id = 'newQuoteCategory';
  inputCategory.placeholder = 'Enter quote category';

  // Create add button
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = 'Add Quote';
  
  // Add event listener to button (no inline onclick)
  addBtn.addEventListener('click', addQuote);

  // Append elements to form
  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addBtn);

  // Append form to container
  container.appendChild(form);
}

/**
 * Add a quote to the array, validate input, update UI, and save to localStorage
 */
function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');
  const text = textEl.value.trim();
  const category = catEl.value.trim().toLowerCase();

  // Validate input - handle empty input edge case
  if (!text) {
    alert('Please enter a quote.');
    return;
  }
  if (!category) {
    alert('Please enter a category.');
    return;
  }

  // Check if this is a new category
  const existingCategories = getCategories();
  const isNewCategory = !existingCategories.includes(category);

  // Add quote to array
  quotes.push({ text, category });
  
  // Save to localStorage
  saveQuotes();

  // Clear input fields
  textEl.value = '';
  catEl.value = '';

  // Update categories dropdown if new category was added
  if (isNewCategory) {
    populateCategoryOptions();
  }

  // Select the new quote's category and display it
  document.getElementById('categorySelect').value = category;
  showRandomQuote();
}

/**
 * Initialize the application
 */
function init() {
  // Load quotes from localStorage
  loadQuotes();
  
  // Populate category options
  populateCategoryOptions();
  
  // Create the add quote form
  createAddQuoteForm();
  
  // Add event listener to "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Add event listener to category select for filtering
  document.getElementById('categorySelect').addEventListener('change', () => {
    // When category changes, show a quote from that category
    showRandomQuote();
  });
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}