var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#cityname");
var todayForecastEl = document.querySelector("#today-forecast");
var fivedayForecastEl = document.querySelector("#fiveday-forecast");

// Add other constants
const cityNameEl = document.getElementById("#city-name");
const currentUvEl = document.getElementById("#uvIndex");

var apiKey = "7a3dbfc8c9397a95663108b4ab8a286e";

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = $("#cityname").val();
    if (city) {
        getForecast(city);

        todayForecastEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert("Please enter a valid city!");
    }
};

var getForecast = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (response) {
            console.log("HELLO", response)
            var weatherIcon = response.weather[0].icon;
            var currentTemp = response.main.temp;
            var currentWind = response.wind.speed;
            var currentHumid = response.main.humidity;

            $("#today-forecast").addClass("#today-forecast");
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            var apiUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            
            fetch(apiUv)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    let uvIndex = document.createElement("span");
                    var uviData = response.daily[0].uvi 
                    if (uviData < 3) {
                        uvIndex.setAttribute("class", "uv-favorable");
                    }
                    else if (uviData >= 3 && uviData < 6) {
                        uvIndex.setAttribute("class", "uv-moderate");
                    }
                    else {
                        uvIndex.setAttribute("class", "uv-severe");
                    }
                    uvIndex.innerHTML = uviData;
                    // var currentUvEl = $("#uvIndex")
                    // currentUvEl.innerHTML = "UV Index: ";
                    currentUvEl.textContent = "UV Index: ";
                    currentUvEl.append(uvIndex);
                });

        })



};



// var displayResults = function (cities, searchTerm) {

// };

searchFormEl.addEventListener("submit", formSubmitHandler);