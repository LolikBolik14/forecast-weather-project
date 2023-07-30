// Days and Months
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Time
function time() {
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// Time UTC
function timeUTC(timestamp) {
  let nowUtc = new Date(timestamp);
  let hoursUtc = nowUtc.getUTCHours();
  if (hoursUtc < 10) {
    hoursUtc = `0${hoursUtc}`;
  }
  let minutesUtc = nowUtc.getUTCMinutes();
  if (minutesUtc < 10) {
    minutesUtc = `0${minutesUtc}`;
  }
  return `${hoursUtc}:${minutesUtc}`;
}

// Days of The Week
function daily(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// Forecast HTML
function displayForecast(response) {
  let dailyWeather = response.data.daily;
  let forecastTable = document.querySelector("#forecast-table");

  let tableHTML = `<div class = table-row>`;
  dailyWeather.forEach(function (forecastDay, index) {
    if (index < 7) {
      tableHTML =
        tableHTML +
        ` <table>
    <tr class="week">
    <th>${daily(forecastDay.dt)}</th>
    </tr>
    <tr class="img-weather">
    <td>
    <img src="https://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }@2x.png" alt=" " class="mini-img" />
    </td>
    </tr>
    <tr class="temperature-max">
    <td>${Math.round(forecastDay.temp.max)}°</td>
    </tr>
    <tr class="temperature-min">
    <td>${Math.round(forecastDay.temp.min)}°</td>
    </tr>
    <tr class="pressure">
    <td>${forecastDay.pressure}</td>
    </tr>
    <tr class="humidity">
    <td>${forecastDay.humidity}</td>
    </tr>
    <tr class="wind">
    <td>${Math.round(forecastDay.wind_speed)}</td>
    </tr>
    <tr>
    <td class="precipitation">${100 * forecastDay.pop}</td>
    </tr>
    </table>
    `;
    }
  });
  tableHTML = tableHTML + `</div>`;
  forecastTable.innerHTML = tableHTML;
}

// Forecast API
function getForecast(coordinates) {
  let apiKey = "0a521eaf234a3a56f45252fac3c737ad";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Date
document.querySelector("#number").innerHTML = now.getDate();
document.querySelector("#day").innerHTML = days[now.getDay()];
document.querySelector("#month").innerHTML = months[now.getMonth()];

// Show Currently Weather
function showWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#degrees").innerHTML = temperature;

  document.querySelector("#time").innerHTML = time(response.data.dt * 1000);

  document.querySelector("#sunset").innerHTML = timeUTC(
    (response.data.sys.sunset + response.data.timezone) * 1000
  );
  document.querySelector("#sunrise").innerHTML = timeUTC(
    (response.data.sys.sunrise + response.data.timezone) * 1000
  );

  // Fahrenheit & Celsius
  function fahren(event) {
    event.preventDefault();
    let fahrenheit = Math.round((9 / 5) * temperature + 32);
    document.getElementById("degrees").innerHTML = fahrenheit;
  }

  function cels(event) {
    event.preventDefault();
    let celsius = Math.round(temperature);
    document.getElementById("degrees").innerHTML = celsius;
  }

  let fahrenheitClik = document.getElementById("fahrenheit");
  fahrenheitClik.addEventListener("click", fahren);

  let celsiusClik = document.getElementById("celsius");
  celsiusClik.addEventListener("click", cels);

  getForecast(response.data.coord);
}

// Search By City Name
function searchCity(city) {
  let apiKey = "0a521eaf234a3a56f45252fac3c737ad";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function form(event) {
  event.preventDefault();
  let cityName = document.querySelector("#enter-city");
  searchCity(cityName.value);
}
let formSearching = document.querySelector("#searching");
formSearching.addEventListener("submit", form);

searchCity("Kyiv");
