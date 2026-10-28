const Database = require("better-sqlite3");
const datab = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..","files.db");
const db =new Database(dbPath);

db.exec(`
    create table if not exists files(
    id integer primary key autoincrement,
    name text not null,
    type text,
    upload_at text default current_timestamp,
    uploaded_by text not null,
    file_path text not null
    )`
);

module.exports = db;