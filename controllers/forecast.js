// @desc    get forecast data by current location
// @route   get /api/forecast
// @access  public
const getForecast = async function (req, res){
  const { lat, lon, units } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
};

module.exports = {
    getForecast
}