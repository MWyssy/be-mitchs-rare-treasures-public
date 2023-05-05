const {
  selectTreasures,
  filterTreasures,
} = require("../models/treasures.model");

exports.getTreasures = (req, res, next) => {
  const {
    sort_by = "age",
    order = "asc",
    treasure_name,
    colour,
    age,
    cost_at_auction,
    shop_name,
  } = req.query;

  const possibleQueries = [
    "sort_by",
    "order",
    "treasure_name",
    "colour",
    "age",
    "cost_at_auction",
    "shop_name",
  ];

  const queryKeys = Object.keys(req.query);

  for (let i = 0; i < queryKeys.length; i++) {
    if (!possibleQueries.includes(queryKeys[i])) {
      return next({ status: 400, msg: "Invalid filter query used" });
    }
  }

  selectTreasures(
    sort_by,
    order,
    treasure_name,
    colour,
    age,
    cost_at_auction,
    shop_name
  )
    .then((result) => {
      res.status(200).send({ treasures: result });
    })
    .catch((err) => {
      next(err);
    });
};
