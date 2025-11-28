// src/ui-notes.js
// UI logic for the "Notes" screen: list, search and edit notes.

import { loadData, saveData } from "./storage.js";
import { createNote } from "./model.js";

let notesSchemaSelectEl;
let notesSearchInputEl;
let newNoteBtnEl;
let notesListEl;
let noteFormEl;
let deleteNoteBtnEl;
let cancelNoteBtnEl;

let appData = null;
let currentSchemaId = null;
let currentNoteId = null;

export function initNotesUI() {
    notesSchemaSelectEl = document.getElementById("notes-schema-select");
    notesSearchInputEl = document.getElementById("notes-search");
    newNoteBtnEl = document.getElementById("new-note-btn");
    notesListEl = document.getElementById("notes-list");
    noteFormEl = document.getElementById("note-form");
    deleteNoteBtnEl = document.getElementById("delete-note-btn");
    cancelNoteBtnEl = document.getElementById("cancel-note-btn");

    // Load initial data
    appData = loadData();

    // Handlers
    notesSchemaSelectEl.addEventListener("change", onSchemaSelectChange);
    notesSearchInputEl.addEventListener("input", renderNotesList);
    newNoteBtnEl.addEventListener("click", () => startNewNote());
    noteFormEl.addEventListener("submit", onNoteFormSubmit);
    deleteNoteBtnEl.addEventListener("click", onDeleteNote);
    cancelNoteBtnEl.addEventListener("click", () => startNewNote());

    // React to schema changes from schema screen
    window.addEventListener("schemas-changed", () => {
        reloadData();
        refreshSchemaOptions();
        renderNotesList();
        rebuildNoteFormFields();
    });

    refreshSchemaOptions();
    // Select first schema by default if any
    if (appData.schemas.length > 0) {
        currentSchemaId = appData.schemas[0].id;
        notesSchemaSelectEl.value = currentSchemaId;
    }

    rebuildNoteFormFields();
    renderNotesList();
}

function reloadData() {
    appData = loadData();
}

function refreshSchemaOptions() {
    notesSchemaSelectEl.innerHTML = "";

    if (!appData.schemas.length) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No schemas available";
        notesSchemaSelectEl.appendChild(opt);
        currentSchemaId = null;
        return;
    }

    appData.schemas.forEach((schema) => {
        const opt = document.createElement("option");
        opt.value = schema.id;
        opt.textContent = schema.name || "(no name)";
        notesSchemaSelectEl.appendChild(opt);
    });

    if (currentSchemaId) {
        notesSchemaSelectEl.value = currentSchemaId;
    } else {
        currentSchemaId = appData.schemas[0].id;
        notesSchemaSelectEl.value = currentSchemaId;
    }
}

function onSchemaSelectChange() {
    currentSchemaId = notesSchemaSelectEl.value || null;
    rebuildNoteFormFields();
    renderNotesList();
    startNewNote();
}

function rebuildNoteFormFields() {
    // Clear form inner content except actions (we recreate everything)
    const actions = noteFormEl.querySelector(".form-actions");
    noteFormEl.innerHTML = "";
    if (!currentSchemaId) {
        const p = document.createElement("p");
        p.textContent = "Please create a schema first.";
        noteFormEl.appendChild(p);
        if (actions) noteFormEl.appendChild(actions);
        return;
    }

    const schema = appData.schemas.find((s) => s.id === currentSchemaId);
    if (!schema) {
        const p = document.createElement("p");
        p.textContent = "Selected schema not found.";
        noteFormEl.appendChild(p);
        if (actions) noteFormEl.appendChild(actions);
        return;
    }

    // Create inputs for each field
    schema.fields.forEach((field) => {
        const label = document.createElement("label");
        label.textContent = field.name + ":";

        let input;
        if (field.type === "boolean") {
            input = document.createElement("input");
            input.type = "checkbox";
        } else if (field.type === "date") {
            input = document.createElement("input");
            input.type = "date";
        } else if (field.type === "number") {
            input = document.createElement("input");
            input.type = "number";
        } else {
            input = document.createElement("input");
            input.type = "text";
        }

        input.dataset.fieldName = field.name;
        label.appendChild(input);
        noteFormEl.appendChild(label);
    });

    // Append form actions (Save / Delete / Cancel)
    if (actions) {
        noteFormEl.appendChild(actions);
    } else {
        // in case actions were not found (should not happen)
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "form-actions";
        actionsDiv.appendChild(createButton("Save note", "submit"));
        noteFormEl.appendChild(actionsDiv);
    }
}

