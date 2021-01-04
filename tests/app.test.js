const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");
const supertest = require("supertest");

const { createVotesFor } = require("./utils");
const app = require("../src/app");

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  await db.query("DELETE FROM votes;");
  await db.query("DELETE FROM candidates;");
});

afterAll(async () => {
  await db.end();
});

describe("POST /votes", () => {
  it("Should return 422 if there is no candidateNumber param", async () => {
    const body = {
      cpf: "05737739040",
    };

    const response = await agent.post("/votes").send(body);

    expect(response.status).toBe(422);
  });

  it("Should return 422 if there is no cpf param", async () => {
    const body = {
      candidateNumber: 171,
    };

    const response = await agent.post("/votes").send(body);

    expect(response.status).toBe(422);
  });

  it("Should return 422 if cpf is not valid", async () => {
    const body = {
      candidateNumber: 171,
      cpf: "11111111111",
    };

    const response = await agent.post("/votes").send(body);

    expect(response.status).toBe(422);
  });

  it("Should return 403 if there is no candidate with given number", async () => {
    const body = {
      candidateNumber: 999,
      cpf: "05737739040",
    };

    const response = await agent.post("/votes").send(body);

    expect(response.status).toBe(403);
  });

  it("Should return 201 and create vote if values are correct and there a candidate with given candidate number", async () => {
    const body = {
      candidateNumber: 171,
      cpf: "05737739040",
    };
    await db.query(
      'INSERT INTO candidates ("name", "number") values ($1, $2);',
      ["Osvaldo do Posto", 171]
    );

    const response = await agent.post("/votes").send(body);
    const queryResult = await db.query("SELECT * FROM votes WHERE cpf=$1", [
      body.cpf,
    ]);
    const vote = queryResult.rows[0];

    expect(response.status).toBe(201);
    expect(vote).toEqual(
      expect.objectContaining({
        cpf: body.cpf,
      })
    );
  });
});

describe("POST /candidates", () => {
  it("Should return 422 if there is no number param", async () => {
    const body = {
      name: "Pastor Ronildo",
    };

    const response = await agent.post("/candidates").send(body);

    expect(response.status).toBe(422);
  });

  it("Should return 422 if there is no name param", async () => {
    const body = {
      number: 49,
    };

    const response = await agent.post("/candidates").send(body);

    expect(response.status).toBe(422);
  });

  it("Should return 422 if there is name param is empty", async () => {
    const body = {
      number: 49,
      name: "",
    };

    const response = await agent.post("/candidates").send(body);

    expect(response.status).toBe(422);
  });

  it("Should return 409 if there is a candidate with given number", async () => {
    const body = {
      number: 49,
      name: "Pastor Ronildo",
    };
    await db.query(
      'INSERT INTO candidates ("name", "number") values ($1, $2)',
      ["Pastor Jonas", 49]
    );

    const response = await agent.post("/candidates").send(body);

    expect(response.status).toBe(409);
  });

  it("Should return 201 and create candidate if values are correct and there no candidate with given candidate number yet", async () => {
    const body = {
      number: 31415133,
      name: "Pastor Ronildo",
    };

    const response = await agent.post("/candidates").send(body);
    const queryResult = await db.query(
      "SELECT * FROM candidates where number=$1",
      [body.number]
    );
    const candidate = queryResult.rows[0];

    expect(response.status).toBe(201);
    expect(candidate).toEqual(expect.objectContaining(body));
  });
});

describe("GET /votes", () => {
  it("Should return 200 with list of votes and candidates", async () => {
    await db.query("INSERT INTO candidates (name, number) values ($1, $2);", [
      "Pastor Jonas",
      8773,
    ]);
    await db.query("INSERT INTO candidates (name, number) values ($1, $2);", [
      "Cristofer Junior",
      123,
    ]);
    await db.query("INSERT INTO candidates (name, number) values ($1, $2);", [
      "Marquinho do Gelo",
      432,
    ]);

    await createVotesFor(db, 8773, 3);
    await createVotesFor(db, 123, 5);

    const response = await agent.get("/votes");
    const votesByCandidates = response.body;

    expect(response.status).toBe(200);
    expect(votesByCandidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          number: 8773,
          name: "Pastor Jonas",
          numberOfVotes: 3,
        }),
        expect.objectContaining({
          number: 123,
          name: "Cristofer Junior",
          numberOfVotes: 5,
        }),
        expect.objectContaining({
          number: 432,
          name: "Marquinho do Gelo",
          numberOfVotes: 0,
        }),
      ])
    );
  });
});
