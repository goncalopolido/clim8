const express = require('express');
const api = express.Router();

const weather = require("../controllers/weather")
const forecast = require("../controllers/forecast")
const geocode = require("../controllers/geocode")

api.get("/weather", weather.getWeather)
api.get("/forecast", forecast.getForecast)
api.get("/geocode", geocode.getGeocode)


module.exports = api