// let city = "goa";
// const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

// async function showWeather() {
//   const response = await fetch(api);
//   const data = await response.json();
//   console.log("Weather in " + city + ":", data);

//   const para = document.createElement('p')
//   para.textContent = `${data.main.temp.toFixed(2)} ^C`
//   document.body.appendChild(para)

// }
// showWeather();

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "bb871f1fc4f87648c611b946ed2f1ddf";
oldTab.classList.add("current-tab");
// getfromSessionStorage();

function switchTab(newTab) {
  if(newTab != oldTab) {
      oldTab.classList.remove("current-tab");
      oldTab = newTab;
      oldTab.classList.add("current-tab");

      if(!searchForm.classList.contains("active")) {
          //kya search form wala container is invisible, if yes then make it visible
          userInfoContainer.classList.remove("active");
          grantAccessContainer.classList.remove("active");
          searchForm.classList.add("active");
      }
      else {
          //main pehle search wale tab pr tha, ab your weather tab visible karna h 
          searchForm.classList.remove("active");
          userInfoContainer.classList.remove("active");
          //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
          //for coordinates, if we haved saved them there.
          getfromSessionStorage();
      }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});


function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
      //agar local coordinates nahi mile
      grantAccessContainer.classList.add("active");
  }
  else {
      const coordinates = JSON.parse(localCoordinates);
      fetchUserWeatherInfo(coordinates);
  }

}

async function fetchUserWeatherInfo(coordinates) {
  const {lat, lon} = coordinates;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
      const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
      const  data = await response.json();

      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
  }
  catch(err) {
      loadingScreen.classList.remove("active");
      document.body.textContent = 'No Data Found'

  }

}

function renderWeatherInfo(weatherInfo) {
  //fistly, we have to fethc the elements 

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  console.log(weatherInfo);

  // Fetch values from weatherInfo object and put them into UI elements
cityName.innerText = weatherInfo?.name ? weatherInfo.name : 'No city Found';
countryIcon.src = weatherInfo?.sys?.country 
    ? `https://flagcdn.com/144x108/${weatherInfo.sys.country.toLowerCase()}.png` 
    : 'default-country-icon.png'; // Use a default image if country is undefined
desc.innerText = weatherInfo?.weather?.[0]?.description 
    ? weatherInfo.weather[0].description 
    : 'Description not available';
weatherIcon.src = weatherInfo?.weather?.[0]?.icon 
    ? `http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png` 
    : 'default-weather-icon.png'; // Use a default image if icon is undefined
temp.innerText = weatherInfo?.main?.temp 
    ? `${weatherInfo.main.temp} °C` 
    : 'Temperature not available';
windspeed.innerText = weatherInfo?.wind?.speed 
    ? `${weatherInfo.wind.speed} m/s` 
    : 'Wind speed not available';
humidity.innerText = weatherInfo?.main?.humidity 
    ? `${weatherInfo.main.humidity}%` 
    : 'Humidity not available';
cloudiness.innerText = weatherInfo?.clouds?.all 
    ? `${weatherInfo.clouds.all}%` 
    : 'Cloudiness not available';


}

function getLocation() {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
      //HW - show an alert for no gelolocation support available
      alert("kuch nahi mila");
  }
}

function showPosition(position) {

  const userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
      console.log(err);
    }
}