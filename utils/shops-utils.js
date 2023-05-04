const format = require("pg-format");

exports.formatShopData = (arr) => {
  const copyArr = [...arr];
  return copyArr.map((shop) => {
    const copyShop = { ...shop };
    return [copyShop.shop_name, copyShop.owner, copyShop.slogan];
  });
};

exports.insertShops = (formattedArr) => {
  const shopsInsertStr = format(
    `INSERT INTO shops
        (shop_name, owner, slogan)
    VALUES
        %L
    RETURNING *;`,
    formattedArr
  );
  return shopsInsertStr;
};
