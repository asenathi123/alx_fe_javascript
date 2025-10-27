/* script.js
   Full implementation:
   - dynamic DOM for quotes
   - localStorage persistence
   - sessionStorage for last-viewed quote id
   - JSON import/export
   - category filtering with persisted selection
   - simulated server sync + conflict resolution (server wins)
*/

/* ---------- Configuration ---------- */
const STORAGE_KEY = 'quotes_app_quotes_v1';
const FILTER_KEY = 'quotes_app_filter_v1';
const LAST_VIEWED_KEY = 'quotes_app_last_viewed_v1'; // sessionStorage
const SERVER_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts'; // mock API for simulation
const AUTO_SYNC_INTERVAL_MS = 30000;

/* ---------- App State ---------- */
let quotes = [];
let categories = new Set();
let autoSyncTimer = null;

/* ---------- Initial Example Data ---------- */
const defaultQuotes = [
  { id: genId(), text: "The only way to do great work is to love what you do.", category: "Motivation", updatedAt: Date.now() },
  { id: genId(), text: "Simplicity is the soul of efficiency.", category: "Philosophy", updatedAt: Date.now() },
  { id: genId(), text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming", updatedAt: Date.now() },
];

/* ---------- Utilities ---------- */
function genId() {
  // simple unique id
  return 'q_' + Math.random().toString(36).slice(2, 9);
}

function nowISO() { return new Date().toISOString(); }

function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    showToast('Failed saving to localStorage: ' + e.message);
  }
}

function loadQuotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    quotes = [...defaultQuotes];
    saveQuotes();
  } else {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) quotes = parsed;
      else quotes = [...defaultQuotes];
    } catch (e) {
      console.warn('Failed to parse quotes from storage, using default. Error:', e);
      quotes = [...defaultQuotes];
    }
  }
}

function saveFilter(value) {
  localStorage.setItem(FILTER_KEY, value);
}

function loadFilter() {
  return localStorage.getItem(FILTER_KEY) || 'all';
}

function saveLastViewed(id) {
  sessionStorage.setItem(LAST_VIEWED_KEY, id);
}

function loadLastViewed() {
  return sessionStorage.getItem(LAST_VIEWED_KEY);
}

/* ---------- DOM helpers ---------- */
function $id(id) { return document.getElementById(id); }

function showToast(message, ms = 3500) {
  const t = $id('toast');
  t.textContent = message;
  t.style.display = 'block';
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(() => t.style.display = 'none', ms);
}

/* ---------- Core Features ---------- */

// Show a random quote (across all quotes or filtered)
function showRandomQuote() {
  const filter = $id('categoryFilter').value;
  const pool = filter === 'all' ? quotes : quotes.filter(q => q.category === filter);
  if (pool.length === 0) {
    $id('quoteDisplay').textContent = 'No quotes in that category yet.';
    $id('quoteMeta').textContent = '';
    return;
  }
  const q = pool[Math.floor(Math.random() * pool.length)];
  displayQuote(q);
}

// Display a given quote object in the quote card
function displayQuote(q) {
  $id('quoteDisplay').textContent = q.text;
  $id('quoteMeta').textContent = `Category: ${q.category} • Last updated: ${new Date(q.updatedAt).toLocaleString()}`;
  saveLastViewed(q.id);
  renderQuoteActions(q);
}

// Render actions for the currently displayed quote (edit/delete/copy)
function renderQuoteActions(q) {
  const container = $id('quoteActions');
  container.innerHTML = '';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'actionBtn';
  editBtn.onclick = () => editQuoteUI(q.id);
  container.appendChild(editBtn);

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'actionBtn';
  delBtn.onclick = () => { deleteQuote(q.id); };
  container.appendChild(delBtn);

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy';
  copyBtn.className = 'actionBtn';
  copyBtn.onclick = () => {
    navigator.clipboard?.writeText(q.text).then(() => showToast('Quote copied to clipboard'));
  };
  container.appendChild(copyBtn);
}

/* ---------- Manage Quotes ---------- */

