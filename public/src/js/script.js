let currentLocation = {}
let forecastData = {}
let currentDisplayMode = "all"
let currentSelectedDay = 0
let currentUnit = localStorage.getItem("clim8_unit") || "metric"
let currentTimezoneOffset = 0 // Store the timezone offset from the API

let locationButtonActive = false

const iconMapping = {
  "01d": "clear-day.svg",
  "01n": "clear-night.svg",
  "02d": "partly-cloudy-day.svg",
  "02n": "partly-cloudy-night.svg",
  "03d": "cloudy.svg",
  "03n": "cloudy.svg",
  "04d": "overcast-day.svg",
  "04n": "overcast-night.svg",
  "09d": "overcast-day-rain.svg",
  "09n": "overcast-night-rain.svg",
  "10d": "partly-cloudy-day-rain.svg",
  "10n": "partly-cloudy-night-rain.svg",
  "11d": "thunderstorms-day.svg",
  "11n": "thunderstorms-night.svg",
  "13d": "partly-cloudy-day-snow.svg",
  "13n": "partly-cloudy-night-snow.svg",
  "50d": "fog-day.svg",
  "50n": "fog-night.svg",
}

const getIconUrl = (iconCode) => {
  const svgFileName = iconMapping[iconCode] || "not-available.svg"
  return `src/svg/${svgFileName}`
}

const windDescriptions = [
  { max: 0.2, text: "Calm" },
  { max: 1.5, text: "Light Air" },
  { max: 3.3, text: "Light Breeze" },
  { max: 5.4, text: "Gentle Breeze" },
  { max: 7.9, text: "Moderate Breeze" },
  { max: 10.7, text: "Fresh Breeze" },
  { max: 13.8, text: "Strong Breeze" },
  { max: 17.1, text: "Near Gale" },
  { max: 20.7, text: "Gale" },
  { max: 24.4, text: "Strong Gale" },
  { max: 28.4, text: "Storm" },
  { max: 32.6, text: "Violent Storm" },
  { max: Number.POSITIVE_INFINITY, text: "Hurricane" },
]

const fallbackCities = [
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
]

function getLocationTime(timestamp) {
  const date = new Date(timestamp * 1000)
  // Adjust the date using the timezone offset from the API
  date.setSeconds(date.getSeconds() + currentTimezoneOffset)
  return date
}

function setLoadingPlaceholders() {
  document.getElementById("current-temp").textContent = "--°"
  document.getElementById("feels-like").textContent = "Feels like --°"
  document.getElementById("weather-description").textContent = "--"
  document.getElementById("wind-description").textContent = "--"
  document.getElementById("wind-speed").textContent = "--"
  document.getElementById("humidity").textContent = "--"
  document.getElementById("pressure").textContent = "--"
  document.getElementById("visibility").textContent = "--"
  document.getElementById("sunrise").textContent = "--:--"
  document.getElementById("sunset").textContent = "--:--"
  
  document.getElementById("weather-icon-placeholder").style.display = "flex"
  document.getElementById("weather-icon").classList.add("hidden")
}

function requestLocation() {
  document.getElementById("loading").style.display = "block"
  document.getElementById("error-message").style.display = "none"
  document.getElementById("search-error").style.display = "none"
  setLoadingPlaceholders()

  locationButtonActive = true
  updateLocationButton()

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        currentLocation = { lat, lon }
        getWeatherData(lat, lon)
        getForecastData(lat, lon)
      },
      (error) => {
        console.error("Error getting location:", error)
        const fallbackLocation = getFallbackLocation()
        currentLocation = { lat: fallbackLocation.lat, lon: fallbackLocation.lon }
        document.getElementById("error-message").style.display = "block"
        getWeatherData(fallbackLocation.lat, fallbackLocation.lon)
        getForecastData(fallbackLocation.lat, fallbackLocation.lon)

        locationButtonActive = false
        updateLocationButton()
      },
    )
  } else {
    const fallbackLocation = getFallbackLocation()
    currentLocation = { lat: fallbackLocation.lat, lon: fallbackLocation.lon }
    document.getElementById("error-message").style.display = "block"
    getWeatherData(fallbackLocation.lat, fallbackLocation.lon)
    getForecastData(fallbackLocation.lat, fallbackLocation.lon)

    locationButtonActive = false
    updateLocationButton()
  }
}

