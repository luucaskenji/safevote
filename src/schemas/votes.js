const joi = require('joi');

const voteSchema = joi.object({
    candidateNumber: joi.number().required(),
    cpf: joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/).required()
});

module.exports = voteSchema;