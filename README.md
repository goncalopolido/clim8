# clim8

A clean, minimalistic weather app that delivers real-time data using the OpenWeather API.

<p align="center">
  <img src="https://github.com/user-attachments/assets/7ab860e7-3416-43f4-99d8-19c5f87800ae" alt="clim8 Preview">
</p>

---

## Features

* Real-time weather information, including temperature, humidity, wind speed, atmospheric pressure, and "feels like" temperature.
* 5-day weather forecast with 3-hour intervals.
* Automatic dark and light theme based on the user's system preferences.
* Fully responsive design for desktop, tablet, and mobile devices.
* Search by city and country code, with optional browser geolocation support.
* Unit switching between Metric (°C, m/s) and Imperial (°F, mph).
* Detailed wind information, including sunrise and sunset times.
* Express.js backend with an OpenWeather API proxy.

---

## Requirements

* Node.js
* npm
* An OpenWeather API key.

> [!TIP]
> Using the latest LTS version of Node.js is recommended for the best compatibility and performance.

---

## Quick Start

Clone the repository:

```bash
git clone https://github.com/goncalopolido/clim8
```

Navigate to the project directory and install the dependencies:

```bash
cd clim8
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and add your OpenWeather API key.

> [!IMPORTANT]
> A valid OpenWeather API key is required. The application will not function correctly without it.

Start the server:

```bash
npm start
```

Once the server is running, clim8 will be available at:

```text
http://localhost:3000
```

---

## Live Demo

A public instance of clim8 is available at **[clim8.vercel.app](https://clim8.vercel.app)**.

---

## Notice

> [!NOTE]
> clim8 currently uses OpenWeather API v2.5 for weather data and v1.0 for geocoding. Future OpenWeather API updates may introduce breaking changes that require updates to the application's endpoints or data handling logic.

---

## Acknowledgments

* Weather data: **[OpenWeather](https://openweathermap.org/)**
* Weather icons: **[basmilius/weather-icons](https://github.com/basmilius/weather-icons)**