function updateLocationButton() {
  const locationBtn = document.getElementById("location-btn")
  if (locationButtonActive) {
    locationBtn.classList.remove("btn-outline")
    locationBtn.classList.add("btn-active")
  } else {
    locationBtn.classList.remove("btn-active")
    locationBtn.classList.add("btn-outline")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setLoadingPlaceholders()

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark-mode")
    document.getElementById("dark-btn").classList.add("btn-active")
    document.getElementById("light-btn").classList.add("btn-outline")
  } else {
    document.getElementById("light-btn").classList.add("btn-active")
    document.getElementById("dark-btn").classList.add("btn-outline")
  }

  document.getElementById("light-btn").addEventListener("click", () => {
    document.body.classList.remove("dark-mode")
    document.getElementById("light-btn").classList.remove("btn-outline")
    document.getElementById("light-btn").classList.add("btn-active")
    document.getElementById("dark-btn").classList.remove("btn-active")
    document.getElementById("dark-btn").classList.add("btn-outline")
  })

  document.getElementById("dark-btn").addEventListener("click", () => {
    document.body.classList.add("dark-mode")
    document.getElementById("dark-btn").classList.remove("btn-outline")
    document.getElementById("dark-btn").classList.add("btn-active")
    document.getElementById("light-btn").classList.remove("btn-active")
    document.getElementById("light-btn").classList.add("btn-outline")
  })

  document.getElementById("location-btn").classList.add("btn-outline")
  document.getElementById("location-btn").addEventListener("click", requestLocation)

  document.getElementById("metric-btn").addEventListener("click", () => {
    if (currentUnit !== "metric") {
      currentUnit = "metric"
      localStorage.setItem("clim8_unit", "metric")
      updateUnitButtons()
      refreshWeatherData()
    }
  })

  document.getElementById("imperial-btn").addEventListener("click", () => {
    if (currentUnit !== "imperial") {
      currentUnit = "imperial"
      localStorage.setItem("clim8_unit", "imperial")
      updateUnitButtons()
      refreshWeatherData()
    }
  })

  updateUnitButtons()

  document.getElementById("search-input").addEventListener("input", () => {
    locationButtonActive = false
    updateLocationButton()
  })

  requestLocation()
  setupSearch()
})

function updateUnitButtons() {
  const metricBtn = document.getElementById("metric-btn")
  const imperialBtn = document.getElementById("imperial-btn")

  if (currentUnit === "metric") {
    metricBtn.classList.remove("btn-outline")
    metricBtn.classList.add("btn-active")
    imperialBtn.classList.remove("btn-active")
    imperialBtn.classList.add("btn-outline")
  } else {
    metricBtn.classList.remove("btn-active")
    metricBtn.classList.add("btn-outline")
    imperialBtn.classList.remove("btn-outline")
    imperialBtn.classList.add("btn-active")
  }
}

function refreshWeatherData() {
  if (currentLocation.lat && currentLocation.lon) {
    getWeatherData(currentLocation.lat, currentLocation.lon)
    getForecastData(currentLocation.lat, currentLocation.lon)
  }
}

function getFallbackLocation() {
  return fallbackCities[Math.floor(Math.random() * fallbackCities.length)]
}

