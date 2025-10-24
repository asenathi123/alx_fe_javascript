// Full implementation: Tasks 0 -> 4
// Constants & DOM refs
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quotesList = document.getElementById('quotesList');
const categoryFilter = document.getElementById('categoryFilter');
const lastShownEl = document.getElementById('lastShown');
const exportJsonBtn = document.getElementById('exportJson');
const importFileInput = document.getElementById('importFile');
const clearAllBtn = document.getElementById('clearAll');
const syncNowBtn = document.getElementById('syncNow');
const manualMergeBtn = document.getElementById('manualMerge');
const sessionInfo = document.getElementById('sessionInfo');

const LS_KEY = 'dqg_quotes_v1';
const LS_FILTER_KEY = 'dqg_last_filter';
const SESSION_LAST_SHOWN = 'dqg_session_last';
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

let quotes = [];

// helper id
function genId(){ return 'q_' + Math.random().toString(36).slice(2,9); }

// seed (used if no local data)
const seed = [
  { id: genId(), text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration", updatedAt: Date.now() },
  { id: genId(), text: "Be yourself; everyone else is already taken.", category: "Life", updatedAt: Date.now() },
  { id: genId(), text: "I have not failed. I've just found 10,000 ways that won't work.", category: "Perseverance", updatedAt: Date.now() },
  { id: genId(), text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", category: "Humor", updatedAt: Date.now() }
];

// --- Storage functions (Task 1) ---
function saveQuotes(){
  localStorage.setItem(LS_KEY, JSON.stringify(quotes));
  localStorage.setItem(LS_FILTER_KEY, categoryFilter.value || 'all');
}
function loadQuotes(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){ quotes = JSON.parse(raw); }
    else { quotes = [...seed]; saveQuotes(); }
  }catch(e){
    console.error('load error', e);
    quotes = [...seed];
  }
}

// --- Rendering & UI (Task 0 + Task 2) ---
function showQuote(obj){
  quoteDisplay.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.textAlign = 'center';
  const p = document.createElement('p');
  p.textContent = obj.text;
  p.style.fontWeight = '600';
  p.style.margin = '0 0 8px 0';
  const small = document.createElement('div');
  small.className = 'muted';
  small.textContent = `Category: ${obj.category}`;
  wrap.appendChild(p); wrap.appendChild(small);
  quoteDisplay.appendChild(wrap);
  // save last shown to session
  sessionStorage.setItem(SESSION_LAST_SHOWN, JSON.stringify({ id: obj.id, at: Date.now() }));
  lastShownEl.textContent = new Date().toLocaleString();
  updateSessionInfo();
}
function showRandomQuoteFromFilter(){
  const filter = categoryFilter.value || 'all';
  const pool = (filter === 'all') ? quotes : quotes.filter(q=>q.category === filter);
  if(pool.length === 0){ quoteDisplay.textContent = 'No quotes to show for this category.'; return; }
  const obj = pool[Math.floor(Math.random()*pool.length)];
  showQuote(obj);
}
function showRandomQuote(){
  if(quotes.length===0){ quoteDisplay.textContent='No quotes.'; return; }
  const obj = quotes[Math.floor(Math.random()*quotes.length)];
  showQuote(obj);
}
function renderQuotesList(){
  quotesList.innerHTML = '';
  if(quotes.length===0){ quotesList.textContent = 'No quotes available.'; return; }
  const frag = document.createDocumentFragment();
  quotes.forEach(q=>{
    const item = document.createElement('div');
    item.className = 'quote-item';
    const t = document.createElement('div'); t.textContent = q.text;
    const meta = document.createElement('div'); meta.className='muted'; meta.style.fontSize='.85rem';
    meta.textContent = `${q.category} • updated ${new Date(q.updatedAt).toLocaleString()}`;
    const actions = document.createElement('div'); actions.style.marginTop='6px';
    const edit = document.createElement('button'); edit.textContent='Edit'; edit.className='ghost';
    edit.onclick = ()=> editQuote(q.id);
    const del = document.createElement('button'); del.textContent='Delete'; del.style.marginLeft='8px';
    del.onclick = ()=> deleteQuote(q.id);
    actions.appendChild(edit); actions.appendChild(del);
    item.appendChild(t); item.appendChild(meta); item.appendChild(actions);
    frag.appendChild(item);
  });
  quotesList.appendChild(frag);
}

