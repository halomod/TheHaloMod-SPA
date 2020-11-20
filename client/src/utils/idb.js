import { openDB } from 'idb';

let db = null;

const checks = {
  dbIsNull: () => {
    console.error('DB uninitialized');
  },
};

export const init = async () => {
  db = await openDB('models', 1, {
    upgrade(d) {
      d.createObjectStore('model');
    },
  });
};

export const get = () => {
  if (!db) return checks.dbIsNull();
};

export const put = async (key, value) => {
  if (!db) return checks.dbIsNull();
  await db.put('model', value, key);
};

export const getAll = async () => {
  if (!db) return checks.dbIsNull();
  return db.getAll('model');
};

export const deleteEntry = () => {
  if (!db) return checks.dbIsNull();
};

export const deleteAll = () => {
  if (!db) return checks.dbIsNull();
};
