const form = document.getElementById("location-form");
const locationInput = document.getElementById("location-input");
const activityContainer = document.getElementById("activity-container");
const locationName = document.getElementById("location-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const rainChance = document.getElementById("rain-chance");
const forecastTemp = document.getElementById("forecast-temp");
const checklistContainer = document.getElementById("checklist-container");
const currentIcon = document.getElementById("current-icon");
const nextDayIcon = document.getElementById("next-day-icon");
const nextDayTemp = document.getElementById("next-day-temp");
const nextDayCondition = document.getElementById("next-day-condition");
const nextDayRain = document.getElementById("next-day-rain");
const weeklyForecastContainer = document.getElementById("weekly-forecast-container");
const nextDayButton = document.getElementById("next-day-button");
const backButton = document.getElementById("back-button");

let currentDayIndex = 0;
let weeklyForecastData = [];

// Form Submission Event
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = locationInput.value;

  // Fetch weather data from API for 7 days
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${location}&days=7`
  );
  const data = await response.json();

  locationName.textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
  temperature.textContent = data.current.temp_c;
  forecastTemp.textContent = data.forecast.forecastday[0].day.avgtemp_c;
  condition.textContent = data.current.condition.text;
  windSpeed.textContent = data.current.wind_kph;
  humidity.textContent = data.current.humidity;
  rainChance.textContent = data.forecast.forecastday[0].day.daily_chance_of_rain;
  currentIcon.src = `https:${data.current.condition.icon}`;

   const localTime = data.location.localtime;
   document.getElementById("local-time").textContent = localTime;

  nextDayTemp.textContent = data.forecast.forecastday[1].day.avgtemp_c;
  nextDayCondition.textContent = data.forecast.forecastday[1].day.condition.text;
  nextDayRain.textContent = data.forecast.forecastday[1].day.daily_chance_of_rain;
  nextDayIcon.src = `https:${data.forecast.forecastday[1].day.condition.icon}`;

  weeklyForecastData = data.forecast.forecastday;
  displayWeeklyForecast();

  // Display activity recommendations based on weather condition
  const activities = getActivitiesByWeather(data.current.condition.text);
  displayActivities(activities);
});

// Display weekly forecast cards
function displayWeeklyForecast() {
  weeklyForecastContainer.innerHTML = "";
  weeklyForecastData.slice(0, 3).forEach((day, index) => {
    const forecastCard = document.createElement("div");
    forecastCard.className = "forecast-card";
    forecastCard.innerHTML = `
      <h3>${new Date(day.date).toLocaleDateString("en-GB", { weekday: 'long' })}</h3>
      <img src="https:${day.day.condition.icon}">
      <p>Temp: ${day.day.avgtemp_c}°C</p>
      <p>${day.day.condition.text}</p>
      <p>Rain: ${day.day.daily_chance_of_rain}%</p>
    `;
    forecastCard.style.display = index === currentDayIndex ? "block" : "none";
    weeklyForecastContainer.appendChild(forecastCard);
  });
}

nextDayButton.addEventListener("click", () => {
  currentDayIndex = (currentDayIndex + 1) % 3;
  Array.from(weeklyForecastContainer.children).forEach((card, index) => {
    card.style.display = index === currentDayIndex ? "block" : "none";
  });
});

backButton.addEventListener("click", () => {
  currentDayIndex = (currentDayIndex - 1 + 3) % 3;
  Array.from(weeklyForecastContainer.children).forEach((card, index) => {
    card.style.display = index === currentDayIndex ? "block" : "none";
  });
});

function getActivitiesByWeather(condition) {
  if (condition.includes("Sunny") || condition.includes("Clear"))  {
    return ["Hiking", "Biking", "Picnic"];
  } else if (condition.includes("Rain") || condition.includes("Partly Cloudy") || condition.includes("Partly cloudy")|| condition.includes("Mist") || condition.includes("Light rain shower") || condition.includes("Light rain"))   {
    return ["Museum Visit", "Indoor Climbing", "Reading"];
  } else if (condition.includes("Snow")) {
    return ["Skiing", "Snowboarding", "Snowshoeing"];
  } else if (condition.includes("Snow")) {
    return ["Walking", "Photography", "Bird Watching"];
  } else {
    return ["Stay at Home."];
  }
}

function displayActivities(activities) {
  activityContainer.innerHTML = "";
  checklistContainer.innerHTML = "";
  activities.forEach(activity => {
    const activityCard = document.createElement("div");
    activityCard.className = "activity-card";
    const activityImage = document.createElement("img");
    activityImage.src = getActivityImage(activity);
    activityImage.alt = activity;
    activityCard.appendChild(activityImage);
    activityCard.appendChild(document.createTextNode(activity));
    activityContainer.appendChild(activityCard);

    const checklistItems = getChecklistByActivity(activity);
    checklistItems.forEach(item => {
      const checklistItem = document.createElement("div");
      checklistItem.className = "checklist-item";
      checklistItem.innerHTML = `<input type="checkbox" /> ${item}`;
      checklistContainer.appendChild(checklistItem);
    });
  });
}

function getActivityImage(activity) {
  switch (activity) {
    case "Hiking": return "images/hiking.jpeg";
    case "Biking": return "images/biking.jpeg";
    case "Picnic": return "images/picnic.jpeg";
    case "Museum Visit": return "images/museum.jpeg";
    case "Indoor Climbing": return "images/climbing.jpeg";
    case "Reading": return "images/reading.jpeg";
    case "Skiing": return "images/skiing.jpeg";
    case "Snowboarding": return "images/snowboarding.jpeg";
    case "Snowshoeing": return "images/snowshoeing.jpeg";
    case "Walking": return "images/walking.jpeg";
    case "Photography": return "images/photography.jpeg";
    case "Bird Watching": return "images/bird_watching.jpeg";
    default: return "images/default.png";
  }
}

function getChecklistByActivity(activity) {
  switch (activity) {
    case "Hiking": return ["Water", "Snacks", "Map", "First Aid Kit"];
    case "Biking": return ["Helmet", "Bike Repair Kit"];
    case "Picnic": return ["Blanket", "Food", "Mat"];
    case "Museum Visit": return ["Tickets", "Camera", "Notebook"];
    case "Indoor Climbing": return ["Climbing Shoes", "Chalk Bag", "Harness"];
    case "Reading": return ["Book", "Comfortable Chair"];
    case "Skiing": return ["Skis", "Poles", "Goggles"];
    case "Snowboarding": return ["Snowboard", "Boots", "Gloves"];
    case "Snowshoeing": return ["Snowshoes", "Warm Clothes", "Water"];
    case "Walking": return ["Comfortable Shoes", "Water"];
    case "Photography": return ["Camera", "Lens", "Tripod"];
    case "Bird Watching": return ["Binoculars", "Field Guide"];
    default: return ["Bed", "Television", "Snacks", "Comforter"];
  }
}
