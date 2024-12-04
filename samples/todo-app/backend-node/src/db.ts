import sqlite3 from "sqlite3";
import { mkdirSync } from "fs";
import { parse } from "path";

export interface Todo {
  id?: number;
  todo: string;
  isDone: boolean;
}

export interface DB {
  add(todo: string): Promise<void>;
  updateTodo(id: number, text: string, isDone: boolean): Promise<void>;
  remove(id: number): Promise<void>;
  list(): Promise<Todo[]>;
}

export async function getDBConnection(dir: string): Promise<DB> {
  const db = await new Promise<sqlite3.Database>((resolve, reject) => {
    mkdirSync(parse(dir).dir, { recursive: true });

    const db = new sqlite3.Database(
      dir,
      sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(`Error opening database: ${err}`);
          return;
        }
        db.run(
          `
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY,
                todo TEXT NOT NULL,
                isDone BOOLEAN NOT NULL
            );
            `,
          (err) => {
            if (err) {
              reject(`Error creating table ${err}`);
              return;
            }
            resolve(db);
          },
        );
      },
    );
  });
  return {
    async add(todo: string) {
      const statement = new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO todos (todo, isDone) VALUES (?, false)`,
          [todo],
          (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          },
        );
      });

      return await statement;
    },
    async updateTodo(id: number, text: string, isDone: boolean) {
      const statement = new Promise<void>((resolve, reject) => {
        db.run(
          `UPDATE todos SET todo = ?, isDone = ? WHERE id = ?`,
          [text, isDone, id],
          (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          },
        );
      });

      return await statement;
    },
    async remove(id: number) {
      const statement = new Promise<void>((resolve, reject) => {
        db.run(`DELETE FROM todos WHERE id = ?`, [id], (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      return await statement;
    },
    async list() {
      const statement = new Promise<Todo[]>((resolve, reject) => {
        db.all(
          `SELECT * FROM todos ORDER BY id ASC, isDone ASC`,
          [],
          (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(
              rows
                .map((value) => {
                  return {
                    id: value.id,
                    todo: value.todo,
                    isDone: value.isDone === 0 ? false : true,
                  };
                })
                .sort((a, b) =>
                  a.isDone === b.isDone ? 0 : b.isDone ? -1 : 1,
                ),
            );
          },
        );
      });

      return await statement;
    },
  };
}
