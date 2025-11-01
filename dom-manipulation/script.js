// Quotes array with some initial quotes
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "If you want something done right, do it yourself.", category: "advice" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

// Utility: get unique categories from quotes
function getCategories() {
  const set = new Set(quotes.map(q => q.category));
  return Array.from(set).sort();
}

// Populate category select
function populateCategories() {
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

// Show a random quote based on selected category
function showRandomQuote() {
  const select = document.getElementById('categorySelect');
  const chosen = select.value;
  const pool = chosen === 'all' ? quotes : quotes.filter(q => q.category === chosen);
  const displayText = document.getElementById('quoteText');
  const displayCategory = document.getElementById('quoteCategory');

  if (pool.length === 0) {
    displayText.textContent = 'No quotes available for this category.';
    displayCategory.textContent = '';
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  const q = pool[idx];
  displayText.textContent = `"${q.text}"`;
  displayCategory.textContent = `Category: ${q.category}`;
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

  if (!text) {
    alert('Please enter a quote.');
    return;
  }
  if (!category) {
    alert('Please enter a category.');
    return;
  }

  quotes.push({ text, category });
  textEl.value = '';
  catEl.value = '';

  // update categories and show the newly added quote
  populateCategories();
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