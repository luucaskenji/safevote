const { Sequelize } = require('sequelize');
const voteSchema = require('../schemas/votes');
const { validate } = require('gerador-validador-cpf');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

async function postVote(req, res) {
    const { candidateNumber, cpf } = req.body;
    
    // if (!candidateNumber || !cpf) return res.status(400).send('Fields missing');

    if (voteSchema.validate(req.body).error || !validate(req.body.cpf)) {
        return res.status(422).send('Data in wrong pattern');
    }

    const requiredCandidate = await Candidate.findOne({ where: { number: candidateNumber } });

    if (!requiredCandidate) return res.status(403).send('Candidate not found');

    await Vote.create({ candidateId: requiredCandidate.dataValues.id, cpf });

    res.sendStatus(201);
}

async function getVotes(req, res) {
    const votes = await Vote.findAll({
        raw: true,
        group: ['"candidateId"', 'candidate.name', 'candidate.number'],
        attributes: ['candidate.number', 'candidate.name', [Sequelize.fn('COUNT', 'cpf'), 'numberOfVotes']],
        include: [
            {
                model: Candidate,
                attributes: [],
                required: true
            }
        ]
    });

    console.log(votes);

    res.status(200).send(votes);
}

module.exports = { postVote, getVotes};