const joi = require('joi');

const voteSchema = joi.object({
    candidateNumber: joi.number().required(),
    cpf: joi.string().required()
});

module.exports = voteSchema;