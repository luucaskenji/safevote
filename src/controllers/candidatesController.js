const Candidate = require('../models/Candidate');
const candidateSchema = require('../schemas/candidates');

async function postCandidate(req, res) {
    const { number, name } = req.body;

    if (candidateSchema.validate(req.body).error) {
        return res.status(422).send('Fields missing or data in wrong pattern');
    }

    const isRepeated = await Candidate.findOne({ where: { number } });

    if (isRepeated) return res.status(409).send('Repeated number');

    await Candidate.create({ number, name });

    res.sendStatus(201);
}

module.exports = { postCandidate };