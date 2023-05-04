const format = require("pg-format");
const db = require("../db/index.js");

exports.prepareTreasureData = (arr, shopData) => {
  if (!arr || !shopData) return [];

  const copyArr = [...arr];
  return copyArr.map((treasure) => {
    const copyTreasure = { ...treasure };
    const shop = shopData.find((shop) => {
      return copyTreasure.shop === shop.shop_name;
    });
    copyTreasure.shop_id = shop.shop_id;
    return copyTreasure;
  });
};

exports.formatTreasureData = (treasureData) => {
  if (!treasureData) return [];

  return treasureData.map((treasure) => {
    return [
      treasure.treasure_name,
      treasure.colour,
      treasure.age,
      treasure.cost_at_auction,
      treasure.shop_id,
    ];
  });
};

exports.insertTreasures = (formattedTreasureData) => {
  if (!formattedTreasureData) return "";
  const treasureInsertStr = format(
    `INSERT INTO treasures
            (treasure_name, colour, age, cost_at_auction, shop_id)
        VALUES
            %L
        RETURNING *;`,
    formattedTreasureData
  );
  return treasureInsertStr;
};
