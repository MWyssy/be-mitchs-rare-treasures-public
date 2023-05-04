const db = require("../db/index");
const testData = require("../db/data/test-data");
const seed = require("../db/seed");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("", () => {
  test("", () => {
    console.log(process.env.PGDATABASE);
    expect().toBe();
  });
});
