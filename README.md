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

