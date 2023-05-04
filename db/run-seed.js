const data = require("./data/dev-data");
const seed = require("./seed");

const db = require("./index.js");

seed(data).then(() => db.end());
