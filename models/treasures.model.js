const db = require("../db/index");

exports.selectTreasures = (
  sort,
  order,
  treasure_name,
  colour,
  age,
  cost_at_auction,
  shop_id
) => {
  if (
    ![
      "treasure_id",
      "treasure_name",
      "colour",
      "age",
      "cost_at_auction",
      "shop_name",
    ].includes(sort)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryString = `
    SELECT treasure_id, treasure_name, colour, age, cost_at_auction, shop_name 
    FROM treasures 
    JOIN shops ON treasures.shop_id = shops.shop_id 
    `;

  const queryValues = [];

  if (treasure_name || colour || age || cost_at_auction || shop_id) {
    queryString += "WHERE $1 = $2\n";
    if (treasure_name) queryValues.push("treasure_name", treasure_name);
    if (colour) queryValues.push("colour", colour);
    if (age) queryValues.push("age", age);
    if (cost_at_auction) queryValues.push("cost_at_auction", cost_at_auction);
    if (shop_id) queryValues.push("shop_id", shop_id);
  }

  queryString += `ORDER BY ${sort} ${order};`;

  return db.query(queryString, queryValues).then((result) => {
    return result.rows;
  });
};