function setupSearch() {
  const searchInput = document.getElementById("search-input")
  const suggestionsContainer = document.getElementById("suggestions")
  const searchError = document.getElementById("search-error")

  let timeoutId

  searchInput.addEventListener("input", () => {
    clearTimeout(timeoutId)
    const query = searchInput.value.trim()

    if (query.length < 2) {
      suggestionsContainer.style.display = "none"
      searchError.style.display = "none"
      return
    }

    timeoutId = setTimeout(() => {
      fetch(`/api/geocode?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            suggestionsContainer.innerHTML = ""
            data.forEach((item) => {
              const suggestion = document.createElement("div")
              suggestion.className = "suggestion-item"
              suggestion.textContent = `${item.name}, ${item.country}`
              suggestion.addEventListener("click", () => {
                searchInput.value = `${item.name}, ${item.country}`
                suggestionsContainer.style.display = "none"
                searchError.style.display = "none"
                currentLocation = { lat: item.lat, lon: item.lon }
                document.getElementById("loading").style.display = "block"
                setLoadingPlaceholders()

                locationButtonActive = false
                updateLocationButton()

                getWeatherData(item.lat, item.lon)
                getForecastData(item.lat, item.lon)
              })
              suggestionsContainer.appendChild(suggestion)
            })
            suggestionsContainer.style.display = "block"
            searchError.style.display = "none"
          } else {
            suggestionsContainer.style.display = "none"
            searchError.style.display = "block"
          }
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error)
          suggestionsContainer.style.display = "none"
          searchError.style.display = "block"
        })
    }, 300)
  })

  document.addEventListener("click", (e) => {
    if (e.target !== searchInput) {
      suggestionsContainer.style.display = "none"
    }
  })
}

function getWeatherData(lat, lon) {
  document.getElementById("loading").style.display = "block"
  document.getElementById("error-message").style.display = "none"
  document.getElementById("search-error").style.display = "none"

  fetch(`/api/weather?lat=${lat}&lon=${lon}&units=${currentUnit}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      currentTimezoneOffset = data.timezone // Store the timezone offset
      updateCurrentWeather(data)
      document.getElementById("loading").style.display = "none"
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error)
      document.getElementById("error-message").style.display = "block"
      document.getElementById("loading").style.display = "none"
    })
}

function getForecastData(lat, lon) {
  fetch(`/api/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      forecastData = data
      updateDayButtons()
      updateForecast()
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error)
    })
}

function getWindDescription(speed) {
  const speedInMps = currentUnit === "imperial" ? speed / 2.237 : speed

  for (const desc of windDescriptions) {
    if (speedInMps <= desc.max) {
      return desc.text
    }
  }
  return "Hurricane"
}

function createDayForecastElement(date, dayForecasts, minTemp, maxTemp, isToday, tempUnit) {
  const forecastContainer = document.getElementById("forecast-days")

  const dayElement = document.createElement("div")
  dayElement.className = "forecast-day"

  const dayHeader = document.createElement("div")
  dayHeader.className = "day-header"

  const dateElement = document.createElement("div")
  dateElement.className = "forecast-date"
  dateElement.textContent = date

  const dayTemps = document.createElement("div")
  dayTemps.className = "day-temps"
  dayTemps.innerHTML = `
        <span class="hour-temp hour-temp-max">
            <img src="src/svg/thermometer-warmer.svg" alt="Max" width="50" height="50" style="vertical-align: middle; margin-right: 4px;">
            ${Math.round(maxTemp)}${tempUnit}
        </span>
        <span class="hour-temp hour-temp-min">
            <img src="src/svg/thermometer-colder.svg" alt="Min" width="50" height="50" style="vertical-align: middle; margin-right: 4px;">
            ${Math.round(minTemp)}${tempUnit}
        </span>
    `

  dayHeader.appendChild(dateElement)
  dayHeader.appendChild(dayTemps)
  dayElement.appendChild(dayHeader)

  const hoursContainer = document.createElement("div")
  hoursContainer.className = "forecast-hours"

  dayForecasts.forEach((forecast) => {
    const hourTime = getLocationTime(forecast.dt)
    const hourElement = document.createElement("div")
    hourElement.className = "forecast-hour"

    const iconUrl = getIconUrl(forecast.weather[0].icon)

    hourElement.innerHTML = `
            <div class="hour-time">${hourTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}</div>
            <img class="hour-icon" src="${iconUrl}" alt="${forecast.weather[0].description}" width="50" height="50">
            <div class="hour-description">${forecast.weather[0].description}</div>
            <div class="hour-temps">
                <span class="hour-temp">${Math.round(forecast.main.temp)}${tempUnit}</span>
            </div>
        `

    hoursContainer.appendChild(hourElement)
  })

  dayElement.appendChild(hoursContainer)
  forecastContainer.appendChild(dayElement)
}

function updateCurrentWeather(data) {
  const locationName = data.name || "Unknown Location"
  const country = data.sys?.country || ""

  document.getElementById("location-name").textContent = country ? `${locationName}, ${country}` : locationName

  const locationTime = getLocationTime(data.dt)
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  document.getElementById("current-date").textContent = locationTime.toLocaleDateString("en-US", options)

  const tempUnit = currentUnit === "metric" ? "°C" : "°F"
  document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)}${tempUnit}`
  document.getElementById("feels-like").textContent = `Feels like ${Math.round(data.main.feels_like)}${tempUnit}`
  document.getElementById("weather-description").textContent = data.weather[0].description

  const windDesc = getWindDescription(data.wind.speed)
  document.getElementById("wind-description").textContent = windDesc

  const iconCode = data.weather[0].icon
  const weatherIcon = document.getElementById("weather-icon")
  weatherIcon.src = getIconUrl(iconCode)
  weatherIcon.alt = data.weather[0].description
  
  document.getElementById("weather-icon-placeholder").style.display = "none"
  weatherIcon.classList.remove("hidden")

  const speedUnit = currentUnit === "metric" ? "m/s" : "mph"
  const speedValue = currentUnit === "metric" ? data.wind.speed : (data.wind.speed * 2.237).toFixed(1)
  document.getElementById("wind-speed").textContent = `${speedValue} ${speedUnit}`

  document.getElementById("humidity").textContent = `${data.main.humidity}%`
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`

  const visibilityUnit = currentUnit === "metric" ? "km" : "miles"
  const visibilityValue =
    currentUnit === "metric" ? (data.visibility / 1000).toFixed(1) : (data.visibility / 1609).toFixed(1)
  document.getElementById("visibility").textContent = `${visibilityValue} ${visibilityUnit}`

  if (data.sys?.sunrise) {
    const sunriseTime = getLocationTime(data.sys.sunrise)
    document.getElementById("sunrise").textContent = sunriseTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  } else {
    document.getElementById("sunrise").textContent = "--:--"
  }

  if (data.sys?.sunset) {
    const sunsetTime = getLocationTime(data.sys.sunset)
    document.getElementById("sunset").textContent = sunsetTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  } else {
    document.getElementById("sunset").textContent = "--:--"
  }
}

function updateDayButtons() {
  if (!forecastData || !forecastData.list) return

  const dayButtonsContainer = document.getElementById("day-buttons")
  dayButtonsContainer.innerHTML = ""

  const dailyForecasts = {}
  const now = getLocationTime(Math.floor(Date.now() / 1000))
  now.setMinutes(0, 0, 0) // Reset minutes and seconds to compare only hours
  const todayString = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  forecastData.list.forEach((forecast) => {
    const date = getLocationTime(forecast.dt)
    const dateString = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

    if (!dailyForecasts[dateString]) {
      dailyForecasts[dateString] = {
        forecasts: [],
        minTemp: Number.POSITIVE_INFINITY,
        maxTemp: Number.NEGATIVE_INFINITY,
        firstForecastTime: date
      }
    }

    dailyForecasts[dateString].forecasts.push(forecast)
    dailyForecasts[dateString].minTemp = Math.min(dailyForecasts[dateString].minTemp, forecast.main.temp_min)
    dailyForecasts[dateString].maxTemp = Math.max(dailyForecasts[dateString].maxTemp, forecast.main.temp_max)
  })

  const forecastDates = Object.keys(dailyForecasts)

  const allButton = document.createElement("button")
  allButton.className = `btn ${currentDisplayMode === "all" ? "btn-active" : "btn-outline"}`
  allButton.textContent = "All Days"
  allButton.addEventListener("click", () => {
    currentDisplayMode = "all"
    updateForecast()
    updateDayButtons()
  })
  dayButtonsContainer.appendChild(allButton)

  forecastDates.forEach((date, index) => {
    const dayButton = document.createElement("button")
    dayButton.className = `btn ${currentDisplayMode === "day" && currentSelectedDay === index ? "btn-active" : "btn-outline"}`

    const forecastDate = dailyForecasts[date].firstForecastTime
    const isToday = forecastDate.toDateString() === now.toDateString()

    const shortDate = forecastDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

    dayButton.textContent = isToday ? "Today" : shortDate
    dayButton.addEventListener("click", () => {
      currentDisplayMode = "day"
      currentSelectedDay = index
      updateForecast()
      updateDayButtons()
    })
    dayButtonsContainer.appendChild(dayButton)
  })
}

function updateForecast() {
  if (!forecastData || !forecastData.list) return

  const forecastContainer = document.getElementById("forecast-days")
  forecastContainer.innerHTML = ""

  const dailyForecasts = {}
  const now = getLocationTime(Math.floor(Date.now() / 1000))
  now.setMinutes(0, 0, 0) // Reset minutes and seconds to compare only hours
  const todayString = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  forecastData.list.forEach((forecast) => {
    const date = getLocationTime(forecast.dt)
    const dateString = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

    if (!dailyForecasts[dateString]) {
      dailyForecasts[dateString] = {
        forecasts: [],
        minTemp: Number.POSITIVE_INFINITY,
        maxTemp: Number.NEGATIVE_INFINITY,
        firstForecastTime: date
      }
    }

    dailyForecasts[dateString].forecasts.push(forecast)
    dailyForecasts[dateString].minTemp = Math.min(dailyForecasts[dateString].minTemp, forecast.main.temp_min)
    dailyForecasts[dateString].maxTemp = Math.max(dailyForecasts[dateString].maxTemp, forecast.main.temp_max)
  })

  const forecastDates = Object.keys(dailyForecasts)
  const tempUnit = currentUnit === "metric" ? "°C" : "°F"

  if (currentDisplayMode === "all") {
    forecastDates.slice(0, 5).forEach((date) => {
      const dayData = dailyForecasts[date]
      const isToday = dayData.firstForecastTime.toDateString() === now.toDateString()
      createDayForecastElement(date, dayData.forecasts, dayData.minTemp, dayData.maxTemp, isToday, tempUnit)
    })
  } else {
    const selectedDate = forecastDates[currentSelectedDay]
    if (selectedDate && dailyForecasts[selectedDate]) {
      const dayData = dailyForecasts[selectedDate]
      const isToday = dayData.firstForecastTime.toDateString() === now.toDateString()
      createDayForecastElement(
        selectedDate,
        dayData.forecasts,
        dayData.minTemp,
        dayData.maxTemp,
        isToday,
        tempUnit,
      )
    }
  }
}
