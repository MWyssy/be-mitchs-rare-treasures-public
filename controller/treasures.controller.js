const {
  selectTreasures,
  filterTreasures,
  addTreasure,
  updatePrice,
  removeTreasure,
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

exports.addNewTreasure = (req, res, next) => {

  if (!Object.keys(req.body).length || typeof(req.body[0]) !== "object") {
    return next({status: 400, msg: "Invalid content sent, must be of type OBJECT"})
  }

  addTreasure(req.body).then((result) => {
  
    res.status(202).send({treasures : result})
  })
  .catch((err) => {
    next(err)
  })


}

exports.changeTreasurePrice = (req, res, next) => {
  const treasure_id = req.params.treasure_id;
  const newPrice = req.body.cost_at_auction
 
  if (Object.keys(req.body)[0] !== "cost_at_auction" || Object.keys(req.body).length > 1 ) {
    next({status: 400, msg : "patch request can only accept cost_at_auction as key" })
  }
  if (typeof newPrice !== "number") {
    next({status:400, msg: "cost_at_auction value must be a number"})
  }
  updatePrice(newPrice, treasure_id).then((result) => {
    res.status(200).send({treasures: result})
  })
  .catch((err) => {
    next(err)
  })
}

exports.deleteTreasure = (req, res, next) => {
  const treasure_id = req.params.treasure_id
  console.log(treasure_id)
  removeTreasure(treasure_id).then((result) => {
    res.status(200).send({treasures: result})
  })
}