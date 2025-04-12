const express = require('express');
const api = express.Router();

const weather = require("../controllers/weather")
const forecast = require("../controllers/forecast")

api.get("/weather", weather.getWeather)
api.get("/forecast", forecast.getForecast)


module.exports = api