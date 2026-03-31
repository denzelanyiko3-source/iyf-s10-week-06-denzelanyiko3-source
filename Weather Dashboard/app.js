const API_KEY = "f22c38d272a1981aa80d61b84385ad80";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const HISTORY_KEY = "weatherHistory";
const MAX_HISTORY_ITEMS = 5;

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const searchHistory = document.getElementById("search-history");
const clearHistoryBtn = document.getElementById("clear-history");
const locationBtn = document.getElementById("location-btn");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

async function getWeatherByCity(city) {
    const query = `q=${encodeURIComponent(city)}`;
    return fetchWeather(query);
}

async function getWeatherByCoords(latitude, longitude) {
    const query = `lat=${latitude}&lon=${longitude}`;
    return fetchWeather(query);
}

async function fetchWeather(query) {
    const url = `${BASE_URL}?${query}&appid=${API_KEY}&units=metric`;

    showLoading();
    hideError();

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling and try again.");
            }

            throw new Error(data.message || "Unable to fetch weather data right now.");
        }

        displayWeather(data);
        saveToHistory(data.name);
        cityInput.value = data.name;
    } catch (err) {
        weatherDisplay.classList.add("hidden");
        showError(err.message || "A network error occurred. Please try again.");
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    const [currentWeather] = data.weather;

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
    weatherIcon.alt = currentWeather.description;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = capitalizeWords(currentWeather.description);
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    updateTheme(currentWeather.main);
    weatherDisplay.classList.remove("hidden");
}

function updateTheme(condition) {
    const normalized = condition.toLowerCase();
    const body = document.body;
    body.className = "";

    if (normalized.includes("cloud")) {
        body.classList.add("theme-clouds");
        return;
    }

    if (normalized.includes("rain") || normalized.includes("drizzle") || normalized.includes("thunderstorm")) {
        body.classList.add("theme-rain");
        return;
    }

    if (normalized.includes("snow")) {
        body.classList.add("theme-snow");
        return;
    }

    body.classList.add("theme-clear");
}

function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}

function hideError() {
    error.textContent = "";
    error.classList.add("hidden");
}

function getHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveToHistory(city) {
    const normalizedCity = city.trim();
    const history = getHistory().filter(
        (item) => item.toLowerCase() !== normalizedCity.toLowerCase()
    );

    history.unshift(normalizedCity);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));
    renderHistory();
}

function renderHistory() {
    const history = getHistory();

    if (history.length === 0) {
        searchHistory.innerHTML = '<p class="empty-history">No recent searches yet.</p>';
        return;
    }

    searchHistory.innerHTML = history
        .map(
            (city) => `
                <button type="button" class="history-chip" data-city="${city}">
                    ${city}
                </button>
            `
        )
        .join("");
}

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
}

function capitalizeWords(value) {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeatherByCity(city);
});

searchHistory.addEventListener("click", (event) => {
    const button = event.target.closest(".history-chip");

    if (button) {
        getWeatherByCity(button.dataset.city);
    }
});

clearHistoryBtn.addEventListener("click", clearHistory);

locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    hideError();
    showLoading();

    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            getWeatherByCoords(coords.latitude, coords.longitude);
        },
        () => {
            hideLoading();
            showError("Unable to access your location. Please allow permission or search manually.");
        }
    );
});

renderHistory();