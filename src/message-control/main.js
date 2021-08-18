const path = require('path');
const { ipcMain, app } = require('electron');
const Database = require('better-sqlite3');
const isDev = require('electron-is-dev');

const dbPath = isDev
    ? './public/db.sqlite3'
    : path.resolve(app.getPath('userData'), 'db.sqlite3');

const database = new Database(dbPath, { verbose: console.log });

ipcMain.on('asynchronous-message', (event, arg) => {
    database
        .prepare(
            `CREATE TABLE IF NOT EXISTS repositories (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, title TEXT NOT NULL)`
        )
        .run();
    const sql = arg;
    if (arg.includes('INSERT')) {
        const response = database.prepare(sql).run();
        event.reply('asynchronous-reply', response);
    } else {
        const response = database.prepare(sql).all();
        event.reply('asynchronous-reply', response);
    }
});