function addQuote(text, category) {
  // validation
  if (!text || !text.trim()) { showToast('Quote text cannot be empty'); return null; }
  category = (category || 'Uncategorized').trim() || 'Uncategorized';
  const newQ = { id: genId(), text: text.trim(), category, updatedAt: Date.now() };
  quotes.push(newQ);
  updateCategories();
  saveQuotes();
  refreshUI();
  showToast('Quote added');
  return newQ;
}

function addQuoteFromInputs() {
  const text = $id('newQuoteText').value;
  const category = $id('newQuoteCategory').value;
  const created = addQuote(text, category);
  if (created) {
    $id('newQuoteText').value = '';
    $id('newQuoteCategory').value = '';
  }
}

function editQuoteUI(id) {
  const q = quotes.find(x => x.id === id);
  if (!q) return showToast('Quote not found');
  const newText = prompt('Edit quote text:', q.text);
  if (newText === null) return; // cancelled
  const newCat = prompt('Edit category:', q.category);
  if (newCat === null) return;
  q.text = newText.trim() || q.text;
  q.category = (newCat.trim() || q.category);
  q.updatedAt = Date.now();
  updateCategories();
  saveQuotes();
  refreshUI();
  showToast('Quote updated');
}

function deleteQuote(id) {
  const idx = quotes.findIndex(x => x.id === id);
  if (idx === -1) return showToast('Quote not found');
  if (!confirm('Delete this quote?')) return;
  quotes.splice(idx, 1);
  updateCategories();
  saveQuotes();
  refreshUI();
  showToast('Quote deleted');
}

/* ---------- Categories & Filtering ---------- */

function updateCategories() {
  categories = new Set(quotes.map(q => q.category || 'Uncategorized'));
}

function populateCategories(selected = null) {
  updateCategories();
  const sel = $id('categoryFilter');
  const prev = sel.value || 'all';
  sel.innerHTML = '';
  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'All Categories';
  sel.appendChild(allOpt);

  Array.from(categories).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });

  // try to restore persisted selection
  const saved = loadFilter();
  sel.value = selected || saved || prev;
  saveFilter(sel.value);
}

function filterQuotes() {
  const filter = $id('categoryFilter').value;
  saveFilter(filter);
  renderQuotesList();
  // If current shown quote doesn't match, optionally show a quote from that category
  const lastViewedId = loadLastViewed();
  const lastQ = quotes.find(q => q.id === lastViewedId);
  if (!lastQ || (filter !== 'all' && lastQ.category !== filter)) {
    // update display to show first matching quote or a friendly message
    const pool = (filter === 'all') ? quotes : quotes.filter(q => q.category === filter);
    if (pool.length > 0) displayQuote(pool[0]);
    else {
      $id('quoteDisplay').textContent = 'No quotes in this category yet.';
      $id('quoteMeta').textContent = '';
      $id('quoteActions').innerHTML = '';
    }
  }
}

/* ---------- UI Rendering ---------- */

function renderQuotesList() {
  const list = $id('quotesList');
  list.innerHTML = '';
  const filter = $id('categoryFilter').value || 'all';
  const filtered = (filter === 'all') ? quotes : quotes.filter(q => q.category === filter);
  filtered.slice().reverse().forEach(q => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.innerHTML = `<div><strong>${q.text}</strong></div><div class="small">${q.category} • ${new Date(q.updatedAt).toLocaleString()}</div>`;
    li.appendChild(left);

    const right = document.createElement('div');
    const showBtn = document.createElement('button');
    showBtn.textContent = 'Show';
    showBtn.onclick = () => displayQuote(q);
    right.appendChild(showBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editQuoteUI(q.id);
    right.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteQuote(q.id);
    right.appendChild(delBtn);

    li.appendChild(right);
    list.appendChild(li);
  });
}

function refreshUI() {
  populateCategories();
  renderQuotesList();
  // restore last viewed (session) if exists
  const lastViewedId = loadLastViewed();
  const q = quotes.find(x => x.id === lastViewedId) || quotes[0];
  if (q) displayQuote(q);
}

