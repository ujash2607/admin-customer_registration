const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbName
});

module.exports = db.promise();

console.log("Database connected");