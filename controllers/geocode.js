// @desc    descricao da rota
// @route   get /api/geocode
// @access  public
const getGeocode = async function (req, res) {
  const { q } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location data" });
  }
};

module.exports = {
  getGeocode,
};