function createButton(text, type = "button") {
    const btn = document.createElement("button");
    btn.type = type;
    btn.textContent = text;
    return btn;
}

function renderNotesList() {
    notesListEl.innerHTML = "";

    if (!currentSchemaId) {
        const li = document.createElement("li");
        li.textContent = "No schema selected.";
        li.style.fontStyle = "italic";
        li.style.color = "#666";
        notesListEl.appendChild(li);
        return;
    }

    const allNotes = appData.notes.filter((n) => n.schemaId === currentSchemaId);
    const query = notesSearchInputEl.value.trim().toLowerCase();

    const filtered = allNotes.filter((note) => {
        if (!query) return true;
        // Simple text search over all string values
        return Object.values(note.values || {}).some((v) =>
            String(v || "").toLowerCase().includes(query)
        );
    });

    if (!filtered.length) {
        const li = document.createElement("li");
        li.textContent = "No notes found.";
        li.style.fontStyle = "italic";
        li.style.color = "#666";
        notesListEl.appendChild(li);
        return;
    }

    filtered.forEach((note) => {
        const li = document.createElement("li");
        li.dataset.id = note.id;

        const titleSpan = document.createElement("span");
        titleSpan.className = "note-title";

        // Try to guess "title" field
        const title =
            note.values.Title ||
            note.values.title ||
            note.values.Name ||
            note.values.name ||
            "(untitled note)";
        titleSpan.textContent = title;

        const metaSpan = document.createElement("span");
        metaSpan.className = "note-meta";
        metaSpan.textContent = Object.keys(note.values || {}).length + " fields";

        li.appendChild(titleSpan);
        li.appendChild(metaSpan);

        if (note.id === currentNoteId) {
            li.classList.add("selected");
        }

        li.addEventListener("click", () => {
            currentNoteId = note.id;
            loadNoteIntoForm(note);
            renderNotesList();
        });

        notesListEl.appendChild(li);
    });
}

function startNewNote() {
    currentNoteId = null;
    clearNoteFormValues();
    renderNotesList();
}

function clearNoteFormValues() {
    const inputs = noteFormEl.querySelectorAll("[data-field-name]");
    inputs.forEach((input) => {
        if (input.type === "checkbox") {
            input.checked = false;
        } else {
            input.value = "";
        }
    });
}

function loadNoteIntoForm(note) {
    const inputs = noteFormEl.querySelectorAll("[data-field-name]");
    inputs.forEach((input) => {
        const fieldName = input.dataset.fieldName;
        const value = note.values[fieldName];

        if (input.type === "checkbox") {
            input.checked = Boolean(value);
        } else {
            input.value = value ?? "";
        }
    });
}

function onNoteFormSubmit(event) {
    event.preventDefault();

    if (!currentSchemaId) {
        alert("Please select a schema first.");
        return;
    }

    const values = collectNoteValuesFromForm();

    if (currentNoteId) {
        // Update existing note
        const existing = appData.notes.find((n) => n.id === currentNoteId);
        if (existing) {
            existing.values = values;
        }
    } else {
        // Create new note
        const newNote = createNote(currentSchemaId, values);
        appData.notes.push(newNote);
        currentNoteId = newNote.id;
    }

    saveData(appData);
    renderNotesList();
}

function collectNoteValuesFromForm() {
    const inputs = noteFormEl.querySelectorAll("[data-field-name]");
    const values = {};

    inputs.forEach((input) => {
        const name = input.dataset.fieldName;
        if (!name) return;

        if (input.type === "checkbox") {
            values[name] = input.checked;
        } else {
            values[name] = input.value;
        }
    });

    return values;
}

function onDeleteNote() {
    if (!currentNoteId) {
        alert("No note is selected.");
        return;
    }

    const idx = appData.notes.findIndex((n) => n.id === currentNoteId);
    if (idx >= 0) {
        appData.notes.splice(idx, 1);
        saveData(appData);
    }

    currentNoteId = null;
    clearNoteFormValues();
    renderNotesList();
}