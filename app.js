const express = require("express");
const { getTreasures, addNewTreasure, changeTreasurePrice, deleteTreasure } = require("./controller/treasures.controller");
const app = express();
app.use(express.json());

app.get("/api/treasures", getTreasures);

app.post("/api/treasures", addNewTreasure);

app.patch("/api/treasures/:treasure_id", changeTreasurePrice)

app.delete("/api/treasures/:treasure_id", deleteTreasure)

app.use((err, req, res, next) => {
  res.status(err.status).send({ error: err.msg });
});

module.exports = app;
