const { treasureData } = require("../db/data/test-data/index.js");
const {
  formatShopData,
  insertShops,
  formatTreasureData,
  prepareTreasureData,
  insertTreasures,
} = require("../utils/index.js");

describe.only("formatShopData", () => {
  test("returns an array", () => {
    expect(formatShopData()).toEqual([]);
  });
  test("returns a new array", () => {
    const input = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
    ];
    expect(formatShopData(input)).not.toBe(input);
  });
  test("returns an array with the values of an object inside a nested array", () => {
    const input = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
      },
    ];
    expect(formatShopData(input)).toEqual([
      ["shop-b", "firstname-b", "slogan-b"],
    ]);
  });
  test("returns an array with the values of all the objects in the original array inside a nested array", () => {
    const input = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" },
      { shop_name: "shop-f", owner: "firstname-e", slogan: "slogan-f" },
      { shop_name: "shop-g", owner: "firstname-f", slogan: "slogan-g" },
    ];
    expect(formatShopData(input)).toEqual([
      ["shop-b", "firstname-b", "slogan-b"],
      ["shop-d", "firstname-c", "slogan-d"],
      ["shop-e", "firstname-d", "slogan-e"],
      ["shop-f", "firstname-e", "slogan-f"],
      ["shop-g", "firstname-f", "slogan-g"],
    ]);
  });
  test("does not mutate the original array, or objects", () => {
    const input = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" },
      { shop_name: "shop-f", owner: "firstname-e", slogan: "slogan-f" },
      { shop_name: "shop-g", owner: "firstname-f", slogan: "slogan-g" },
    ];
    const copyInput = [...input];
    const copyFirstShop = { ...input[0] };

    formatShopData(input);

    expect(input).toEqual(copyInput);
    expect(input[0]).toEqual(copyFirstShop);
  });
});

describe.only("insertShops", () => {
  test("returns a string", () => {
    expect(insertShops()).toBe("");
  });
  test("the returned string should be formatted as an SQL Insert query", () => {
    const input = formatShopData([
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
    ]);
    expect(insertShops(input)).toBe(
      `INSERT INTO shops
        (shop_name, owner, slogan)
    VALUES
        ('shop-b', 'firstname-b', 'slogan-b')
    RETURNING *;`
    );
  });
  test("works with mutliple values to insert", () => {
    const input = formatShopData([
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" },
    ]);
    expect(insertShops(input)).toBe(
      `INSERT INTO shops
        (shop_name, owner, slogan)
    VALUES
        ('shop-b', 'firstname-b', 'slogan-b'), ('shop-d', 'firstname-c', 'slogan-d'), ('shop-e', 'firstname-d', 'slogan-e')
    RETURNING *;`
    );
  });
});

describe.only("formatTreasureData", () => {
  test("returns an array", () => {
    expect(formatTreasureData()).toEqual([]);
  });
  test("returns a new array", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
        shop_id: 2,
      },
    ];
    expect(formatTreasureData(treasureInput)).not.toBe(treasureInput);
  });
  test("returns an array with the values of an object inside a nested array", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
        shop_id: 2,
      },
    ];
    expect(formatTreasureData(treasureInput)).toEqual([
      ["treasure-a", "turquoise", 200, "20.00", 2],
    ]);
  });
  test("returns an array with the values of all the objects in the original array inside a nested array", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
        shop_id: 2,
      },
      {
        treasure_name: "treasure-d",
        colour: "azure",
        age: 100,
        cost_at_auction: "1001.00",
        shop: "shop-d",
        shop_id: 4,
      },
      {
        treasure_name: "treasure-b",
        colour: "gold",
        age: 13,
        cost_at_auction: "500.00",
        shop: "shop-f",
        shop_id: 6,
      },
      {
        treasure_name: "treasure-f",
        colour: "onyx",
        age: 56,
        cost_at_auction: "0.01",
        shop: "shop-e",
        shop_id: 5,
      },
      {
        treasure_name: "treasure-h",
        colour: "carmine",
        age: 13,
        cost_at_auction: "6.90",
        shop: "shop-a",
        shop_id: 1,
      },
    ];
    expect(formatTreasureData(treasureInput)).toEqual([
      ["treasure-a", "turquoise", 200, "20.00", 2],
      ["treasure-d", "azure", 100, "1001.00", 4],
      ["treasure-b", "gold", 13, "500.00", 6],
      ["treasure-f", "onyx", 56, "0.01", 5],
      ["treasure-h", "carmine", 13, "6.90", 1],
    ]);
  });
  test("does not mutate the original array, or objects", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
      },
    ];
    const shopInput = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
        shop_id: 2,
      },
    ];
    const copyTreasureInput = [...treasureInput];
    const copyShopInput = [...shopInput];
    const copyFirstTreasure = { ...treasureInput[0] };
    const copyFirstShop = { ...shopInput[0] };

    formatTreasureData(treasureInput, shopInput);

    expect(treasureInput).toEqual(copyTreasureInput);
    expect(treasureInput[0]).toEqual(copyFirstTreasure);
    expect(shopInput).toEqual(copyShopInput);
    expect(shopInput[0]).toEqual(copyFirstShop);
  });
});

