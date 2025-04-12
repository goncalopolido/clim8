const express = require('express');
const api = express.Router();

const weather = require("../controllers/weather")

api.get("/weather", weather.getWeather)

module.exports = api