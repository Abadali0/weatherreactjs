
import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const searchWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError("API key is missing. Please check your .env file.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "City not found");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message || "Unable to get weather data.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app">

      <div className="weather-container">

        {/* Header */}
        <div className="header">
          <h1>Weather App</h1>
          <p>Check the weather anywhere in the world</p>
        </div>

        {/* Search */}
        <form className="search-box" onSubmit={searchWeather}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="message loading">
            Loading weather...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* Weather */}
        {weather && !loading && (
          <div className="weather-card">

            {/* Location */}
            <div className="location">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>

              <p>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Main Weather */}
            <div className="weather-main">

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <div>
                <h3>
                  {Math.round(weather.main.temp)}°C
                </h3>

                <p>
                  {weather.weather[0].description}
                </p>
              </div>

            </div>

            {/* Weather Information */}
            <div className="weather-info">

              <div className="info-box">
                <span>🌡️</span>
                <h4>Feels Like</h4>
                <p>
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>

              <div className="info-box">
                <span>💧</span>
                <h4>Humidity</h4>
                <p>
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="info-box">
                <span>💨</span>
                <h4>Wind Speed</h4>
                <p>
                  {weather.wind.speed} m/s
                </p>
              </div>

              <div className="info-box">
                <span>🌡️</span>
                <h4>Pressure</h4>
                <p>
                  {weather.main.pressure} hPa
                </p>
              </div>

            </div>

            {/* Sunrise / Sunset */}
            <div className="sun-info">

              <div>
                <span>🌅 Sunrise</span>

                <strong>
                  {formatTime(weather.sys.sunrise)}
                </strong>
              </div>

              <div>
                <span>🌇 Sunset</span>

                <strong>
                  {formatTime(weather.sys.sunset)}
                </strong>
              </div>

            </div>

          </div>
        )}

        {/* Welcome */}
        {!weather && !loading && !error && (
          <div className="welcome">

            <div className="weather-icon">
              ☀️
            </div>

            <h2>
              What's the weather like?
            </h2>

            <p>
              Search for any city to see the current
              weather conditions.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;

