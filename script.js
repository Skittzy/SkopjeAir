const weatherApiKey = '' //ADD YOUR API KEY HERE
// // Logika za samo 1 grad
const cityInput = 'skopje'
const lat = '42'
const lon = '21.4333'
// const lat = '40.7143'
// const lon = '-74.006'

// Ova se podatocite koj vo vid na tekst gi displejnuvame prevzemeni od WeatherApi
const countryTxt = document.querySelector('.country-txt') //Ime na grad
const tempTxt = document.querySelector('.temp-txt') // Temperatura (smeni)
const conditionTxt = document.querySelector('.condition-txt') // Condition (smeni)
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

//  FORECAST Podatoci
const forecastItemsContainer = document.querySelector('.forecast-items-container')
const forecastItemTemp = document.querySelector('.forecast-item-temp')

// Logika za samo 1 grad
document.addEventListener("DOMContentLoaded", function() {
    updateWeatherInfo(cityInput)// hardkoded zosto samo za sk ni treba, inc moze za poveke gradovi
    updateAirInfo()
  });

// SEARCH LOGIC
// const cityInput = document.querySelector('.city-input')
// const searchBtn = document.querySelector('.search-btn')

// const notFoundSection = document.querySelector('.not-found')
// const searchCitySection = document.querySelector('.search-city')
// const weatherInfoSection = document.querySelector('.weather-info')

// searchBtn.addEventListener('click', () => {
//     if (cityInput.value.trim() != '') {
//         updateWeatherInfo(cityInput.value)
//         cityInput.value = ''
//         cityInput.blur()
//     }
// })

// cityInput.addEventListener('keydown', (event) => {
//     if (event.key == 'Enter' && cityInput.value.trim() != '') {
//         updateWeatherInfo(cityInput.value)
//         // Tuka logika za nova funk updatePolutionData
//         cityInput.value = ''
//         cityInput.blur()
//     }
// })

