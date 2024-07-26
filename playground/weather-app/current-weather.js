// src/components/CurrentWeather.js
import React from 'react';

const CurrentWeather = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="current-weather">
      <h2>Current Weather in {data.name}</h2>
      <p>Temperature: {data.main.temp}°C</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind Speed: {data.wind.speed} m/s</p>
    </div>
  );
};

export default CurrentWeather;
