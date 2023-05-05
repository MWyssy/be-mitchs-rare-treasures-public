const express = require("express");
const { getTreasures } = require("./controller/treasures.controller");
const app = express();
app.use(express.json());

app.get("/api/treasures", getTreasures);

app.use((err, req, res, next) => {
  res.status(err.status).send({ error: err.msg });
});

module.exports = app;