/* ---------- JSON Import / Export ---------- */

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Exported quotes.json');
}

function importFromJsonFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('JSON must be an array of quotes');
      // Normalize imported items and merge - avoid duplicates by text+category
      const existingPairs = new Set(quotes.map(q => q.text + '||' + q.category));
      let added = 0;
      imported.forEach(item => {
        if (!item.text) return;
        const cat = item.category || 'Uncategorized';
        const key = item.text + '||' + cat;
        if (!existingPairs.has(key)) {
          quotes.push({ id: genId(), text: item.text, category: cat, updatedAt: Date.now() });
          existingPairs.add(key);
          added++;
        }
      });
      saveQuotes();
      refreshUI();
      showToast(`Imported ${added} new quotes`);
    } catch (err) {
      showToast('Import failed: ' + err.message);
    } finally {
      // reset the file input so same file can be reselected
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

/* ---------- Sync with Server (Simulation) ---------- */

/*
 Strategy:
  - Fetch a list of "server" quotes (simulated using jsonplaceholder posts)
  - Map them to our shape { id, text, category, updatedAt }
  - Merge: If server contains an item with same id, server wins (server takes precedence)
  - For items that exist only locally, optionally POST them (simulation)
  - Show UI notification on conflicts, and allow "force keep local" via a button in toast
*/

async function simulateFetchServerQuotes() {
  // fetch a few posts and map them
  try {
    const res = await fetch(SERVER_ENDPOINT + '?_limit=5'); // simulate a small dataset
    if (!res.ok) throw new Error('Failed to fetch server data');
    const data = await res.json();
    // Map server items to quote shape; use post.title as category (toy mapping)
    return data.map(p => ({
      id: 'srv_' + p.id,
      text: p.body || p.title || `Server quote ${p.id}`,
      category: p.title?.split(' ')[0] || 'Server',
      updatedAt: Date.now() - Math.floor(Math.random() * 1000000) // random older-ish timestamp
    }));
  } catch (e) {
    console.error('Server fetch error:', e);
    throw e;
  }
}

async function syncWithServer() {
  showToast('Sync started...');
  try {
    const serverQuotes = await simulateFetchServerQuotes();

    // Build lookup
    const localById = new Map(quotes.map(q => [q.id, q]));
    const serverById = new Map(serverQuotes.map(s => [s.id, s]));

    // Conflicts where local and server have same id (unlikely unless IDs match) - server wins
    let conflicts = 0;
    serverQuotes.forEach(sq => {
      if (localById.has(sq.id)) {
        // conflict resolution strategy: server wins
        const local = localById.get(sq.id);
        if (local.text !== sq.text || local.category !== sq.category) {
          conflicts++;
          // Replace local with server version
          const idx = quotes.findIndex(x => x.id === local.id);
          if (idx !== -1) quotes[idx] = { ...sq, updatedAt: Date.now() };
        }
      } else {
        // Add server-only quote to local store
        quotes.push({ ...sq, updatedAt: Date.now() });
      }
    });

    // Optionally: post local-only quotes to server (simulation only)
    // We'll POST only up to 3 to avoid overload
    const serverIds = new Set(serverQuotes.map(s => s.id));
    const localOnly = quotes.filter(q => q.id && !q.id.startsWith('srv_') && !serverIds.has(q.id)).slice(0,3);
    for (const lq of localOnly) {
      // simulate POST - we won't actually use returned id for merge to keep server as source-of-truth
      try {
        await fetch(SERVER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: lq.category, body: lq.text })
        });
      } catch (e) {
        console.warn('Failed to post local-only quote to server (simulated):', e);
      }
    }

    saveQuotes();
    refreshUI();

    if (conflicts > 0) {
      // Offer user ability to restore local in case server-wins removed something they prefer
      showToast(`${conflicts} conflict(s) resolved (server version used). Click to keep local instead.`, 8000);
      // add quick "Keep Local" button in the toast area
      const t = $id('toast');
      const keepBtn = document.createElement('button');
      keepBtn.textContent = 'Keep Local';
      keepBtn.style.marginLeft = '10px';
      keepBtn.onclick = () => {
        // naive "keep local" strategy: we reload from backup if we had one. For demo, we'll re-run restoreLocalBackup if available
        restoreLocalBackup();
      };
      t.appendChild(keepBtn);

      // create a shallow backup when conflicts happen to allow restore
      saveLocalBackup();
    } else {
      showToast('Sync complete — no conflicts.');
    }
  } catch (err) {
    showToast('Sync failed: ' + (err.message || err));
  }
}

