import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { Bill } from '@/types';

const DATABASE_NAME = 'finmind.db';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      console.log('Database initialization skipped for web platform');
      return;
    }

    console.log('OPEN database:', DATABASE_NAME);
    
    // 使用expo-sqlite的新API
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    if (db) {
      await createTables();
      console.log('Database initialized successfully');
    } else {
      throw new Error('Failed to open database');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.warn('App will continue without local database functionality');
  }
};

const createTables = async (): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

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

  await db.execAsync(createUsersTable);
  await db.execAsync(createBillsTable);
  await db.execAsync(createCategoriesTable);

  await insertDefaultCategories();
};

const insertDefaultCategories = async (): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

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
    const result = await db.getFirstAsync(checkSql, [category.id]);

    if (!result) {
      const insertSql =
        'INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)';
      await db.runAsync(insertSql, [
        category.id,
        category.name,
        category.icon,
        category.color,
      ]);
    }
  }
};

const checkDatabase = (): boolean => {
  if (!db) {
    console.warn('Database not initialized, operation skipped');
    return false;
  }
  return true;
};

export const databaseService = {
  async saveBill(bill: Bill): Promise<void> {
    if (!checkDatabase()) return;

    const sql = `
      INSERT OR REPLACE INTO bills 
      (id, user_id, time, channel, merchant, type, amount, category, created_at, updated_at, synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await db!.runAsync(sql, [
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
    } catch (error) {
      console.error('Failed to save bill:', error);
    }
  },

  async getBills(limit: number = 20, offset: number = 0): Promise<Bill[]> {
    if (!checkDatabase()) return [];

    try {
      const sql = 'SELECT * FROM bills ORDER BY time DESC LIMIT ? OFFSET ?';
      const results = await db!.getAllAsync(sql, [limit, offset]);

      const bills: Bill[] = results.map((row: any) => ({
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
      }));

      return bills;
    } catch (error) {
      console.error('Failed to get bills:', error);
      return [];
    }
  },

  async getUnsyncedBills(): Promise<Bill[]> {
    if (!checkDatabase()) return [];

    try {
      const sql = 'SELECT * FROM bills WHERE synced = 0';
      const results = await db!.getAllAsync(sql);

      const bills: Bill[] = results.map((row: any) => ({
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
      }));

      return bills;
    } catch (error) {
      console.error('Failed to get unsynced bills:', error);
      return [];
    }
  },

  async markBillsSynced(billIds: string[]): Promise<void> {
    if (!checkDatabase()) return;

    try {
      const placeholders = billIds.map(() => '?').join(',');
      const sql = `UPDATE bills SET synced = 1 WHERE id IN (${placeholders})`;
      await db!.runAsync(sql, billIds);
    } catch (error) {
      console.error('Failed to mark bills as synced:', error);
    }
  },

  async deleteBill(id: string): Promise<void> {
    if (!checkDatabase()) return;

    try {
      const sql = 'DELETE FROM bills WHERE id = ?';
      await db!.runAsync(sql, [id]);
    } catch (error) {
      console.error('Failed to delete bill:', error);
    }
  },

  async getCategories(): Promise<any[]> {
    if (!checkDatabase()) return [];

    try {
      const sql = 'SELECT * FROM categories';
      const categories = await db!.getAllAsync(sql);
      return categories;
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  },

  async clearAllData(): Promise<void> {
    if (!checkDatabase()) return;

    try {
      await db!.runAsync('DELETE FROM bills');
      await db!.runAsync('DELETE FROM users');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  },
};
