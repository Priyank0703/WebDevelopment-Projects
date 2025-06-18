// Select DOM elements
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// Initialize default tab
oldTab.classList.add("current-tab");
getFromSessionStorage();

// Handle tab switch
function switchTab(newTab) {
    if (oldTab !== newTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => switchTab(userTab));
searchTab.addEventListener('click', () => switchTab(searchTab));

// Check for stored coordinates
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// Fetch weather using coordinates
async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");

        if (data.cod === 200) {
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Failed to fetch location weather:", error.message);
        alert("Unable to fetch weather data.");
    }
}

// Show weather info in UI
function renderWeatherInfo(weatherInfo) {
    document.querySelector("[data-cityName]").innerText = weatherInfo?.name;
    document.querySelector("[data-countryIcon]").src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    document.querySelector("[data-weatherDesc]").innerText = weatherInfo?.weather?.[0]?.description;
    document.querySelector("[data-weatherIcon]").src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    document.querySelector("[data-temp]").innerText = `${weatherInfo?.main?.temp} °C`;
    document.querySelector("[data-windspeed]").innerText = `${weatherInfo?.wind?.speed} m/s`;
    document.querySelector("[data-humidity]").innerText = `${weatherInfo?.main?.humidity}%`;
    document.querySelector("[data-cloudiness]").innerText = `${weatherInfo?.clouds?.all}%`;
}

// Handle grant location button
grantAccessButton.addEventListener('click', getLocation);

// Request user location
function getLocation() {
    console.log("Requesting location permission...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, showError);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Save and use coordinates
function showLocation(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

// Handle geolocation errors
function showError(error) {
    console.error("Geolocation error:", error.message);
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Location permission denied. Please allow access to view weather.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location unavailable.");
            break;
        case error.TIMEOUT:
            alert("Location request timed out.");
            break;
        default:
            alert("An unknown error occurred.");
            break;
    }
}

// Handle search form submission
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = searchInput.value.trim();
    if (cityName) {
        fetchSearchWeatherInfo(cityName);
    }
});

// Fetch weather by city name
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");

        if (data.cod === 200) {
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Search error:", error.message);
        alert("City not found or API error.");
    }
}
