const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

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

module.exports = Vote;