const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Vote = require('./Vote');

class Candidate extends Sequelize.Model {}

Candidate.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true
        },
        number: Sequelize.INTEGER,
        name: Sequelize.STRING 
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'candidate'
    }
);

Candidate.hasMany(Vote)

module.exports = Candidate;