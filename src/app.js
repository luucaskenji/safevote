const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const votesController = require('./controllers/votesController');
const candidatesController = require('./controllers/candidatesController');

app.post('/votes', votesController.postVote);

app.post('/candidates', candidatesController.postCandidate);

module.exports = app;
