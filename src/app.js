const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Remova essa rota
app.use("*", (req, res) => res.sendStatus(501));

module.exports = app;
