const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

// Remova essa rota
app.use("*", (req, res) => res.sendStatus(501));

module.exports = app;
