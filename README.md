# Structured Notes Editor
Lab 2 – GUI (JavaScript, HTML, CSS)

## Overview
The project implements a simple **structured notes editor**.

Users can:
- define note schemas (templates),
- create notes based on these schemas,
- search notes,
- export and import all data as JSON.

The implementation follows the general rules for Lab 2:
- modular JavaScript code (ES modules),
- clear separation between business logic and GUI,
- at least 4 screens (Schemas, Notes, Settings, Help),
- at least 20 GUI controls (buttons, inputs, selects, checkboxes),
- at least 10 event handlers (click, submit, change, input, etc.),
- basic unit tests for the domain model and storage layer.

## Project structure

```text
project-root/
  README.md
  index.html
  styles.css

  src/
    app.js          # entry point, screen switching and settings actions
    model.js        # domain model: FieldDefinition, NoteSchema, Note, helpers
    storage.js      # localStorage data service
    ui-schema.js    # "Schemas" screen logic
    ui-notes.js     # "Notes" screen logic

  tests/
    index.html      # test runner page
    testRunner.js   # minimal test runner
    model.test.js   # unit tests for model
    storage.test.js # unit tests for storage
 ```   
## Screens

### 1. **Schemas**
- List of existing schemas  
- Editor for schema name and fields (field name + type)  
- Actions: **Add field**, **Save schema**, **Reset form**, **Delete schema**

### 2. **Notes**
- Schema selector  
- Search box for filtering notes  
- List of notes for the selected schema  
- Note editor generated dynamically based on the selected schema fields

### 3. **Settings**
- Export all data to a JSON file  
- Import data from a JSON file  
- Clear all data from `localStorage`

### 4. **Help**
- Short description of how to use each screen  
- Basic explanation for Schemas, Notes and Settings

---

## Running the application

1. Open `index.html` in any modern browser (no build step required).  
2. Go to **Schemas** and create at least one schema.  
3. Switch to **Notes**, choose the schema and create notes.  
4. Use **Settings** to export or import data when needed.

---

## Running the tests

1. Open `tests/index.html` in a browser.  
2. Open the DevTools console.  
3. The test runner will print results:
   - `✅` passed tests  
   - `❌` failed tests

---

## Technologies

- **HTML5**  
- **CSS3**  
- **JavaScript ES Modules**  
- **localStorage** (for data persistence)
