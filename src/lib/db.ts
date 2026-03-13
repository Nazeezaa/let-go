import Dexie, { type EntityTable } from "dexie";

export interface JournalEntry {
  id?: number;
  text: string;
  createdAt: Date;
}

const db = new Dexie("LetGoDB") as Dexie & {
  entries: EntityTable<JournalEntry, "id">;
};

db.version(1).stores({
  entries: "++id, createdAt",
});

export { db };
