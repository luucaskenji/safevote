const joi = require('joi');

const candidateSchema = joi.object({
    number: joi.number().required(),
    name: joi.string().required()
});

module.exports = candidateSchema;