<<<<<<< HEAD
### Project Overview

This PR completes the **“DOM Manipulation, Web Storage, and Working with JSON Data”** project.  
It implements a **Dynamic Quote Generator** that demonstrates advanced JavaScript concepts, including:

- **Advanced DOM Manipulation** — Dynamic creation, modification, and event-driven UI updates.
- **Web Storage** — Persistent data handling using `localStorage` and `sessionStorage`.
- **JSON Handling** — Importing and exporting quote data as JSON files.
- **Filtering System** — Category-based quote filtering with persistent user preferences.
- **Server Sync Simulation** — Fetching and merging mock data from a simulated API with conflict resolution.

---

### Key Functionalities
✅ Add, edit, delete quotes dynamically  
✅ Save quotes across sessions with `localStorage`  
✅ Store last viewed quote in `sessionStorage`  
✅ Import and export quotes in JSON format  
✅ Filter quotes by category and persist filter  
✅ Simulate server sync and handle conflicts  
✅ Notification feedback and keyboard shortcuts (press **N** for a new quote)

---

### Files Added
| File | Purpose |
|------|----------|
| `index.html` | Base structure of the quote generator UI |
| `styles.css` | Styling for layout, buttons, and components |
| `script.js` | Main JavaScript logic with DOM manipulation, storage, and sync |
| `README.md` | Documentation and testing guide |

---

### Testing Summary
| Feature | Expected Outcome |
|----------|------------------|
| Add Quote | Adds a quote and saves to localStorage |
| Delete/Edit Quote | Updates and re-renders dynamically |
| Export JSON | Downloads quotes.json |
| Import JSON | Restores quotes from uploaded file |
| Filter Quotes | Displays only quotes from selected category |
| Sync | Fetches sample data and merges with local quotes |
| Notifications | Displays success/error messages clearly |
| Keyboard Shortcut | Press “N” to show a new random quote |

---

### Author
👩🏽‍💻 **Asenathi Sotshintshi**  
ALX Front-End Development Project — *DOM Manipulation, Web Storage, and JSON Data Handling*
=======
# Dynamic Quote Generator

**Author:** Asenathi Sotshintshi

## Overview
A web app demonstrating **advanced DOM manipulation**, **web storage (localStorage & sessionStorage)**, **JSON import/export**, **category filtering**, and a **simulated server sync** with simple conflict resolution.

## Features
✅ Add, edit, and delete quotes dynamically  
✅ Persist quotes to `localStorage`  
✅ Store last shown quote in `sessionStorage`  
✅ Import and export quotes as JSON  
✅ Filter quotes by category with saved selection  
✅ Simulated server sync using JSONPlaceholder (server-wins policy)  
✅ Notifications and keyboard shortcut (press **N** for new quote)

## How to run
1. Clone your repo or open the `dom-manipulation` folder.
2. Open `index.html` in your browser.
3. Test adding, exporting, importing, filtering, and syncing quotes.

## Testing
| Feature | Expected Result |
|----------|-----------------|
| Add Quote | Appears in list and persists after reload |
| Delete Quote | Removed from list and localStorage |
| Export/Import | Exports JSON and restores quotes |
| Filter | Shows only selected category and persists |
| Sync | Fetches mock quotes and merges them (server wins) |
| Keyboard Shortcut | Press `N` to show a random quote |

## Conflict Resolution
When syncing, if a quote already exists locally, the **server version replaces it** (“server wins”). A notification displays how many conflicts were resolved.
>>>>>>> 1c48e5f2ab2b8035f3a0a4cf8bb4ce330e20384b

