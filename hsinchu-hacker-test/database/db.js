const JsonDB = require('node-json-db');
const botDatabase = new JsonDB("database/botDatabase", true, true);
const botDatabase_min = new JsonDB("database/botDatabase_min", true, false);
const user = new JsonDB("database/user", true, true);
module.exports = { botDatabase, botDatabase_min, user }