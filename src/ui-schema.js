// src/ui-schema.js
// UI logic for the "Schemas" screen: create, edit and delete schemas.

import { FIELD_TYPES, FieldDefinition, createSchema } from "./model.js";
import { loadData, saveData } from "./storage.js";

let appData = null;
let selectedSchemaId = null;

// DOM references
let schemaListEl;
let schemaFormEl;
let schemaNameInput;
let fieldsContainerEl;
let addFieldBtn;
let resetSchemaBtn;
let deleteSchemaBtn;

export function initSchemaUI() {
    // Load initial data from storage
    appData = loadData();

    // Get DOM elements
    schemaListEl = document.getElementById("schema-list");
    schemaFormEl = document.getElementById("schema-form");
    schemaNameInput = document.getElementById("schema-name");
    fieldsContainerEl = document.getElementById("fields-container");
    addFieldBtn = document.getElementById("add-field-btn");
    resetSchemaBtn = document.getElementById("reset-schema-btn");
    deleteSchemaBtn = document.getElementById("delete-schema-btn");

    // Attach handlers
    addFieldBtn.addEventListener("click", () => addFieldRow());
    resetSchemaBtn.addEventListener("click", () => resetForm());
    deleteSchemaBtn.addEventListener("click", () => onDeleteSchema());
    schemaFormEl.addEventListener("submit", onSchemaFormSubmit);

    renderSchemaList();
    resetForm(); // start with empty form
}

function renderSchemaList() {
    schemaListEl.innerHTML = "";

    if (!appData.schemas.length) {
        const li = document.createElement("li");
        li.textContent = "No schemas yet";
        li.style.fontStyle = "italic";
        li.style.color = "#666";
        schemaListEl.appendChild(li);
        return;
    }

    appData.schemas.forEach((schema) => {
        const li = document.createElement("li");
        li.dataset.id = schema.id;

        const nameSpan = document.createElement("span");
        nameSpan.className = "schema-name";
        nameSpan.textContent = schema.name || "(no name)";

        const metaSpan = document.createElement("span");
        metaSpan.className = "schema-meta";
        metaSpan.textContent = `${schema.fields?.length || 0} fields`;

        li.appendChild(nameSpan);
        li.appendChild(metaSpan);

        if (schema.id === selectedSchemaId) {
            li.classList.add("selected");
        }

        li.addEventListener("click", () => {
            selectedSchemaId = schema.id;
            loadSchemaIntoForm(schema);
            renderSchemaList();
        });

        schemaListEl.appendChild(li);
    });
}

function loadSchemaIntoForm(schema) {
    schemaNameInput.value = schema.name || "";
    fieldsContainerEl.innerHTML = "";

    (schema.fields || []).forEach((field) => {
        addFieldRow(field.name, field.type);
    });
}

function resetForm() {
    selectedSchemaId = null;
    schemaNameInput.value = "";
    fieldsContainerEl.innerHTML = "";
    // Start with one empty field row
    addFieldRow();
    renderSchemaList();
}

function addFieldRow(name = "", type = "text") {
    const row = document.createElement("div");
    row.className = "field-row";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Field name";
    nameInput.value = name;

    const typeSelect = document.createElement("select");
    FIELD_TYPES.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        if (t === type) opt.selected = true;
        typeSelect.appendChild(opt);
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "X";
    removeBtn.addEventListener("click", () => {
        row.remove();
    });

    row.appendChild(nameInput);
    row.appendChild(typeSelect);
    row.appendChild(removeBtn);

    fieldsContainerEl.appendChild(row);
}

function onSchemaFormSubmit(event) {
    event.preventDefault();

    const name = schemaNameInput.value.trim();
    if (!name) {
        alert("Schema name is required.");
        return;
    }

    const fields = collectFieldsFromForm();
    if (!fields.length) {
        alert("Schema must have at least one field.");
        return;
    }

    if (selectedSchemaId) {
        // Update existing schema
        const existing = appData.schemas.find((s) => s.id === selectedSchemaId);
        if (existing) {
            existing.name = name;
            existing.fields = fields;
        }
    } else {
        // Create new schema
        const newSchema = createSchema(name, fields);
        appData.schemas.push(newSchema);
        selectedSchemaId = newSchema.id;
    }

    saveData(appData);
    renderSchemaList();
    notifySchemasChanged();
}

function collectFieldsFromForm() {
    const rows = Array.from(fieldsContainerEl.querySelectorAll(".field-row"));
    const result = [];

    for (const row of rows) {
        const nameInput = row.querySelector("input[type='text']");
        const typeSelect = row.querySelector("select");

        const fieldName = nameInput.value.trim();
        const fieldType = typeSelect.value;

        if (!fieldName) {
            // Skip empty field rows
            continue;
        }

        const fieldDef = new FieldDefinition(fieldName, fieldType);
        result.push(fieldDef);
    }

    return result;
}

function onDeleteSchema() {
    if (!selectedSchemaId) {
        alert("No schema is selected.");
        return;
    }

    const schema = appData.schemas.find((s) => s.id === selectedSchemaId);
    if (!schema) {
        alert("Selected schema not found.");
        return;
    }

    const ok = confirm(
        "Delete this schema and all notes that belong to it?"
    );
    if (!ok) return;

    // Remove schema
    appData.schemas = appData.schemas.filter((s) => s.id !== selectedSchemaId);
    // Cascade delete notes for this schema
    appData.notes = appData.notes.filter((n) => n.schemaId !== selectedSchemaId);

    selectedSchemaId = null;
    saveData(appData);
    resetForm();
    notifySchemasChanged();
}

function notifySchemasChanged() {
    window.dispatchEvent(new CustomEvent("schemas-changed"));
}