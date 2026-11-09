import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "employees.db");
export const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the employees database.");
    }
);

export const apiGetAll = async (query: string) => {
    return await new Promise((resolve, reject) => {
        db.all(query, (err: Error, row) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(row);
        });
    });
};

export const apiGetFirst = <T>(
    query: string,
    params: any[]
): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err: Error | null, row: T | undefined) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            resolve(row);
        });
    });
};

export const apiPost = async (query: string, params: any[]) => {
    return await new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(null);
        });
    });
};