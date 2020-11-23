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

  // initialize db
  init = async () => {
    if (this.db) return;
    this.db = openDB('models', 1, {
      upgrade(d) {
        d.createObjectStore(NAME);
      },
    });
  };

  // checks if db is initialized
  check = async () => {
    if (!this.db) throw new Error('DB uninitialized');
    this.db = await this.db;
  };

  // gets item at key from idb
  get = async (key) => {
    await this.check();
    return this.db.get(NAME, key);
  };

  // puts item at key in idb
  put = async (key, value) => {
    await this.check();
    return this.db.put(NAME, value, key);
  };

  // get all items from idb
  getAll = async () => {
    await this.check();
    return this.db.getAll(NAME);
  };

  // get all keys from idb
  keys = async () => {
    await this.check();
    return this.db.getAllKeys(NAME);
  }

  // deletes item at key from idb
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
