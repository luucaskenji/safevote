const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Candidate = require('./Candidate');

class Vote extends Sequelize.Model {}

Vote.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true
        },
        candidateId: Sequelize.INTEGER,
        cpf: Sequelize.STRING 
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'vote'
    }
);

Vote.belongsTo(Candidate);

module.exports = Vote;