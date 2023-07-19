const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./masterDB.db');
const { v4: uuidv4 } = require('uuid');

// Predefined roles data
const predefinedRoles = [
  { id: uuidv4(), roles: 'admin' },
  { id: uuidv4(), roles: 'user' },
];

db.serialize(() => {
  db.run(`CREATE TABLE if not exists Roles (
    id TEXT PRIMARY KEY,
    roles TEXT NOT NULL
  )`, (err) => {
    if (err) {
    //   console.log("Failed TO Create a Table");
    } else {
    //   console.log("Table Created");

      // Insert predefined roles into the 'Roles' table
      const insertQuery = `INSERT INTO Roles (id, roles) VALUES (?, ?)`;
      predefinedRoles.forEach((role) => {
        db.run(insertQuery, [role.id, role.roles]);
      });
    }
  });
});
