import SQLite from 'react-native-sqlite-storage';
import { Bill } from '@/types';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DATABASE_NAME = 'finmind.db';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    await createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const createTables = async (): Promise<void> => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `;

  const createBillsTable = `
    CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      time TEXT NOT NULL,
      channel TEXT NOT NULL,
      merchant TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `;

  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    );
  `;

  await db.executeSql(createUsersTable);
  await db.executeSql(createBillsTable);
  await db.executeSql(createCategoriesTable);

  await insertDefaultCategories();
};

const insertDefaultCategories = async (): Promise<void> => {
  const defaultCategories = [
    { id: '1', name: '餐饮', icon: 'restaurant', color: '#FF6B6B' },
    { id: '2', name: '交通', icon: 'car', color: '#4ECDC4' },
    { id: '3', name: '购物', icon: 'shopping-bag', color: '#45B7D1' },
    { id: '4', name: '娱乐', icon: 'music', color: '#96CEB4' },
    { id: '5', name: '医疗', icon: 'heart', color: '#FFEAA7' },
    { id: '6', name: '教育', icon: 'book', color: '#DDA0DD' },
    { id: '7', name: '工资', icon: 'dollar-sign', color: '#98D8C8' },
    { id: '8', name: '其他', icon: 'more-horizontal', color: '#F7DC6F' },
  ];

  for (const category of defaultCategories) {
    const checkSql = 'SELECT id FROM categories WHERE id = ?';
    const [result] = await db.executeSql(checkSql, [category.id]);

    if (result.rows.length === 0) {
      const insertSql =
        'INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)';
      await db.executeSql(insertSql, [
        category.id,
        category.name,
        category.icon,
        category.color,
      ]);
    }
  }
};

export const databaseService = {
  async saveBill(bill: Bill): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO bills 
      (id, user_id, time, channel, merchant, type, amount, category, created_at, updated_at, synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.executeSql(sql, [
      bill.id,
      bill.userId,
      bill.time,
      bill.channel,
      bill.merchant,
      bill.type,
      bill.amount,
      bill.category,
      bill.createdAt,
      bill.updatedAt,
      0,
    ]);
  },

  async getBills(limit: number = 20, offset: number = 0): Promise<Bill[]> {
    const sql = 'SELECT * FROM bills ORDER BY time DESC LIMIT ? OFFSET ?';
    const [result] = await db.executeSql(sql, [limit, offset]);

    const bills: Bill[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      bills.push({
        id: row.id,
        userId: row.user_id,
        time: row.time,
        channel: row.channel,
        merchant: row.merchant,
        type: row.type,
        amount: row.amount,
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }

    return bills;
  },

  async getUnsyncedBills(): Promise<Bill[]> {
    const sql = 'SELECT * FROM bills WHERE synced = 0';
    const [result] = await db.executeSql(sql);

    const bills: Bill[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      bills.push({
        id: row.id,
        userId: row.user_id,
        time: row.time,
        channel: row.channel,
        merchant: row.merchant,
        type: row.type,
        amount: row.amount,
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }

    return bills;
  },

  async markBillsSynced(billIds: string[]): Promise<void> {
    const placeholders = billIds.map(() => '?').join(',');
    const sql = `UPDATE bills SET synced = 1 WHERE id IN (${placeholders})`;
    await db.executeSql(sql, billIds);
  },

  async deleteBill(id: string): Promise<void> {
    const sql = 'DELETE FROM bills WHERE id = ?';
    await db.executeSql(sql, [id]);
  },

  async getCategories(): Promise<any[]> {
    const sql = 'SELECT * FROM categories';
    const [result] = await db.executeSql(sql);

    const categories: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      categories.push(result.rows.item(i));
    }

    return categories;
  },

  async clearAllData(): Promise<void> {
    await db.executeSql('DELETE FROM bills');
    await db.executeSql('DELETE FROM users');
  },
};
