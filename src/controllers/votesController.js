const voteSchema = require('../schemas/votes');
const { validate } = require('gerador-validador-cpf');

function postVote(req, res) {
    const { candidateNumber, cpf } = req.body;
    
    if (!candidateNumber || !cpf) return res.status(400).send('Fields missing');

    if (voteSchema.validate(req.body).error || !validate(req.body.cpf)) {
        return res.status(422).send('Data in wrong pattern');
    }

    res.status(200).send('OK');
}

module.exports = { postVote }