// --- Categories (Task 2) ---
function getUniqueCategories(){ return Array.from(new Set(quotes.map(q=>q.category || 'Uncategorized'))).sort(); }
function populateCategories(){
  const current = categoryFilter.value || 'all';
  categoryFilter.innerHTML = '';
  const optAll = document.createElement('option'); optAll.value='all'; optAll.textContent='All Categories'; categoryFilter.appendChild(optAll);
  getUniqueCategories().forEach(cat=>{
    const o = document.createElement('option'); o.value = cat; o.textContent = cat; categoryFilter.appendChild(o);
  });
  if(getUniqueCategories().includes(current)) categoryFilter.value = current;
}

// --- Quote ops (Task 0 + Task 2 updates) ---
function addQuote(){
  const text = (newQuoteText.value || '').trim();
  const category = (newQuoteCategory.value || 'Uncategorized').trim();
  if(!text) return alert('Please enter a quote text.');
  const obj = { id: genId(), text, category, updatedAt: Date.now() };
  quotes.unshift(obj);
  saveQuotes();
  populateCategories();
  renderQuotesList();
  newQuoteText.value=''; newQuoteCategory.value='';
  showQuote(obj);
}
function editQuote(id){
  const idx = quotes.findIndex(q=>q.id===id); if(idx===-1) return;
  const q = quotes[idx];
  const newText = prompt('Edit quote text', q.text); if(newText==null) return;
  q.text = newText; q.updatedAt = Date.now();
  saveQuotes(); renderQuotesList(); populateCategories();
}
function deleteQuote(id){
  if(!confirm('Delete this quote?')) return;
  quotes = quotes.filter(q=>q.id!==id);
  saveQuotes(); populateCategories(); renderQuotesList();
}

// --- Filter function (Task 2) ---
function filterQuotes(){
  const f = categoryFilter.value;
  localStorage.setItem(LS_FILTER_KEY, f || 'all');
  if(f === 'all'){ renderQuotesList(); showRandomQuoteFromFilter(); return; }
  const pool = quotes.filter(q=>q.category === f);
  quotesList.innerHTML = '';
  if(pool.length === 0){ quotesList.textContent = 'No quotes for selected category.'; }
  else {
    const frag = document.createDocumentFragment();
    pool.forEach(q=>{
      const item = document.createElement('div'); item.className='quote-item';
      item.innerHTML = `<div>${escapeHtml(q.text)}</div><div class="muted" style="font-size:.85rem">${q.category} • updated ${new Date(q.updatedAt).toLocaleString()}</div>`;
      frag.appendChild(item);
    });
    quotesList.appendChild(frag);
  }
  if(pool.length) showQuote(pool[Math.floor(Math.random()*pool.length)]);
}

