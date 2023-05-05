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
    shop_id,
  } = req.query;

  selectTreasures(
    sort_by,
    order,
    treasure_name,
    colour,
    age,
    cost_at_auction,
    shop_id
  )
    .then((result) => {
      res.status(200).send({ treasures: result });
    })
    .catch((err) => {
      next(err);
    });
};
