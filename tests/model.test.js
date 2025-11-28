// tests/model.test.js
// Unit tests for domain model (FieldDefinition, NoteSchema, Note, helpers).

import { test, assertEqual, assert, runTests } from "./testRunner.js";
import {
    FIELD_TYPES,
    FieldDefinition,
    NoteSchema,
    Note,
    generateId,
    createSchema,
    createNote,
} from "../src/model.js";

test("FIELD_TYPES contains four basic types", () => {
    assertEqual(FIELD_TYPES.length, 4);
    assert(FIELD_TYPES.includes("text"), "text type should exist");
    assert(FIELD_TYPES.includes("number"), "number type should exist");
    assert(FIELD_TYPES.includes("date"), "date type should exist");
    assert(FIELD_TYPES.includes("boolean"), "boolean type should exist");
});

test("FieldDefinition trims name and normalizes type", () => {
    const f = new FieldDefinition("  Title  ", "text");
    assertEqual(f.name, "Title");
    assertEqual(f.type, "text");

    const f2 = new FieldDefinition("X", "unknown");
    assertEqual(f2.type, "text"); // fallback
});

test("NoteSchema stores id, name and fields", () => {
    const fields = [new FieldDefinition("Title", "text")];
    const schema = new NoteSchema("s1", "My schema", fields);
    assertEqual(schema.id, "s1");
    assertEqual(schema.name, "My schema");
    assertEqual(schema.fields.length, 1);
});

test("Note stores id, schemaId and values", () => {
    const note = new Note("n1", "s1", { Title: "Hello" });
    assertEqual(note.id, "n1");
    assertEqual(note.schemaId, "s1");
    assertEqual(note.values.Title, "Hello");
});

test("generateId returns different values", () => {
    const a = generateId("test");
    const b = generateId("test");
    assert(a !== b, "IDs should be different");
    assert(a.startsWith("test-"), "ID should start with prefix");
});

test("createSchema and createNote generate IDs", () => {
    const schema = createSchema("Lecture", []);
    assert(!!schema.id, "Schema should have id");
    assertEqual(schema.name, "Lecture");

    const note = createNote(schema.id, { Title: "Hello" });
    assert(!!note.id, "Note should have id");
    assertEqual(note.schemaId, schema.id);
    assertEqual(note.values.Title, "Hello");
});

// Run all tests when this file is executed
runTests();