/* Backup/restore for manual conflict resolution (very simple) */
function saveLocalBackup() {
  try {
    localStorage.setItem(STORAGE_KEY + '_backup', JSON.stringify(quotes));
    showToast('Local backup saved for conflict recovery', 2000);
  } catch (e) {
    console.warn('Backup failed', e);
  }
}

function restoreLocalBackup() {
  const raw = localStorage.getItem(STORAGE_KEY + '_backup');
  if (!raw) { showToast('No backup available'); return; }
  try {
    quotes = JSON.parse(raw);
    saveQuotes();
    refreshUI();
    showToast('Local backup restored');
  } catch (e) {
    showToast('Restore failed: ' + e.message);
  }
}

/* ---------- Initialization & Event Wiring ---------- */

function wireEvents() {
  $id('newQuote').addEventListener('click', showRandomQuote);
  $id('randomByCategory').addEventListener('click', () => {
    const filter = $id('categoryFilter').value;
    const pool = (filter === 'all') ? quotes : quotes.filter(q => q.category === filter);
    if (pool.length === 0) { showToast('No quotes in this category'); return; }
    const q = pool[Math.floor(Math.random()*pool.length)];
    displayQuote(q);
  });
  $id('addQuoteBtn').addEventListener('click', addQuoteFromInputs);
  $id('categoryFilter').addEventListener('change', filterQuotes);
  $id('exportJson').addEventListener('click', exportToJsonFile);
  $id('importFile').addEventListener('change', importFromJsonFile);
  $id('clearAll').addEventListener('click', () => {
    if (!confirm('Clear all local quotes? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    loadQuotes();
    refreshUI();
    showToast('Local quotes cleared (defaults restored)');
  });
  $id('syncBtn').addEventListener('click', syncWithServer);
  $id('autoSync').addEventListener('change', function() {
    if (this.checked) startAutoSync();
    else stopAutoSync();
  });

  // restore last viewed on load
  window.addEventListener('beforeunload', () => {
    // save current state if needed
    saveQuotes();
  });
}

function startAutoSync() {
  stopAutoSync();
  autoSyncTimer = setInterval(() => {
    syncWithServer();
  }, AUTO_SYNC_INTERVAL_MS);
  showToast('Auto-sync enabled');
}

function stopAutoSync() {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer);
    autoSyncTimer = null;
    showToast('Auto-sync disabled', 1200);
  }
}

/* ---------- Backwards-compat / First run ---------- */
function ensureIds() {
  // Make sure previous stored quotes have an id and updatedAt
  let changed = false;
  quotes.forEach(q => {
    if (!q.id) { q.id = genId(); changed = true; }
    if (!q.updatedAt) { q.updatedAt = Date.now(); changed = true; }
    if (!q.category) { q.category = 'Uncategorized'; changed = true; }
  });
  if (changed) saveQuotes();
}

/* ---------- App start ---------- */
function init() {
  loadQuotes();
  ensureIds();
  wireEvents();
  populateCategories();
  // restore filter selection
  $id('categoryFilter').value = loadFilter();
  refreshUI();
  // restore last viewed quote from session
  const lastViewedId = loadLastViewed();
  if (lastViewedId) {
    const q = quotes.find(x => x.id === lastViewedId);
    if (q) displayQuote(q);
  }
  showToast('Ready — quote generator initialized', 1200);
}

// Start app
init();

