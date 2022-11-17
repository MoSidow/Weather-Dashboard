const API_URL = 'https://api.openweathermap.org';
const API_KEY = '021eb08496143b3e3a5c231da5cd7d11'

var myLocation = document.getElementById('userInput');
var searchButton = document.getElementById('search');
var fiveDayForecast = 6;

var searchedCity;
function showHistoryItem() {

    
  var textval =  document.getElementById("userInput").value,
  listItem = document.getElementById("Saved-list"),
  liItem = document.createElement("li"),
  txtNode = document.createTextNode(textval);
  liItem.addEventListener("click", function () {
    var searchText = liItem.innerHTML;

 

  
  lookUp(searchText);

  });


  liItem.appendChild(txtNode);
  listItem.appendChild(liItem);

  function saveLocation() {
    var new_location = liItem.innerHTML;
    if(localStorage.getItem('cities') == null){
      localStorage.setItem('cities', '[]')
  }

var old_location = JSON.parse(localStorage.getItem('cities'));
old_location.push(new_location);

localStorage.setItem('cities', JSON.stringify(old_location));

}
saveLocation();


  
}

searchButton.addEventListener("click", showHistoryItem)

function getLocation() {
  var userInput = myLocation.value;

 

  // Shows result of location user has enetered
  lookUp(userInput);
}

// Searches the weather for the location the user entered
function lookUp(search) {

  searchedCity = search
  var apiURL = `${API_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${API_KEY}`

  fetch(apiURL)
    .then((response) => response.json())

    .then(data => {

      // Sets the locations weather information 
      const locationInput = data[0];

     

      displayForecast(locationInput);
    });


}

// Displays the weather for the next five days for the location submitted
function FutureWeather(forecastData) {

  const dailyWeathereFuture = document.getElementById('Futureweather');
  dailyWeathereFuture.innerHTML = '';

  // for loop, loops through the five days, displaying each day and its weather
  for (var i = 1; i < fiveDayForecast; i++) {
    var forecast = forecastData.daily[i];
    var day = new Date(forecast.dt * 1000).toLocaleDateString('en-GB');
    var iconCode = forecast.weather[0].icon; 
    var temp = `Temperature: ${forecast.temp.day}°F`;
    var humidity = `Humidity: ${forecast.humidity}%`;
    var wind_speed = `Wind Speed: ${forecast.wind_speed}km/h`;

    var forecastList = document.createElement('div');
    forecastList.classList.add('daily-weather-style');
    // Creates the html for the 5 days
    forecastList.innerHTML =
      `
    <div id="date">
      ${day}
    </div>
    <div>
    ${"<img src=http://openweathermap.org/img/wn/"+iconCode+".png>"}
  </div>
    <div>
      ${temp}
    </div>
    <div>
      ${humidity}
    </div>
    <div>
      ${wind_speed}
    </div>
    `

    dailyWeathereFuture.appendChild(forecastList);
  }
}

// fetches the weather for the current and future days
function getWeather(lat, lon) {

  // Fetches the url to include the locations weather data
  var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=d91f911bcf2c0f925fb6535547a5ddc9`
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      CurrentWeather(data);

      FutureWeather(data);
    })
}


// Display current weather data

  function CurrentWeather(forecastData) {

    const dailyWeather = document.getElementById('Currentweather');
    dailyWeather.innerHTML = '';
  
    
      var forecast = forecastData.current
      var cityname = searchedCity
      var day = new Date(forecast.dt * 1000).toLocaleDateString('en-GB');
      var iconCode = forecast.weather[0].icon; 
      var temp = `Temperature: ${forecast.temp}°F`;
      var humidity = `Humidity: ${forecast.humidity}%`;
      var wind_speed = `Wind Speed: ${forecast.wind_speed}km/h`;
  
      dailyWeather.classList.add('Currentweather');
      dailyWeather.innerHTML =
       
      `
      <div id="name">
        ${cityname}
      </div>
      <div id="date">
        ${day}
      </div>
      <div>
      ${"<img src=http://openweathermap.org/img/wn/"+iconCode+".png>"}
    </div>
      <div>
        ${temp}
      </div>
      <div>
        ${humidity}
      </div>
      <div>
        ${wind_speed}
      </div>
      `
  
      
  }

// Displays the weather forecast for location
function displayForecast(forecastData) {
  document.getElementById('userInput').textContent = `${forecastData.name}`, `${forecastData.country}`;
  getWeather(forecastData.lat, forecastData.lon);
}

searchButton.addEventListener("click",getLocation )
