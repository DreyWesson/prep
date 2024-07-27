import './style.css'
import { weather } from './weather.ts'

export const ui = `
  <form>
    <label for="search">
      <input id="search-input" name="search" type="text" placeholder="Enter city name" />
    </label>
    <button data-testid="search-btn" id="search-btn">Search</button>
  </form>
  <div id="weather-container"></div>
  <div id="forecast-container"></div>
`
document.addEventListener("DOMContentLoaded", () => {
  const app :HTMLElement = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = ui;
  weather(app);
})

