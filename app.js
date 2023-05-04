const express = require("express")
const { getTreasures } = require("./controller/treasures.controller")
const app = express()
app.use(express.json())


app.get("/api/treasures", getTreasures )

module.exports = app