describe.only("prepareTreasureData", () => {
  test("returns an array", () => {
    expect(prepareTreasureData()).toEqual([]);
  });
  test("returns a new array", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
      },
    ];
    const shopInput = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
        shop_id: 2,
      },
    ];
    expect(prepareTreasureData(treasureInput, shopInput)).not.toBe(
      treasureInput
    );
  });
  test("adds shop id in a single treasure object", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
      },
    ];
    const shopInput = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
        shop_id: 2,
      },
    ];
    expect(prepareTreasureData(treasureInput, shopInput)).toEqual([
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
        shop_id: 2,
      },
    ]);
  });
  test("adds shop_ids in all treasure objects", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
      },
      {
        treasure_name: "treasure-d",
        colour: "azure",
        age: 100,
        cost_at_auction: "1001.00",
        shop: "shop-d",
      },
      {
        treasure_name: "treasure-b",
        colour: "gold",
        age: 13,
        cost_at_auction: "500.00",
        shop: "shop-f",
      },
      {
        treasure_name: "treasure-f",
        colour: "onyx",
        age: 56,
        cost_at_auction: "0.01",
        shop: "shop-e",
      },
      {
        treasure_name: "treasure-h",
        colour: "carmine",
        age: 13,
        cost_at_auction: "6.90",
        shop: "shop-a",
      },
    ];
    const shopInput = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
        shop_id: 2,
      },
      {
        shop_name: "shop-d",
        owner: "firstname-c",
        slogan: "slogan-d",
        shop_id: 4,
      },
      {
        shop_name: "shop-e",
        owner: "firstname-d",
        slogan: "slogan-e",
        shop_id: 5,
      },
      {
        shop_name: "shop-f",
        owner: "firstname-e",
        slogan: "slogan-f",
        shop_id: 6,
      },
      {
        shop_name: "shop-a",
        owner: "firstname-f",
        slogan: "slogan-a",
        shop_id: 1,
      },
    ];
    expect(prepareTreasureData(treasureInput, shopInput)).toEqual([
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
        shop_id: 2,
      },
      {
        treasure_name: "treasure-d",
        colour: "azure",
        age: 100,
        cost_at_auction: "1001.00",
        shop: "shop-d",
        shop_id: 4,
      },
      {
        treasure_name: "treasure-b",
        colour: "gold",
        age: 13,
        cost_at_auction: "500.00",
        shop: "shop-f",
        shop_id: 6,
      },
      {
        treasure_name: "treasure-f",
        colour: "onyx",
        age: 56,
        cost_at_auction: "0.01",
        shop: "shop-e",
        shop_id: 5,
      },
      {
        treasure_name: "treasure-h",
        colour: "carmine",
        age: 13,
        cost_at_auction: "6.90",
        shop: "shop-a",
        shop_id: 1,
      },
    ]);
  });
  test("does not mutate the original array, or objects", () => {
    const treasureInput = [
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop: "shop-b",
      },
    ];
    const shopInput = [
      {
        shop_name: "shop-b",
        owner: "firstname-b",
        slogan: "slogan-b",
        shop_id: 2,
      },
    ];
    const copyTreasureInput = [...treasureInput];
    const copyShopInput = [...shopInput];
    const copyFirstTreasure = { ...treasureInput[0] };
    const copyFirstShop = { ...shopInput[0] };

    prepareTreasureData(treasureInput, shopInput);

    expect(treasureInput).toEqual(copyTreasureInput);
    expect(treasureInput[0]).toEqual(copyFirstTreasure);
    expect(shopInput).toEqual(copyShopInput);
    expect(shopInput[0]).toEqual(copyFirstShop);
  });
});

describe.only("insertTreasures", () => {
  test("returns a string", () => {
    expect(insertTreasures()).toBe("");
  });
  test("the returned string should be formatted as an SQL Insert query", () => {
    const input = formatTreasureData([
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop_id: 2,
      },
    ]);
    expect(insertTreasures(input)).toBe(
      `INSERT INTO treasures
            (treasure_name, colour, age, cost_at_auction, shop_id)
        VALUES
            ('treasure-a', 'turquoise', '200', '20.00', '2')
        RETURNING *;`
    );
  });
  test("works with mutliple values to insert", () => {
    const input = formatTreasureData([
      {
        treasure_name: "treasure-a",
        colour: "turquoise",
        age: 200,
        cost_at_auction: "20.00",
        shop_id: 2,
      },
      {
        treasure_name: "treasure-d",
        colour: "azure",
        age: 100,
        cost_at_auction: "1001.00",
        shop_id: 4,
      },
      {
        treasure_name: "treasure-b",
        colour: "gold",
        age: 13,
        cost_at_auction: "500.00",
        shop_id: 6,
      },
    ]);
    expect(insertTreasures(input)).toBe(
      `INSERT INTO treasures
            (treasure_name, colour, age, cost_at_auction, shop_id)
        VALUES
            ('treasure-a', 'turquoise', '200', '20.00', '2'), ('treasure-d', 'azure', '100', '1001.00', '4'), ('treasure-b', 'gold', '13', '500.00', '6')
        RETURNING *;`
    );
  });
});
