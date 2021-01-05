const voteSchema = require('../schemas/votes');
const { validate } = require('gerador-validador-cpf');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

async function postVote(req, res) {
    const { candidateNumber, cpf } = req.body;
    
    if (!candidateNumber || !cpf) return res.status(400).send('Fields missing');

    if (voteSchema.validate(req.body).error || !validate(req.body.cpf)) {
        return res.status(422).send('Data in wrong pattern');
    }

    const requiredCandidate = await Candidate.findOne({ where: { number: candidateNumber } });

    if (!requiredCandidate) return res.status(403).send('Candidate not found');

    await Vote.create({ candidateId: requiredCandidate.dataValues.id, cpf });

    res.sendStatus(201);
}

module.exports = { postVote };