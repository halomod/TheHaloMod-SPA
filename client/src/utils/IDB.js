import {
  openDB,
  // deleteDB,
} from 'idb';

const NAME = 'models';
export default class IDB {
  db = null;

  constructor() {
    this.init();
  }

  init = async () => {
    if (this.db) return;
    this.db = openDB('models', 1, {
      upgrade(d) {
        d.createObjectStore(NAME);
      },
    });
  };

  check = async () => {
    if (!this.db) throw new Error('DB uninitialized');
    this.db = await this.db;
  };

  get = async (key) => {
    await this.check();
    return this.db.get(NAME, key);
  };

  put = async (key, value) => {
    await this.check();
    return this.db.put(NAME, value, key);
  };

  getAll = async () => {
    await this.check();
    return this.db.getAll(NAME);
  };

  keys = async () => {
    await this.check();
    return this.db.getAllKeys(NAME);
  }

  delete = async (key) => {
    await this.check();
    return this.db.delete(NAME, key);
  }

  // future implementation to clear db,
  // may not be working correcly
  // deleteAll = async () => {
  //   await this.check();
  //   return deleteDB(NAME);
  // };
}
