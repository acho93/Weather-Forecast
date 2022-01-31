var cityInputEl = document.querySelector("#cityname");

var todayForecastEl = document.querySelector("#today-forecast");
var fivedayForecastEl = document.querySelector("#fiveday-forecast");

var apiKey = "7a3dbfc8c9397a95663108b4ab8a286e";

var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getForecast(city);

        todayForecastEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert("Please enter a valid city!");
    }
};

var getForecast = function () {
    var city = $("#cityname").val();
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (response) {
            var weatherIcon = response.current.weather[0].icon;
            var currentTemp = response.current.temp;
            var currentWind = response.current.wind_speed;
            var currentHumid = response.current.humidity;

            // Add $ to append to HTML
        })

    var lat = uvResponse.data.coord.lat;
    var lon = uvResponse.data.coord.lon;
    var apiUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid" + apiKey;

    fetch(apiUv)
        .then(function (uvResponse) {
            return uvResponse.json();
        })
        .then(function (uvResponse) {
            let uvIndex = uvResponse.value;

            // Append uvIndex to HTML

            if (uvIndex >= 0 && uvIndex < 3) {
                uvIndex.setAttribute("class", "uv-favorable");
            }
            else if (uvIndex >= 3 && uvIndex < 8) {
                uvIndex.setAttribute("class", "uv-moderate");
            }
            else {
                uvIndex.setAttribute("class", "uv-severe");
            }
    })


};



var displayResults = function (cities, searchTerm) {

};

userFormEl.addEventListener("submit", formSubmitHandler);