const {
  formatShopData,
  insertShops,
  formatTreasureData,
  prepareTreasureData,
  insertTreasures,
} = require("../utils/index.js");

const db = require("./index.js");

const seed = ({ shopData, treasureData }) => {
  return db
    .query(`DROP TABLE IF EXISTS treasures;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS shops;`);
    })
    .then(() => {
      return db.query(
        `
		CREATE TABLE shops (
			shop_id SERIAL PRIMARY KEY,
			shop_name VARCHAR(40) NOT NULL,
			owner VARCHAR(40) NOT NULL,
			slogan TEXT
			);`
      );
    })
    .then(() => {
      return db.query(
        `
		CREATE TABLE treasures (
			treasure_id SERIAL PRIMARY KEY,
			treasure_name VARCHAR(100) NOT NULL,
			colour VARCHAR(40) NOT NULL,
			age INT NOT NULL,
			cost_at_auction FLOAT(2) NOT NULL,
			shop_id INT REFERENCES shops(shop_id)
			);`
      );
    })
    .then(() => {
      const shops = formatShopData(shopData);
      const insert = insertShops(shops);
      return db.query(insert);
    })
    .then((shops) => {
      const treasure = formatTreasureData(
        prepareTreasureData(treasureData, shops.rows)
      );
      const insert = insertTreasures(treasure);
      return db.query(insert);
    });
  // then: create some new tables - but which first and why?
  // then: insert the raw data into the tables.
};

module.exports = seed;
