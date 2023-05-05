const db = require("../db/index");

exports.selectTreasures = (
  sort,
  order,
  treasure_name,
  colour,
  age,
  cost_at_auction,
  shop_name
) => {
  const queries = [
    { treasure_name: treasure_name },
    { colour: colour },
    { age: age },
    { cost_at_auction: cost_at_auction },
    { shop_name: shop_name },
  ];
  const filteredQueries = queries.filter((query) => Object.values(query)[0]);

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

  if (filteredQueries.length && filteredQueries.length <= 2) {
    if (filteredQueries.length === 1) {
      const filterResult = filter(filteredQueries[0]);
      queryString += filterResult.queryStringAddition;
      queryValues.push(filterResult.queryValues[0]);
    } else {
      const filterResult = filter(filteredQueries[0], filteredQueries[1]);
      queryString += filterResult.queryStringAddition;
      queryValues.push(
        filterResult.queryValues[0],
        filterResult.queryValues[1]
      );
    }
  }
  if (filteredQueries.length && filteredQueries.length > 2) {
    return Promise.reject({
      status: 400,
      msg: "Invalid filter query - too many queries!",
    });
  }

  queryString += `ORDER BY ${sort} ${order};`;

  return db.query(queryString, queryValues).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({
        status: 400,
        msg: "Invalid filter query value used",
      });
    }
    return result.rows;
  });
};

function filter(query1, query2) {
  const result = { queryStringAddition: "", queryValues: [] };
  const query1Key = Object.keys(query1)[0];
  result.queryStringAddition += `WHERE ${query1Key} = $1\n`;
  result.queryValues.push(query1[query1Key]);
  if (query2) {
    const query2Key = Object.keys(query2)[0];
    result.queryStringAddition += `AND ${query2Key} = $2\n`;
    result.queryValues.push(query2[query2Key]);
  }
  return result;
}
