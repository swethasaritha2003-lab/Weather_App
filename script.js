const apiKey = "9b3e6a6be372fa2ed53f247bc8cebe62"; 

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const temp = document.querySelector(".temp");
const city = document.querySelector(".city");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind-speed");
const weatherImg = document.querySelector(".w1");
const Weather = document.querySelector(".Weather");
const forecast = document.querySelector(".forecast");
const date = document.querySelector(".date");
const Maxtemp = document.querySelector(".max-temp");
const Mintemp = document.querySelector(".min-temp");
const groundlevel = document.querySelector(".groundlevel");
const longitude = document.querySelector(".longitude");
const latitude = document.querySelector(".latitude");
const suggestions = document.getElementById("suggestions");

const toggleBtn = document.querySelector("#toggleUnit");

let unit = "metric";   // default °C
let currentCity = "";  // store last searched city

// 🌦 MAIN FUNCTION
async function checkWeather(cityName) {

    // if (cityName === currentCity && unitChanged === false) return;
    if (!cityName) {
        alert("Enter city name");
        return;
    }

    try {
        currentCity = cityName;

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.cod === "404") {
            alert("City not found");
            return;
        }

        // UNIT SYMBOL
        const symbol = unit === "metric" ? "°C" : "°F";

        // UPDATE UI
        temp.innerHTML = data.main.temp + symbol;
        city.innerHTML = data.name;
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + (unit === "metric" ? " km/h" : " mph");
        Maxtemp.innerHTML = data.main.temp_max + symbol;
        Mintemp.innerHTML = data.main.temp_min + symbol;
        latitude.innerHTML = data.coord.lat;
        longitude.innerHTML = data.coord.lon;
        

        toggleBtn.checked = unit === "imperial";

        // ⚠️ pressure, not temperature
        groundlevel.innerHTML = data.main.grnd_level + " hPa";

        Weather.innerHTML = data.weather[0].description;

        const now = new Date();
        date.innerHTML = now.toLocaleString();

        // WEATHER IMAGE
        const weatherMain = data.weather[0].main;

        if (weatherMain === "Clouds") weatherImg.src = "clouds.png";
        else if (weatherMain === "Clear") weatherImg.src = "clear.png";
        else if (weatherMain === "Rain") weatherImg.src = "rains.png";
        else if (weatherMain === "Drizzle") weatherImg.src = "drizzle.png";
        else if (weatherMain === "Mist") weatherImg.src = "mist.png";

        // 📅 FORECAST
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`;

        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        forecast.innerHTML = "";

        let seenDates = [];

        forecastData.list.forEach(item => {
            const d = item.dt_txt.split(" ")[0];

            if (!seenDates.includes(d) && item.dt_txt.includes("12:00:00")) {
                seenDates.push(d);

                forecast.innerHTML += `
                    <div class="card">
                        <h3>${item.main.temp}${symbol}</h3>
                        <p>${d}</p>
                    </div>
                `;
            }
        });

        // 💾 SEARCH HISTORY
        let history = JSON.parse(localStorage.getItem("history")) || [];

        if (!history.includes(cityName)) {
            history.push(cityName);
            localStorage.setItem("history", JSON.stringify(history));
        }

        suggestions.innerHTML = "";

    } catch (err) {
        alert("Something went wrong");
    }
}

// 🔍 SEARCH BUTTON
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

// ⌨️ ENTER KEY
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value.trim());
    }
});

// 💡 SUGGESTIONS
searchBox.addEventListener("input", () => {

    const value = searchBox.value.toLowerCase();
    suggestions.innerHTML = "";

    if (!value) return;

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const filtered = history.filter(city =>
        city.toLowerCase().includes(value)
    );

    filtered.forEach(cityName => {
        const li = document.createElement("li");
        li.textContent = cityName;

        li.onclick = () => {
            searchBox.value = cityName;
            suggestions.innerHTML = " ";
            checkWeather(cityName);
        };

        suggestions.appendChild(li);
    });
});

// 🌡 TOGGLE UNIT (FIXED)
toggleBtn.addEventListener("change", () => {

    unit = toggleBtn.checked ? "imperial" : "metric";

    if (currentCity) {
        checkWeather(currentCity);
    }
});

// ❌ HIDE SUGGESTIONS
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) {
        suggestions.innerHTML = "";
    }
});






// const apiKey = "9b3e6a6be372fa2ed53f247bc8cebe62"; 

// const searchBox = document.querySelector(".search input");
// const searchBtn = document.querySelector(".search button");

// const temp = document.querySelector(".temp");

// const city = document.querySelector(".city");
// const humidity = document.querySelector(".humidity");
// const wind = document.querySelector(".wind-speed");
// const weatherImg = document.querySelector(".w1");
// const Weather = document.querySelector(".Weather");
// const forecast = document.querySelector(".forecast");
// const date = document.querySelector(".date");
// const Maxtemp = document.querySelector(".max-temp");
// const Mintemp = document.querySelector(".min-temp");
// const groundlevel = document.querySelector(".groundlevel");
// const suggestions = document.getElementById("suggestions");
// let unit = "metric";
// const toggleBtn = document.querySelector("#toggleUnit");

// //  MAIN FUNCTION
// async function checkWeather(cityName) {

//     if (!cityName) {
//         alert("Enter city name");
//         return;
//     }

//     try {
//         // CURRENT WEATHER
//         const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

//         const response = await fetch(url);
//         const data = await response.json();
//         console.log(data);

//         if (data.cod === "404") {
//             alert("City not found");
//             return;
//         }

//         // UPDATE UI
//         temp.innerHTML = data.main.temp + "°C";
//         city.innerHTML = data.name;
//         humidity.innerHTML = data.main.humidity + "%";
//         wind.innerHTML = data.wind.speed + " km/h";
//         Maxtemp.innerHTML = data.main.temp_max + "°C";
//         Mintemp.innerHTML = data.main.temp_min + "°C";
//         groundlevel.innerHTML = data.main.grnd_level+ "°C";
//         Weather.innerHTML = data.weather[0].description;
//         const now = new Date();
//         console.log(now);
//         date.innerHTML = now.toLocaleString();

//         const weatherMain = data.weather[0].main;

//         if (weatherMain == "Clouds") weatherImg.src = "clouds.png";
//         else if (weatherMain == "Clear") weatherImg.src = "clear.png";
//         else if (weatherMain == "Rain") weatherImg.src = "rain.png";
//         else if (weatherMain == "Drizzle") weatherImg.src = "drizzle.png";
//         else if (weatherMain == "Mist") weatherImg.src = "mist.png";

//         //  FORECAST 
//         const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

//         const forecastRes = await fetch(forecastUrl);
//         const forecastData = await forecastRes.json();

//         forecast.innerHTML = "";

//         let seenDates = [];

//         forecastData.list.forEach(item => {
//             const date = item.dt_txt.split(" ")[0];

//             if (!seenDates.includes(date) && item.dt_txt.includes("12:00:00")) {
//                 seenDates.push(date);

//                 forecast.innerHTML += `
//                     <div class="card">
//                     <h3>${item.main.temp}°C</h3>
//                         <p>${date}</p>
                        
//                     </div>
//                 `;
//             }
//         });

//         // SAVE SEARCH HISTORY 
//         let history = JSON.parse(localStorage.getItem("history")) || [];

//         if (!history.includes(cityName)) {
//             history.push(cityName);
//             localStorage.setItem("history", JSON.stringify(history));
//         }

//         suggestions.innerHTML = "";

//     } catch (err) {
//         alert("Something went wrong");
//     }
// }

// // SEARCH BUTTON
// searchBtn.addEventListener("click", () => {
//     checkWeather(searchBox.value.trim());
// });

// //  ENTER KEY 
// searchBox.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//         checkWeather(searchBox.value.trim());
//     }
// });

// //SUGGESTIONS 
// searchBox.addEventListener("input", () => {

//     const value = searchBox.value.toLowerCase();
//     suggestions.innerHTML = "";

//     if (!value) return;

//     const history = JSON.parse(localStorage.getItem("history")) || [];

//     const filtered = history.filter(city =>
//         city.toLowerCase().includes(value)
//     );

//     filtered.forEach(cityName => {
//         const li = document.createElement("li");
//         li.textContent = cityName;

//         li.onclick = () => {
//             searchBox.value = cityName;
//             suggestions.innerHTML = "";
//             checkWeather(cityName);
//         };

//         suggestions.appendChild(li);
//     });
// });

// toggleBtn.addEventListener("change", ()=>{
//     if(toggleBtn.checked){
//         unit="imperial";
//     }else{
//         unit="metric";
//     }checkWeather();
// });
// //  HIDE SUGGESTIONS 
// document.addEventListener("click", (e) => {
//     if (!e.target.closest(".search")) {
//         suggestions.innerHTML = "";
//     }
// });















// const searchBox = document.querySelector(".search input");
// const searchBtn = document.querySelector(".search button");

// const temp = document.querySelector(".temp");
// const city = document.querySelector(".city");
// const humidity = document.querySelector(".humidity");
// const wind = document.querySelector(".wind-speed");
// const weatherImg = document.querySelector(".w1");
// const Weather = document.querySelector(".Weather");
// const forecast = document.querySelector(".forecast");


// async function checkWeather(cityName) {

//     if (!cityName) {
//         alert("Enter city name");
//         return;
//     }

    
//     // CURRENT WEATHER
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.cod === "404") {
//         alert("City not found");
//         return;
//     }

//     temp.innerHTML = data.main.temp + "°C";
//     city.innerHTML = data.name;
//     humidity.innerHTML = data.main.humidity + "%";
//     wind.innerHTML = data.wind.speed + " km/h";
//     Weather.innerHTML = data.weather[0].description;

//     const weatherMain = data.weather[0].main;

//     if (weatherMain == "Clouds") weatherImg.src = "clouds.png";
//     else if (weatherMain == "Clear") weatherImg.src = "clear.png";
//     else if (weatherMain == "Rain") weatherImg.src = "rain.png";
//     else if (weatherMain == "Drizzle") weatherImg.src = "drizzle.png";
//     else if (weatherMain == "Mist") weatherImg.src = "mist.png";

//     // 🔥 FORECAST (FIXED)
//     const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

//     const forecastRes = await fetch(forecastUrl);
//     const forecastData = await forecastRes.json();

//     forecast.innerHTML = "";

//     let seenDates = [];

//     forecastData.list.forEach(item => {
//         const date = item.dt_txt.split(" ")[0];

//         if (!seenDates.includes(date) && item.dt_txt.includes("12:00:00")) {
//             seenDates.push(date);

//             forecast.innerHTML += `
//                 <div class="card">
//                     <p>${date}</p>
//                     <h3>${item.main.temp}°C</h3>
//                 </div>
//             `;
//         }
//     });
// }
// // async function checkWeather(cityName) {
// //     const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

// //     const response = await fetch(url);
// //     const data = await response.json();

// //     console.log(data); // debug

// //     // temp.innerHTML = Math.round(data.main.temp) + "°C";
// //     temp.innerHTML = data.main.temp + "°C";
// //     city.innerHTML = data.name;
// //     humidity.innerHTML = data.main.humidity + "%";
// //     wind.innerHTML = data.wind.speed + " km/h";
// //     Weather.innerHTML = data.weather[0].description;


// // const weatherMain = data.weather[0].main;

// //     if (weatherMain == "Clouds") {
// //         weatherImg.src = "clouds.png";
// //     } else if (weatherMain == "Clear") {
// //         weatherImg.src = "clear.png";
// //     } else if (weatherMain == "Rain") {
// //         weatherImg.src = "rain.png";
// //     } else if (weatherMain == "Drizzle") {
// //         weatherImg.src = "drizzle.png";
// //     } else if (weatherMain == "Mist") {
// //         weatherImg.src = "mist.png";
// //     }
// // }
// // const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

// //       fetch(forecastUrl)
// //         .then((response) => response.json())
// //         .then((data) => {
// //           console.log(data.list);

// //           if (!data.list) {
// //             console.log("Forecast error or city not found");
// //             return;
// //           }

// //           forecast.innerHTML = "";

// //           let seenDates = [];

// //           for (let i = 0; i < data.list.length; i++) {
// //             const item = data.list[i];

// //             const date = item.dt_txt.split(" ")[0];

// //             if (!seenDates.includes(date) && item.dt_txt.includes("12:00:00")) {
// //               seenDates.push(date);

// //               forecast.innerHTML += `
// //                 <div class="card">
// //                   <p>${date}</p>
// //                   <h3>${item.main.temp}°C</h3>
// //                 </div>
// //               `;
// //             }
// //           }
// //         });
// //Button click
// searchBtn.addEventListener("click", () => {
//     checkWeather(searchBox.value);
// });

// //Enter press
// searchBox.addEventListener("keypress", (action) => {
//     if (action.key === "Enter") {
//         checkWeather(searchBox.value);
//     }
// });  



