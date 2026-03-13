import Dexie, { type EntityTable } from "dexie";

export interface JournalEntry {
  id?: number;
  text: string;
  type: "keep" | "letgo";
  createdAt: Date;
}

const db = new Dexie("LetGoDB") as Dexie & {
  entries: EntityTable<JournalEntry, "id">;
};

db.version(2).stores({
  entries: "++id, createdAt, type",
});

export { db };
