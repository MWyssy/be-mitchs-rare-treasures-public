const db = require("../db/index");


exports.selectTreasures = (sort = "age", order = "asc") => {
    if (!["treasure_id",
        "treasure_name",
        "colour",
        "age",
        "cost_at_auction",
        "shop_name"].includes(sort)) {
            return Promise.reject({ status: 400, msg: "Invalid sort query"})
        }
    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query"})
    }
    const queryString =`
    SELECT treasure_id, treasure_name, colour, age, cost_at_auction, shop_name FROM treasures 
    JOIN shops ON treasures.shop_id = shops.shop_id 
    ORDER BY ${sort} ${order};
    `;

    return db.query(queryString)
    .then((result) => {
        return result.rows;
    })
}

exports.filterTreasures = (filter) => {
    const category = Object.keys(filter)[0]
    const value = filter[category]
    const queryString = ` SELECT treasure_id, treasure_name, colour, age, cost_at_auction, shop_name FROM treasures 
    JOIN shops ON treasures.shop_id = shops.shop_id
    WHERE colour = $1;`
    const filterArray = [value]
    console.log(filterArray)
    return db.query(queryString, filterArray).then((result) => {
        return result.rows
    })
}