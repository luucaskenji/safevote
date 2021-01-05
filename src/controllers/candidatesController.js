const Candidate = require('../models/Candidate');
const candidateSchema = require('../schemas/candidates');

async function postCandidate(req, res) {
    const { number, name } = req.body;

    if (candidateSchema.validate(req.body).error) {
        return res.status(422).send('Fields missing or data in wrong pattern');
    }

    const [candidate, hasBeenCreated] = await Candidate.findOrCreate({ where: { number, name } });

    if (!hasBeenCreated) return res.status(409).send('Repeated number');

    res.sendStatus(201);
}

module.exports = { postCandidate };