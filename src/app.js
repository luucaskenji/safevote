const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const votesController = require('./controllers/votesController');

app.post('/votes', votesController.postVote);

module.exports = app;
