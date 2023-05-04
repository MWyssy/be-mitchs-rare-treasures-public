const db = require("../db/index");
const testData = require("../db/data/test-data");
const seed = require("../db/seed");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(testData));

describe("GET /api/treasures", () => {
  test("Get status 200 - responds with JSON object containing all treasures in table", () => {
    return request(app).get("/api/treasures")
    .expect(200)
    .then(({body}) => {
      body.treasures.forEach((treasure) => {
        expect(typeof treasure.treasure_id).toBe("number")
        expect(typeof treasure.treasure_name).toBe("string")
        expect(typeof treasure.colour).toBe("string")
        expect(typeof treasure.age).toBe("number")
        expect(typeof treasure.cost_at_auction).toBe("number")
        expect(typeof treasure.shop_name).toBe("string")
      })

    });
  });
  test("Data sorted by age ascending", () => {
    return request(app).get("/api/treasures")
    .expect(200)
    .then(({body}) => {
      expect(body.treasures[0].age).toBe(1)
      expect(body.treasures[body.treasures.length - 1].age).toBe(10865)
    })
  })
  test("Accepts a query to change the sort category", () => {
    return request(app).get("/api/treasures?sort_by=cost_at_auction")
    .expect(200)
    .then(({body}) => {
      expect(body.treasures[0].cost_at_auction).toBe(0.01)
      expect(body.treasures[body.treasures.length - 1].cost_at_auction).toBe(99999.99)
    })
  })
  test("Rejects invalid sort query", () => {
    return request(app).get("/api/treasures?sort_by=cost_at_auction;")
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("Invalid sort query")
    })
  })
  test("Accepts a query to order by ascending or descending", () => {
    return request(app).get("/api/treasures?sort_by=cost_at_auction&order=desc")
    .expect(200)
    .then(({body}) => {
      expect(body.treasures[0].cost_at_auction).toBe(99999.99)
      expect(body.treasures[body.treasures.length - 1].cost_at_auction).toBe(0.01)
    })
    })
    test("Rejects invalid sort method", () => {
      return request(app).get("/api/treasures?sort_by=cost_at_auction&order=desc;")
    .expect(400)
    .then(({body}) => {
      expect(body.error).toBe("Invalid order query")
    })
    });
    test("Accepts a filter query and respons with filtered treasures", () => {
      return request(app).get("/api/treasures?colour=gold")
      .expect(200)
      .then(({body}) => {
        console.log(body)
        body.treasures.forEach((treasure) => {
          console.log(treasure)
          expect(treasure.colour).toBe("gold")
        })
      })
    })
});

afterAll(() => db.end());
