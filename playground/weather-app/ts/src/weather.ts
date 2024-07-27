interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

interface IForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: Array<{ description: string }>;
}

interface ForecastData {
  list: IForecastItem[];
}
export function weather(app: HTMLElement) {
  const searchInput: HTMLInputElement = app.querySelector(
    "#search-input"
  )! as HTMLInputElement;
  const btn: HTMLButtonElement = app.querySelector("#search-btn")!;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(searchInput.value);
    let city = searchInput.value.trim();
    let API_KEY = import.meta.env.VITE_API_KEY;
    console.log(API_KEY)
    if (!API_KEY)
        return;
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!currentWeatherResponse.ok || !forecastResponse.ok)
      throw new Error("Something went wrong");
    const weatherRes = await currentWeatherResponse.json();
    const forecastRes = await forecastResponse.json();
    console.log({ weatherRes, forecastRes });
    searchInput.value = "";

    const createDiv = () => {
      const div = document.createElement("div");
      div.classList.add("current-weather");

      return div;
    };
    const createH2 = (text: string) => {
      const h2 = document.createElement("h2");
      h2.textContent = text;
      return h2;
    };

    const createP = (text: string) => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    };

    const fragment = document.createDocumentFragment();

    const weatherDiv = createDiv();
    weatherDiv.appendChild(createH2(`Current Weather in ${weatherRes.name}`));
    weatherDiv.appendChild(createP(`Temperature: ${weatherRes.main.temp}°C`));
    weatherDiv.appendChild(createP(`Humidity: ${weatherRes.main.humidity}%`));
    weatherDiv.appendChild(createP(`Wind Speed: ${weatherRes.wind.speed} m/s`));
    
    fragment.appendChild(weatherDiv);
    
    const forecastDiv = createDiv();
    forecastDiv.classList.add("forecast");
    forecastDiv.appendChild(createH2("5-Day Forecast"));
    
    const forecastListDiv = createDiv();
    forecastListDiv.classList.add("forecast-list");
    
    forecastRes.list.forEach(({ dt_txt, main, weather }: IForecastItem) => {
      const forecastItemDiv = createDiv();
      forecastItemDiv.classList.add("forecast-item");
      forecastItemDiv.appendChild(createP(new Date(dt_txt).toLocaleDateString()));
      forecastItemDiv.appendChild(createP(`Temp: ${main.temp}°C`));
      forecastItemDiv.appendChild(createP(`${weather[0].description}`));
      forecastListDiv.appendChild(forecastItemDiv);
    });
    
    forecastDiv.appendChild(forecastListDiv);
    fragment.appendChild(forecastDiv);
    
    document.querySelector("#weather-container")!.appendChild(fragment);
    
  });
}
