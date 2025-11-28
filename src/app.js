// src/app.js
// Entry point: screen switching and UI modules initialization.

import { initSchemaUI } from "./ui-schema.js";
import { initNotesUI } from "./ui-notes.js";
import {
    exportData,
    importDataFromJson,
    clearAllData,
} from "./storage.js";

const screens = {
    schema: document.getElementById("schema-screen"),
    notes: document.getElementById("notes-screen"),
    settings: document.getElementById("settings-screen"),
};

const navButtons = {
    schema: document.getElementById("nav-schema"),
    notes: document.getElementById("nav-notes"),
    settings: document.getElementById("nav-settings"),
};

function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");

    Object.values(navButtons).forEach((b) => b.classList.remove("active-nav"));
    navButtons[name].classList.add("active-nav");
}

// Navigation event handlers
navButtons.schema.addEventListener("click", () => showScreen("schema"));
navButtons.notes.addEventListener("click", () => showScreen("notes"));
navButtons.settings.addEventListener("click", () => showScreen("settings"));

function initSettingsUI() {
    const exportBtn = document.getElementById("export-data-btn");
    const importInput = document.getElementById("import-data-input");
    const clearBtn = document.getElementById("clear-data-btn");

    exportBtn.addEventListener("click", () => {
        const json = exportData();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "structured-notes-data.json";
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    });

    importInput.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            importDataFromJson(text);
            alert("Data imported successfully. Please reload the page.");
        } catch (e) {
            console.error(e);
            alert("Failed to import data. Invalid JSON file.");
        } finally {
            importInput.value = "";
        }
    });

    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all data?")) {
            clearAllData();
            alert("All data has been cleared. Please reload the page.");
        }
    });
}

// Initialize UI when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initSchemaUI();
    initNotesUI();
    initSettingsUI();
    showScreen("schema");
});