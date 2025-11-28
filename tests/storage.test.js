// tests/storage.test.js
// Unit tests for storage service (localStorage wrapper).

import { test, assertEqual, assert, runTests } from "./testRunner.js";
import {
    loadData,
    saveData,
    clearAllData,
    exportData,
    importDataFromJson,
} from "../src/storage.js";

function resetStorage() {
    clearAllData();
}

test("loadData returns empty arrays when storage is empty", () => {
    resetStorage();
    const data = loadData();
    assert(Array.isArray(data.schemas), "schemas should be array");
    assert(Array.isArray(data.notes), "notes should be array");
    assertEqual(data.schemas.length, 0);
    assertEqual(data.notes.length, 0);
});

test("saveData and loadData round-trip basic data", () => {
    resetStorage();
    const original = {
        schemas: [{ id: "s1", name: "Schema", fields: [] }],
        notes: [{ id: "n1", schemaId: "s1", values: { Title: "Hi" } }],
    };
    saveData(original);

    const loaded = loadData();
    assertEqual(loaded.schemas.length, 1);
    assertEqual(loaded.schemas[0].id, "s1");
    assertEqual(loaded.notes.length, 1);
    assertEqual(loaded.notes[0].values.Title, "Hi");
});

test("exportData and importDataFromJson work together", () => {
    resetStorage();
    const original = {
        schemas: [{ id: "s2", name: "Another", fields: [] }],
        notes: [],
    };
    saveData(original);

    const json = exportData();
    resetStorage();
    importDataFromJson(json);

    const loaded = loadData();
    assertEqual(loaded.schemas.length, 1);
    assertEqual(loaded.schemas[0].id, "s2");
});

// Run tests
runTests();