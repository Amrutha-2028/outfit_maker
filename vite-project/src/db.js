import Dexie from "dexie";

export const db = new Dexie("OutfitMaker");

db.version(1).stores({
  clothes: "++id,type,name,image",
});