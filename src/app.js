// src/app.js
// Entry point: screen switching and UI modules initialization.

import { initSchemaUI } from "./ui-schema.js";
import { initNotesUI } from "./ui-notes.js";

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

// Initialize UI when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initSchemaUI();
    initNotesUI();
    showScreen("schema");
});