import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const db = SQLite.openDatabase({ name: 'stockflow.db', location: 'default' });

export const initDB = async () => {
  const database = await db;
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      count INTEGER,
      serialNumber TEXT,
      location TEXT,
      lastModifiedBy TEXT,
      lastModifiedOn TEXT,
      synced INTEGER DEFAULT 0
    );
  `);
  return database;
};

export const insertInventory = async (item) => {
  const database = await db;
  await database.executeSql(
    `INSERT INTO inventory (name, count, serialNumber, location, lastModifiedBy, lastModifiedOn, synced) VALUES (?, ?, ?, ?, ?, ?, 0);`,
    [item.name, item.count, item.serialNumber, item.location, item.lastModifiedBy, item.lastModifiedOn]
  );
};

export const getUnsyncedInventory = async () => {
  const database = await db;
  const [results] = await database.executeSql(`SELECT * FROM inventory WHERE synced = 0;`);
  let items = [];
  for (let i = 0; i < results.rows.length; i++) {
    items.push(results.rows.item(i));
  }
  return items;
};

export const markInventoryAsSynced = async (ids) => {
  if (!ids.length) return;
  const database = await db;
  await database.executeSql(`UPDATE inventory SET synced = 1 WHERE id IN (${ids.map(() => '?').join(',')});`, ids);
};

export const getAllInventory = async () => {
  const database = await db;
  const [results] = await database.executeSql(`SELECT * FROM inventory;`);
  let items = [];
  for (let i = 0; i < results.rows.length; i++) {
    items.push(results.rows.item(i));
  }
  return items;
};
