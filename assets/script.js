//current day forecast
//running renderserached cities on page load
renderSearchedCities();
//giving current day
function getDate() {
  return moment().format("M/D/YYYY");
}

//on click of serach button, render time, city name and append it and render data from all ajax requests
$("#weather-button").on("click", function () {
  var city = $("#city-search").val().trim().toUpperCase();
  console.log(city);
  var img = $("<img>").attr("id", "icon");
  $('#currentDay').empty();
  $("#currentDay").append(`${city} (${getDate()})`);
  $("#currentDay").append(img);
  getWeather(city);
  getForecast(city);
  saveCitySearch(city);
  renderSearchedCities();
});
//gettimg some data from api for current weathe
function getWeather(city) {
  console.log(city);
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=ab7afee7d221b9419dfc14b3226e191d",
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#temperature").text(response.main.temp + "F");
    $("#humidity").text(response.main.humidity);
    $("#windSpeed").text(response.wind.speed);
    var icon = $("#icon").attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    console.log(lat, lon);
    getUV(lat, lon);
  });
}
//UV Index

function getUV(lat, lon) {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=ab7afee7d221b9419dfc14b3226e191d",
    method: "GET",
  }).then(function (response) {
    var uvIndex = response.value;
    console.log(uvIndex);
    $("#uvIndex").text(uvIndex);
    if ((uvIndex > 0) & (uvIndex <= 2)) {
      $("#uvIndex").css("color", "green");
    } else if ((uvIndex > 2) & (uvIndex <= 7)) {
      $("#uvIndex").css("color", "orange");
    } else {
      $("#uvIndex").css("color", "red");
    }
    $(".currentWeather-section").removeClass("hidden");
  });
}
// 5 day forcast, appending the result because already enough hard coded html elements, did not want to have a very long html

function getForecast(city) {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&cnt=5&appid=ab7afee7d221b9419dfc14b3226e191d",
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $(".forecastWeather-section").empty();
    response.list.forEach(function (day, index) {
      console.log(index);
      console.log(day.main.temp);
      console.log(day.main.humidity);
      var container = $("<div>");
      container.addClass("col");
      container.addClass("day");
      var date = $("<strong>").text(
        moment()
          .add(index + 1, "days")
          .format("M/D/YYYY")
      );
      container.append(date);
      var forecastIcon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png"
      );
      container.append(forecastIcon);
      var forecastTemp = $("<p>")
        .text("Temp: " + day.main.temp + "F")
        .addClass("temperature");
      container.append(forecastTemp);
      var forecastHumidity = $("<p>")
        .text("Humidity: " + day.main.humidity)
        .addClass("humidity");
      container.append(forecastHumidity);
      $(".forecastWeather-section").append(container);
    });
    $(".forecastWeather-section").removeClass("hidden");
  });
}

//save citysearch in local storage
function saveCitySearch(city) {
  var data = fetchSearchedCity();
  if (!data.cities) {
    data.cities = [];
  } 
  //ensure no dupicate
  if (data.cities.includes(city)) {
    var i = data.cities.indexOf(city);
    data.cities.splice(i,1);
  }

  data.cities.unshift(city);
  localStorage.setItem("searchedCity", JSON.stringify(data));
}

//fetch the searched city from local storage
function fetchSearchedCity() {
  var data = localStorage.getItem("searchedCity");
  if (data) {
    return JSON.parse(data);
  } else {
    return {};
  }
}

//render the searched city history and ensure that when user click on city from history the data from apiwill be displayed
function renderSearchedCities() {
  var data = fetchSearchedCity();
  $("#citiesSearched").empty();
  if (data.cities) {
    data.cities.forEach(function (city) {
      var container = $("<div>");
      container.text(city);
      container.on("click", function (event) {
        $("#city-search").val(event.target.innerText);
        $("#weather-button").click();
      });
      $("#citiesSearched").append(container);
    });
  }
}

