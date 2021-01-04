const { generate } = require("gerador-validador-cpf");

async function createVotesFor(db, candidateNumber, numberOfVotes) {
  for (let i = 0; i < numberOfVotes; i++) await createVote(db, candidateNumber);
}

async function createVote(db, candidateNumber) {
  const cpf = generate();

  const queryResult = await db.query("SELECT id FROM votes WHERE cpf=$1", [
    cpf,
  ]);

  if (!!queryResult.rows[0]) return await createVote(db, candidateNumber);

  const candidateIdQueryResult = await db.query(
    "SELECT id from candidates WHERE number=$1",
    [candidateNumber]
  );

  await db.query('INSERT INTO votes ("candidateId", cpf) values ($1, $2)', [
    candidateIdQueryResult.rows[0].id,
    cpf,
  ]);
}

module.exports = { createVotesFor };
