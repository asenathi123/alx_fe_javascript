// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Initial quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" }
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear display and create elements dynamically
  quoteDisplay.innerHTML = '';

  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement('span');
  quoteCategory.className = 'category';
  quoteCategory.textContent = ` – ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please fill out both fields before adding a quote.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  newQuoteText.value = '';
  newQuoteCategory.value = '';

  const confirmation = document.createElement('p');
  confirmation.textContent = "✅ New quote added successfully!";
  confirmation.style.color = 'green';

  quoteDisplay.innerHTML = '';
  quoteDisplay.appendChild(confirmation);

  setTimeout(() => showRandomQuote(), 1500);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
