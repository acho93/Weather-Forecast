var cityInputEl = document.querySelector("#cityname");

var todayForecastEl = document.querySelector("#today-forecast");
var fivedayForecastEl = document.querySelector("#fiveday-forecast");

var apiKey = "7a3dbfc8c9397a95663108b4ab8a286e";
var uvKey = "2888a7f888d86f8f76a218c861a7626e8668661";

var formSubmitHandler = function(event) {
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

var getForecast = function() {
    var city = $("#cityname").val();
    
    var apiUv = "https://api.geocod.io/v1.7/geocode?q=" + city + "&api_key=" + uvKey;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;

    fetch(apiUv)
    .then(function(uvResponse) {
        return uvResponse.json();
    })
    .then(function(uvResponse) {
        var latitude = uvResponse.results[0].location.lat;
        var longitude = uvResponse.results[0].location.lng;

        var currentCity = uvResponse.results[0].address_components.city;
        var currentState = uvResponse.results[0].address_components.state;

        var currentDate = moment().format('L');

        $("#city-name").append(currentCity + ", " + currentState + "  (" + currentDate + ")");

        fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })

        .then(function(response) { 
            var weatherIcon = response.current.weather[0].icon;
            var currentTemp = response.current.temp;
            var currentWind = response.current.wind_speed;
            var currentHumid = response.current.humidity;
            var currentUV = response.current.uvi;
        })
    }) 
  };



  var displayResults = function(cities, searchTerm) {

  };

userFormEl.addEventListener("submit", formSubmitHandler);