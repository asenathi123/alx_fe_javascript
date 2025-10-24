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

