const yourWeather =document.querySelector("[data-userWeather]");
const yourSearch = document.querySelector("[data-searchWeather]");
const grantLocation =document.querySelector(".grant-location-container");
const userinfo =document.querySelector(".user-info-container");
const searchForm=document.querySelector("[data-searchForm]");
const loading= document.querySelector(".loading-container");
const mainTab=document.querySelector(".weather-container");

const API_KEY = "79477e6a0965d4ccec5a7efec9a0971b";
let currentTab = yourWeather;
currentTab.classList.add("current-tab");

getfromSessionStorage();
 
function switchTab(newTab){
    if(newTab!=currentTab){
            currentTab.classList.remove("current-tab");
            currentTab=newTab;
            currentTab.classList.add("current-tab");
            if(!searchForm.classList.contains("active")){
                userinfo.classList.remove("active");
                grantLocation.classList.remove("active");
                searchForm.classList.add("active");
            }
            else{
                searchForm.classList.remove("active");
                userinfo.classList.remove("active");
                getfromSessionStorage();
            }
            
            
    }
}

yourWeather.addEventListener('click',()=>{
    switchTab(yourWeather);
});
yourSearch.addEventListener('click',()=>{
    switchTab(yourSearch);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantLocation.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantLocation.classList.remove("active");
    //make loader visible
    loading.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loading.classList.remove("active");
        userinfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loading.classList.remove("active");
        //HW
        console.log("API CALL MEI ERROR HAI");

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

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("geolocation support not available");
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
    userinfo.classList.remove("active");
    grantLocation.classList.remove("active");
    loading.classList.add("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loading.classList.remove("active");
        userinfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log("search mei error hai");
    }
}