// --- Import / Export JSON (Task 1) ---
function exportToJson(){
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `quotes_export_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function importFromJsonFile(event){
  const file = event.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const imported = JSON.parse(e.target.result);
      if(!Array.isArray(imported)) throw new Error('JSON must be an array of quote objects');
      const normalized = imported.map(item => ({
        id: item.id || genId(),
        text: item.text || item.quote || '',
        category: item.category || 'Uncategorized',
        updatedAt: item.updatedAt || Date.now()
      }));
      const existingIds = new Set(quotes.map(q=>q.id));
      normalized.forEach(n => { if(!existingIds.has(n.id)) quotes.unshift(n); });
      saveQuotes(); populateCategories(); renderQuotesList(); alert('Quotes imported successfully!');
    }catch(err){ alert('Failed to import JSON: ' + err.message); }
  };
  reader.readAsText(file); event.target.value = '';
}

// --- Simulated Server Sync & Conflicts (Task 4) ---
async function simulateSync(showNotif = false){
  try{
    const res = await fetch(SERVER_URL);
    if(!res.ok) throw new Error('Server fetch failed');
    const serverDataRaw = await res.json();
    const serverQuotes = serverDataRaw.map(s => ({
      id: 'srv_' + s.id,
      text: s.title || s.body || ('Server item ' + s.id),
      category: 'Server',
      updatedAt: Date.now()
    }));
    const localIds = new Set(quotes.map(q=>q.id));
    const toAdd = serverQuotes.filter(sq => !localIds.has(sq.id));
    const conflicts = [];
    serverQuotes.forEach(sq=>{
      const local = quotes.find(q=>q.id===sq.id);
      if(local && local.text !== sq.text) conflicts.push({ local, server: sq });
    });
    conflicts.forEach(c => { const idx = quotes.findIndex(q=>q.id===c.local.id); if(idx>-1) quotes[idx] = c.server; });
    if(toAdd.length) quotes = [...toAdd, ...quotes];
    if(toAdd.length||conflicts.length){ saveQuotes(); populateCategories(); renderQuotesList(); }
    if(showNotif) showSyncNotification(toAdd.length, conflicts.length);
    return { added: toAdd.length, conflicts: conflicts.length };
  }catch(err){
    if(showNotif) showSyncError(err.message);
    throw err;
  }
}
function showSyncNotification(added, conflicts){
  alert(`Sync complete — added ${added} server items${conflicts?(', resolved ' + conflicts + ' conflict(s) (server wins).'):''}`);
}
function showSyncError(msg){ alert('Sync failed: ' + msg); }
function manualMerge(){ simulateSync(true).then(res=>{ if(res.conflicts>0){ if(confirm('Conflicts auto-resolved in favor of server. Review list?')){} } }).catch(()=>{}); }

// --- Utilities ---
function escapeHtml(s){ return String(s).replace(/[&<>\"]+/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;' })[c]||c); }
function restoreFilter(){ const saved = localStorage.getItem(LS_FILTER_KEY) || 'all'; categoryFilter.value = saved; }
function updateSessionInfo(){ const s = sessionStorage.getItem(SESSION_LAST_SHOWN); if(s){ try{ const obj=JSON.parse(s); sessionInfo.textContent = `Last shown id ${obj.id} at ${new Date(obj.at).toLocaleString()}`;}catch(e){ sessionInfo.textContent='—'; } } else sessionInfo.textContent='—'; }

// --- Event handlers ---
function attachEventHandlers(){
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  exportJsonBtn.addEventListener('click', exportToJson);
  importFileInput.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', ()=>{ filterQuotes(); saveQuotes(); });
  clearAllBtn.addEventListener('click', ()=>{ if(confirm('Clear all local quotes?')){ localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_FILTER_KEY); quotes=[]; populateCategories(); renderQuotesList(); quoteDisplay.textContent='Local storage cleared.'; }});
  syncNowBtn.addEventListener('click', ()=>simulateSync(true));
  manualMergeBtn.addEventListener('click', manualMerge);
  document.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='n') showRandomQuote(); });
}

// --- Initialization ---
function init(){
  loadQuotes();
  populateCategories();
  renderQuotesList();
  restoreFilter();
  attachEventHandlers();
  // show a quote respecting filter
  const f = categoryFilter.value || 'all';
  if(f==='all') showRandomQuote(); else showRandomQuoteFromFilter();
  updateSessionInfo();
  // optional periodic sync (commented to avoid noisy requests)
  // setInterval(()=>simulateSync(false).catch(()=>{}), 60000);
}

init();

// Expose some functions for debugging in console
window._dqg = { addQuote, showRandomQuote, simulateSync, exportToJson };