async function getFetchAirData(endPoint, lat, lon) {
    // const apiUrl = `https://skopje.pulse.eco/rest/current`
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution${endPoint}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`

    const response = await fetch(apiUrl)

    return response.json()
}

async function updateAirInfo() {
    const airData = await getFetchAirData('', lat, lon)

    //console.log(airData)

    const {
        list: [{ components, main }]
    } = airData 

    humidityValueTxt.textContent = components.pm10
    windValueTxt.textContent = components.pm2_5


    main.aqi = 1
    if (main.aqi == 1) {
        tempTxt.style.color = "#c3ff87"
        tempTxt.textContent = 'Good'
        conditionTxt.textContent = 'Good Air Quality'
        weatherSummaryImg.src = `assets/airQuality/cleanEarth.svg`
    }
    if (main.aqi == 2) {
        tempTxt.style.color = "#f7ff87"
        tempTxt.textContent = 'Fair'
        conditionTxt.textContent = 'Fair Air Quality'
        weatherSummaryImg.src = `assets/airQuality/cleanEarth.svg`
    }
    if (main.aqi == 3) {
        tempTxt.style.color = "#fff494"
        tempTxt.textContent = 'Moderate'
        conditionTxt.textContent = 'Moderate Air Quality'
        weatherSummaryImg.src = `assets/airQuality/moderateAir.svg`
    }
    if (main.aqi == 4) {
        tempTxt.style.color = "#fcbe97"
        tempTxt.textContent = 'Poor'
        conditionTxt.textContent = 'Poor Air Quality'
        weatherSummaryImg.src = `assets/airQuality/poorAir.svg`
    }
    if (main.aqi == 5) {
        tempTxt.style.color = "#ff9c9c"
        tempTxt.textContent = 'Very Poor'
        conditionTxt.textContent = 'Bad Air Quality'
        weatherSummaryImg.src = `assets/airQuality/badAir.svg`
    }

    await updateForcastAirInfo(lat, lon)
}

// Forcast Air polution logic
async function updateForcastAirInfo(lat, lon) {
    const forecastsAirData = await getFetchAirData('/forecast', lat, lon)

    //console.log(forecastsAirData)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    var myDate = new Date(forecastsAirData.list[0].dt*1000)
    //console.log(myDate.toISOString().split('T')[1].split('Z')[0]) //--> Dava Saat
    //console.log(myDate.toISOString().split('T')[0]) //--> dava data
    
    // vo klasata forecasts
    forecastItemTemp.innerHTML = ''

    forecastsAirData.list.forEach(forcAirData => {
        // gi zemame vrednostite samo za 12:00 od slednite (forecast denovi) i plus da ne go pokazuvame vremeto 12:00 zs ne ni treba
        var myDate = new Date(forcAirData.dt*1000)

        if (myDate.toISOString().split('T')[1].split('Z')[0].includes(timeTaken) && !myDate.toISOString().split('T')[0].includes(todayDate)) {
            //console.log('vlegov vo loopot')
            updateAirDataForecastItems(forcAirData)
        }
    })
}

function updateAirDataForecastItems(airData) {
    const {
        components: { pm10, pm2_5 }
        
    } = airData

    //console.log(pm10)

    //drug nacin kako da insertnes API data vo vrednostite na sajtot
    const pm10cesticki = `
        <div class="forecast-item">
            <h5 class="forecast-item-temp">${pm10} °C</h5>
        </div>
    `
    forecastItemTemp.insertAdjacentHTML('beforeend', pm2_5)
}


// Weather logic
async function getFetchWeatherData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${weatherApiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchWeatherData('weather', city)

    // if(weatherData.cod != 200) {
    //     showDisplaySection(notFoundSection)
    //     return
    // }

    //console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country
    // tempTxt.textContent = Math.round(temp) + ' °C'
    // conditionTxt.textContent = main
    // humidityValueTxt.textContent = humidity + "%"
    // windValueTxt.textContent = speed + ' m/s'

    currentDateTxt.textContent = getCurrentDate()
    //weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    

    await updateWeatherForecastInfo(city)
    // Logika za menjanje na sekcii, odnosno od search city --> Error ako nepostoi gradot --> weather info ako postoi
    // showDisplaySection(weatherInfoSection)
}

// Forcast Logic
async function updateWeatherForecastInfo(city) {
    const forecastsData = await getFetchWeatherData('forecast', city);


    console.log(forecastsData)
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    
    // vo klasata forecasts
    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        // gi zemame vrednostite samo za 12:00 od slednite (forecast denovi) i plus da ne go pokazuvame vremeto 12:00 zs ne ni treba
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateWeatherForecastItems(forecastWeather)
        }
    })
}

function updateWeatherForecastItems(weatherData) {
    // gi vadime varijablite koj so ni trebaat za forecastov (id za ikona, temperatura, data)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp, humidity },
        wind: { speed }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = { 
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-GB', dateOption)

    // Calculate Air Quality index using formulas:
    const pm10molecules = 55 + 0.4*temp - 0.35*humidity + 1.5*speed
    const pm2_5molecules = 28 + 0.3*temp - 0.25*humidity + 1.2*speed

    //console.log(pm10molecules)
    //console.log(pm2_5molecules)

    let airQualityIndex = 0
    if(pm10molecules <= 25 && pm2_5molecules <= 15) {
        forecastItemTemp.style.color = "#c3ff87"
        airQualityIndex = 'Good'
    }
    else if((pm10molecules > 25 && pm10molecules <= 50) && (pm2_5molecules <= 30)) {
        forecastItemTemp.style.color = "#f7ff87"
        airQualityIndex = 'Fair'
    }
    else if((pm10molecules <= 90 && pm10molecules > 50) && (pm2_5molecules <= 55)) {
        forecastItemTemp.style.color = "#fff494"
        airQualityIndex = 'Moderate'
    }
    else if((pm10molecules > 90 && pm10molecules <= 180) && (pm2_5molecules <= 110)) {
        forecastItemTemp.style.color = "#fcbe97"
        airQualityIndex = 'Poor'
    } else {
        forecastItemTemp.style.color = "#ff9c9c"
        airQualityIndex = 'Bad'
    }
    

    //drug nacin kako da insertnes API data vo vrednostite na sajtot
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${airQualityIndex}</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

 // Logika za menjanje na sekcii, odnosno od search city --> Error ako nepostoi gradot --> weather info ako postoi
// function showDisplaySection(section) {
//     [weatherInfoSection, searchCitySection, notFoundSection]
//         .forEach(section => section.style.display = 'none')

//     section.style.display = 'flex'
// }