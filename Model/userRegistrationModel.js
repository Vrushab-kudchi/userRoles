const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./masterDB.db');

db.serialize(() => {
    db.run(`CREATE TABLE if not exists registration (
        id TEXT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role_id TEXT,
        FOREIGN KEY (role_id) REFERENCES roles(id)
    )`)
    });

