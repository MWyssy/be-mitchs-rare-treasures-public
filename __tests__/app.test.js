const db = require("../db/index");
const testData = require("../db/data/test-data");
const seed = require("../db/seed");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(testData));

describe("GET /api/treasures", () => {
  test("Get status 200 - responds with JSON object containing all treasures in table", () => {
    return request(app)
      .get("/api/treasures")
      .expect(200)
      .then(({ body }) => {
        body.treasures.forEach((treasure) => {
          expect(typeof treasure.treasure_id).toBe("number");
          expect(typeof treasure.treasure_name).toBe("string");
          expect(typeof treasure.colour).toBe("string");
          expect(typeof treasure.age).toBe("number");
          expect(typeof treasure.cost_at_auction).toBe("number");
          expect(typeof treasure.shop_name).toBe("string");
        });
      });
  });
  test("Data sorted by age ascending", () => {
    return request(app)
      .get("/api/treasures")
      .expect(200)
      .then(({ body }) => {
        expect(body.treasures).toBeSortedBy("age");
      });
  });
  test("Accepts a query to change the sort category", () => {
    return request(app)
      .get("/api/treasures?sort_by=cost_at_auction")
      .expect(200)
      .then(({ body }) => {
        expect(body.treasures).toBeSortedBy("cost_at_auction");
      });
  });
  test("Rejects invalid sort query", () => {
    return request(app)
      .get("/api/treasures?sort_by=cost_at_auction;")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Invalid sort query");
      });
  });
  test("Accepts a query to order by ascending or descending", () => {
    return request(app)
      .get("/api/treasures?sort_by=cost_at_auction&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.treasures).toBeSorted({ descending: true });
      });
  });
  test("Rejects invalid sort method", () => {
    return request(app)
      .get("/api/treasures?sort_by=cost_at_auction&order=desc;")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Invalid order query");
      });
  });
  test("Accepts a filter query and responds with filtered treasures", () => {
    return request(app)
      .get("/api/treasures?colour=gold")
      .expect(200)
      .then(({ body }) => {
        expect(body.treasures.length).toBe(2);
        body.treasures.forEach((treasure) => {
          expect(treasure.colour).toBe("gold");
        });
      });
  });
  test("Accepts a second filter query and responds with filtered treasures", () => {
    return request(app)
      .get("/api/treasures?colour=gold&shop_name=shop-f")
      .expect(200)
      .then(({ body }) => {
        expect(body.treasures.length).toBe(1);
        body.treasures.forEach((treasure) => {
          expect(treasure.colour).toBe("gold");
          expect(treasure.shop_name).toBe("shop-f");
        });
      });
  });
  test("Will return a 400 error if more than two filter queries are used", () => {
    return request(app)
      .get("/api/treasures?colour=gold&shop_name=shop-f&age=13")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Invalid filter query - too many queries!");
      });
  });
  test("Will return a 400 error if an invalid query is used", () => {
    return request(app)
      .get("/api/treasures?nonsense=morenonsense&something=somethingelse")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Invalid filter query used");
      });
  });
  test("Will return a 400 error if an invalid query value is used", () => {
    return request(app)
      .get("/api/treasures?colour=;DROP TABLE treasures")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Invalid filter query value used");
      });
  });
});

describe("POST /api/treasures", () => {
  test("POST status 202 - responds with JSON of added treasure", () => {
    const newTreasure = [{
      treasure_name: "Lee's cat",
      colour: "black",
      age: "6",
      cost_at_auction: 1000000,
      shop_id: 4
    }]
  
    return request(app)
    .post("/api/treasures").send(newTreasure)
    .expect(202)
    .then(({body}) => {
      body.treasures.forEach((treasure) => {
        expect(typeof treasure.treasure_id).toBe("number");
        expect(typeof treasure.treasure_name).toBe("string");
        expect(typeof treasure.colour).toBe("string");
        expect(typeof treasure.age).toBe("number");
        expect(typeof treasure.cost_at_auction).toBe("number");
        expect(typeof treasure.shop_id).toBe("number");
      });
    })
  })
  test("Error if the post content is of the wrong type", () =>{
    const newTreasure = [`
      treasure_name: "Lee's cat",
      colour: "black",
      age: "6",
      cost_at_auction: 1000000,
      shop_id: 4
    `]
    return request(app)
    .post("/api/treasures").send(newTreasure)
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("Invalid content sent, must be of type OBJECT")
    })

  })
  test("Reject if content has incorrect keys", () => {
    const newTreasure = [{
      treasure_name: "Lee's cat",
      colour: "black",
      age: "6",
    }]
    return request(app)
    .post("/api/treasures").send(newTreasure)
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("Incorrect data format - incorrect or incomplete keys")
    })
  })
  test("Rejects if values of content key are of the incorrect format", () => {
    const newTreasure = [{
      treasure_name: "Lee's cat",
      colour: "black",
      age: "6",
      cost_at_auction: 1000000,
      shop_id: true
    }]
  return request(app)
    .post("/api/treasures").send(newTreasure)
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("Incorrect data format - incorrect value type")
    })
  })
})

describe("PATCH /api/treasures/:treasure_id", () => {
  test("Patch 200 status code - returns JSON object of the updated treasure", () => {
    const newTreasurePrice = {
      cost_at_auction: 400
    }
    return request(app)
    .patch("/api/treasures/3").send(newTreasurePrice)
    .expect(200)
    .then(({body}) => {
      expect(body.treasures[0].cost_at_auction).toBe(400)
     })
  })
  test("Reject treasure with invalid id", () => {
    const newTreasurePrice = {
      cost_at_auction: 400
    }
    return request(app)
    .patch("/api/treasures/999").send(newTreasurePrice)
    .expect(404)
    .then(({body}) => {
      expect(body.error).toBe("ID not found")
    })
  })
  test("Rejects treasure with invalid id type", () => {
    const newTreasurePrice = {
      cost_at_auction: 400
    }
    return request(app)
    .patch("/api/treasures/gold").send(newTreasurePrice)
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("Incorrect ID format - must be a number")
    })
  })
  test("Reject update if sent anything but cost at auction", () => {
    const newTreasurePrice = {
      shop_id: 400
    }
    return request(app)
    .patch("/api/treasures/3").send(newTreasurePrice)
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("patch request can only accept cost_at_auction as key")
    })
  })
  test("Rejects update of cost_at_auction value is not a number", () => {
    const newTreasurePrice = {
      cost_at_auction: "400;"
    }
    return request(app)
    .patch("/api/treasures/3").send(newTreasurePrice)
    .expect(400)
    .then(({body}) => {
     expect(body.error).toBe("cost_at_auction value must be a number")
     })
  })
})

describe("DELETE /api/treasures/:treasure_id", () => {
  test("Delete 200 status code - returns JSON object of deleted object" , () => {
    return request(app)
    .delete("/api/treasures/3")
    .expect(200)
    .then(({body}) => {
      
      expect(body.treasures[0].treasure_id).toBe(3)
    })
  })
  test("Treasure with ID 3 is no longer in treasures table", () => {
    return request(app)
    .get("/api/treasures")
    .then(({body}) => {
      body.treasures.forEach((treasure) => {
        expect(treasure.treasure_id).not.toBe(3)
      })
    })
  })
})

afterAll(() => db.end());
