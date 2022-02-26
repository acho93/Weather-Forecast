var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var todayForecastEl = document.querySelector("#today-forecast");
var fivedayForecastEl = document.querySelector("#fiveday-forecast");

const cityNameEl = document.getElementById("#city-name");
const weatherIconEl = document.getElementById("weather-icon");
const currentUvEl = document.getElementById("#uvIndex");

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
        var city = cityArray[i]
        if (i==0) {
            getForecast(city);
            fivedayForecast(city);
        }
        $("#search-history").append("<p><button class='btn'>" + city + "</button></p>");
    }
};

getSearchHistory();

var emptyStorage = function () {
    $("#city-name").empty();
    $("#currentDate").empty();
    $("#currentTemp").empty();
    $("#currentWind").empty();
    $("#currentHumid").empty();
    $("#uvIndex").empty();
    $(weatherIconEl).removeAttr("src");
    $("#fiveday-card").empty();
  };

$("#reset").click(function () {
    cityArray = [];
    localStorage.clear();
    $("#search-history").empty();

    emptyStorage();
})

$(document).on("click","#search-history > p > .btn",function (event) {
    var city = $(this).text()

    getForecast(city);
    fivedayForecast(city);
})

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = $("#city-input").val();

    if (city) {
        getForecast(city);
        fivedayForecast(city);

        cityInputEl.value = '';
    } else {
        alert("Please enter a valid city!");
    }

    cityArray.push(city);
    saveSearchHistory();
    $("#search-history").append("<p><button class='btn btn-color'>" + city + "</button></p>");
    
    emptyStorage();
};

function getForecast (city) {
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
            
            var forecastData = $("#today-forecast > .card-body-today > p")
            forecastData.empty();

            var nameData = $("#today-forecast #city-name")
            nameData.empty();

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
                    $("#uvIndex").append("UV Index: ");
                    $("#uvIndex").append(uvIndex);
                });
        })
};

function fivedayForecast (city) {
    var apiFive = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&cnt=6&appid=" + apiKey;

    fetch(apiFive)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            $("#fiveday-card").empty();
            $("#fiveday-forecast").append();

            for (var i = 0; i < 5; i++) {
                var fiveContainer = $("<div class='card fiveContainer'></div>")

                var fivedayDate = moment().add(i + 1, 'days').format('L');
                fiveContainer.append(fivedayDate);

                var fivedayIcon = response.list[i].weather[0].icon;
                fiveDayIconImg = document.createElement("img");
                fiveDayIconImg.setAttribute("src", "https://openweathermap.org/img/wn/" + fivedayIcon + "@2x.png")
                fiveContainer.append(fiveDayIconImg);

                var fivedayTemp = response.list[i].main.temp;
                fiveContainer.append("<p class='card-text'>Temperature: " + fivedayTemp + "°F</p>");

                var fivedayWind = response.list[i].wind.speed;
                fiveContainer.append("<p class='card-text'>Wind: " + fivedayWind + " mph</p>")

                var fivedayHumid = response.list[i].main.humidity;
                fiveContainer.append("<p class='card-text'>Humidity: " + fivedayHumid + "%</p>")

                $("#fiveday-card").append(fiveContainer);
            }
        });
};

searchFormEl.addEventListener("submit", formSubmitHandler);
  

