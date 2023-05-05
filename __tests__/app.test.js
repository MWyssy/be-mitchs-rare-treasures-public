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

afterAll(() => db.end());
