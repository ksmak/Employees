
import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "employees.db");

export const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            return;
        }

        console.log("Connected to the employees database.");
    }
);

// Получение нескольких записей
export const fetchAll = <T>(
    sql: string,
    params: any[] = []
): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows as T[]);
        });
    });
};

// Получение одной записи
export const fetchFirst = <T>(
    sql: string,
    params: any[] = []
): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(row as T | undefined);
        });
    });
};

// Выполнение INSERT, UPDATE, DELETE
export const execute = (
    sql: string,
    params: any[] = []
): Promise<{ lastID: number; changes: number }> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes,
            });
        });
    });
};
