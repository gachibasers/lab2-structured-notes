// src/storage.js
// Simple data service for schemas and notes based on localStorage.

const STORAGE_KEY = "structured-notes-data";

/**
 * Loads data from localStorage.
 * Shape:
 * {
 *   schemas: [ { id, name, fields: [ { name, type } ] } ],
 *   notes:   [ { id, schemaId, values: { ... } } ]
 * }
 */
export function loadData() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return { schemas: [], notes: [] };
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            schemas: Array.isArray(parsed.schemas) ? parsed.schemas : [],
            notes: Array.isArray(parsed.notes) ? parsed.notes : [],
        };
    } catch (e) {
        console.warn("Failed to parse stored data:", e);
        return { schemas: [], notes: [] };
    }
}

/**
 * Saves the entire data object to localStorage.
 */
export function saveData(data) {
    const safeData = {
        schemas: Array.isArray(data.schemas) ? data.schemas : [],
        notes: Array.isArray(data.notes) ? data.notes : [],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
}

/**
 * Clears all stored data.
 */
export function clearAllData() {
    window.localStorage.removeItem(STORAGE_KEY);
}

/**
 * Returns exported data as a pretty-printed JSON string.
 */
export function exportData() {
    const data = loadData();
    return JSON.stringify(data, null, 2);
}

/**
 * Imports data from JSON string and overwrites current storage.
 * Throws an error if JSON is invalid.
 */
export function importDataFromJson(jsonString) {
    const parsed = JSON.parse(jsonString);
    const safeData = {
        schemas: Array.isArray(parsed.schemas) ? parsed.schemas : [],
        notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
    saveData(safeData);
}