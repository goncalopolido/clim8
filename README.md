# clim8

A beautiful, minimalistic weather app that delivers real-time data using the OpenWeather API.

![image](https://github.com/user-attachments/assets/3da24ac2-6fb4-439b-9700-e609d5c643e9)

## Features

- Real-time weather: temperature, humidity, wind speed, pressure, and "feels like"
- 5-day forecast with 3-hour intervals
- Auto dark/light theme based on system settings
- Fully responsive for desktop, tablet, and mobile
- City + country code search and browser geolocation
- Unit switch: Metric (°C, m/s) ↔ Imperial (°F, mph)
- Detailed wind info, sunrise & sunset times
- Express backend with OpenWeather API proxy

## Quick Start

```bash
# Clone repository
git clone https://github.com/goncalopolido/clim8

# Install dependencies
cd clim8 && npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenWeather API key

# Start the server
npm run dev

# clim8 is now running on http://localhost:3000
```

## Live Demo
You can try clim8 live at: [clim8.polido.pt](https://clim8.polido.pt/)

## Notice

clim8 currently uses OpenWeather API v2.5 for weather data and v1.0 for geocoding. Future updates to the OpenWeather API may introduce changes that affect compatibility. If newer API versions are released, updating the endpoints and data handling logic may be required.

## Acknowledgments

- Weather data: [OpenWeather](https://openweathermap.org/)
- Weather icons: [basmilius/weather-icons](https://github.com/basmilius/weather-icons)

## License

```
MIT License

Copyright (c) 2025 goncalopolido

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
