var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var todayForecastEl = document.querySelector("#today-forecast");
var fivedayForecastEl = document.querySelector("#fiveday-forecast");

const cityNameEl = document.getElementById("#city-name");
const weatherIconEl = document.getElementById("weather-icon");
const currentUvEl = document.getElementById("#uvIndex");
const fivedayIconEl = document.getElementById("#fiveday-icon");

var apiKey = "7a3dbfc8c9397a95663108b4ab8a286e";
var cityArray = [];

var saveSearchHistory = function () {
    localStorage.setItem("searchHistory", JSON.stringify(cityArray));
};

var getSearchHistory = function () {
    var savedCities = localStorage.getItem("searchHistory");

    if (savedCities) {
        cityArray = JSON.parse(savedCities);
    }

    for (var i = 0; i < cityArray.length; i++) {
        $("#search-history").append("<p><button class='btn'>" + cityArray[i] + "</button></p>");
    }
};

var emptyStorage = function () {
    $("#city-name").empty();
    $("#currentDate").empty();
    $("#currentTemp").empty();
    $("#currentWind").empty();
    $("#currentHumid").empty();
    $("#uvIndex").empty();
    // ADD DATA FOR CLEARING FIVE DAY
  };

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = $("#city-input").val();

    if (city) {
        getForecast(city);

        cityInputEl.value = '';
    } else {
        alert("Please enter a valid city!");
    }

    cityArray.push(city);
    saveSearchHistory();
    $("#search-history").append("<p><button class='btn'>" + city + "</button></p>");

    emptyStorage();
};

var getForecast = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response)
            var weatherIcon = response.weather[0].icon;
            var currentTemp = response.main.temp;
            var currentWind = response.wind.speed;
            var currentHumid = response.main.humidity;
            var today = new Date();
            today.toLocaleDateString("en-US")
            
            weatherIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            $("#city-name").append(city + " (" + today.toLocaleDateString("en-US") + ") ");
            $("#currentTemp").append("Temperature: " + currentTemp + "°F");
            $("#currentWind").append("Wind: " + currentWind + " mph");
            $("#currentHumid").append("Humidity: " + currentHumid + "%");
            
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
                    $("#uvIndex").append("UV Index: " + uviData);
                });
        })
    
    var apiFive = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&cnt=6&appid=" + apiKey;

    fetch(apiFive)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response)

            $("#fiveday-forecast").append();

            for (var i = 0; i < 5; i++) {
                var fivedayDate = moment().add(i + 1, 'days').format('L');
                var fivedayIcon = response.list[i].weather[0].icon;
                var fivedayTemp = response.list[i].main.temp;
                var fivedayWind = response.list[i].wind.speed;
                var fivedayHumid = response.list[i].main.humidity;
                
                $("#fivedayDate").append(fivedayDate);
                fivedayIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + fivedayIcon + "@2x.png");
                $("#fivedayTemp").append("Temperature: " + fivedayTemp + "°F");
                $("#fivedayWind").append("Wind: " + fivedayWind + " mph");
                $("fivedayHumid").append("Humidity: " + fivedayHumid + "%");
            }
        })
};

searchFormEl.addEventListener("submit", formSubmitHandler);

