let activities = [];

// Load activities from localStorage on page load
function loadActivities() {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
        renderActivities();
    }
}

// Function to fetch weather forecast
async function fetchWeatherForecast(date, location) {
    const apiKey = '615ac3218d20036d72c80ae0da2d225e';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        const forecastForDate = data.list.find((entry) => entry.dt_txt.startsWith(date));
        if (forecastForDate) {
            return {
                condition: forecastForDate.weather[0].description,
                avgTemp: forecastForDate.main.temp,
                icon: forecastForDate.weather[0].icon
            };
        } else {
            return { condition: 'No forecast available', avgTemp: 'N/A', icon: '' };
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return { condition: 'Error fetching data', avgTemp: 'N/A', icon: '' };
    }
}

// Function to add or update activity
document.getElementById('activityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('activityTitle').value;
    const description = document.getElementById('activityDescription').value;
    const date = document.getElementById('activityDate').value;
    const location = document.getElementById('activityLocation').value;

    // Fetch weather for the activity
    const weather = await fetchWeatherForecast(date, location);
    const activity = { title, description, date, location, weather };

    // Check if updating or adding new
    const existingIndex = activities.findIndex(activity => activity.title === title);
    if (existingIndex > -1) {
        activities[existingIndex] = activity; // Update
    } else {
        activities.push(activity); // Add new
    }

    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivities();
    document.getElementById('activityForm').reset();
});

// Function to render activities
function renderActivities() {
    const container = document.getElementById('activitiesContainer');
    container.innerHTML = '';
    activities.forEach((activity) => {
        const activityCard = document.createElement('div');
        activityCard.classList.add('activity-card');

        activityCard.innerHTML = `
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <p>Date: ${activity.date}</p>
            <p>Location: ${activity.location}</p>
            <p>Weather: ${activity.weather.condition} with an average temperature of ${activity.weather.avgTemp}°C</p>
            <img src="http://openweathermap.org/img/wn/${activity.weather.icon}@2x.png" alt="Weather icon">
            <button class="update-btn" onclick="editActivity('${activity.title}')">Update</button>
            <button class="delete-btn" onclick="deleteActivity('${activity.title}')">Delete</button>
        `;
        container.appendChild(activityCard);
    });
}

// Function to delete an activity
function deleteActivity(title) {
    activities = activities.filter(activity => activity.title !== title);
    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivities();
}

// Function to edit an activity
function editActivity(title) {
    const activityToEdit = activities.find(activity => activity.title === title);
    document.getElementById('activityTitle').value = activityToEdit.title;
    document.getElementById('activityDescription').value = activityToEdit.description;
    document.getElementById('activityDate').value = activityToEdit.date;
    document.getElementById('activityLocation').value = activityToEdit.location;
}

// Load activities on page load
document.addEventListener('DOMContentLoaded', loadActivities);
