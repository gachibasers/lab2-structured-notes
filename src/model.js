// src/model.js
// Domain model: field definitions, note schemas and notes.

export const FIELD_TYPES = ["text", "number", "date", "boolean"];

/**
 * Describes a single field inside a note schema.
 * Example: name = "Title", type = "text".
 */
export class FieldDefinition {
    constructor(name, type) {
        this.name = String(name || "").trim();
        this.type = FIELD_TYPES.includes(type) ? type : "text";
    }
}

/**
 * Note schema (template): a named collection of fields.
 */
export class NoteSchema {
    constructor(id, name, fields = []) {
        this.id = id; // string
        this.name = String(name || "").trim();
        this.fields = Array.isArray(fields) ? fields : [];
    }
}

/**
 * Single note that belongs to a specific schema.
 */
export class Note {
    constructor(id, schemaId, values = {}) {
        this.id = id; // string
        this.schemaId = schemaId; // NoteSchema.id
        this.values = values || {}; // { fieldName: any }
    }
}

/**
 * Simple helper for generating string IDs.
 */
export function generateId(prefix = "id") {
    const random = Math.random().toString(16).slice(2);
    const time = Date.now().toString(16);
    return `${prefix}-${time}-${random}`;
}

/**
 * Create a new schema with an auto-generated ID.
 */
export function createSchema(name, fields = []) {
    const id = generateId("schema");
    return new NoteSchema(id, name, fields);
}

/**
 * Create a new note with an auto-generated ID.
 */
export function createNote(schemaId, values = {}) {
    const id = generateId("note");
    return new Note(id, schemaId, values);
}