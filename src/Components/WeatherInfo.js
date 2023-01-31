import React, {useState} from 'react'
import axios from 'axios'
import WeatherDisplay from './WeatherDisplay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import 'moment-timezone'

const initialWeather = [{
  cityName: '',
  stateName: '',
  country: '',
  weather: '',
  description: '',
  weatherIcon: '',
  temperature: '',
  temperature_max: '',
  temperature_min: '',
  lon: '',
  lat: '',
  time: '',
}]

const WeatherInfo = () => {

  const [cityInput, setCityInput] = useState('')
  const [error, setError] = useState('')
  const [weather, setWeather] = useState(initialWeather)
  const [geoLocationStatus, setGeoLocationStatus] = useState()
  
  const handleChange = (e) => {
    setCityInput(e.target.value);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    getWeather()
  }
  
  const weatherAPIurl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=${process.env.REACT_APP_WEATHER_TOKEN}`

  const getWeather = () => {
    axios.get(weatherAPIurl) 
    .then((responseA) =>
        Promise.all([
          responseA,
          axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${responseA.data.coord.lat}&lon=${responseA.data.coord.lon}&apiKey=${process.env.REACT_APP_GEOCODING_TOKEN}`),
          axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=J4CW56V87PEA&format=json&by=position&lat=${responseA.data.coord.lat}&lng=${responseA.data.coord.lon}`),
        ])   
    )
    .then(
      ([responseA,responseB, responseC]) => {
        setWeather({...weather, 
          cityName: responseA.data.name,
          country: responseA.data.sys.country,
          weather: responseA.data.weather[0].main,
          description: responseA.data.weather[0].description,
          temperature: responseA.data.main.temp,
          temperature_max: responseA.data.main.temp_max,
          temperature_min: responseA.data.main.temp_min,
          weatherIcon: responseA.data.weather[0].icon,
          lon: responseA.data.coord.lon,
          lat: responseA.data.coord.lat,
          stateName: responseB.data.features[0].properties.state,
          time: moment().tz(`${responseC.data.zoneName}`).format('MMMM Do YYYY, h:mm a')
        })
        setError('')
    })
    .catch((err) => {
        console.log(err.message);
        setError('Please enter a valid City name')
    });
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setGeoLocationStatus('Geolocation is not supported by your browser');
    } else {
      setGeoLocationStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setGeoLocationStatus(null);

        axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&apiKey=${process.env.REACT_APP_GEOCODING_TOKEN}`) 
        .then((firstRes) =>
            Promise.all([
              firstRes,
              axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${firstRes.data.features[0].properties.city}&units=imperial&appid=${process.env.REACT_APP_WEATHER_TOKEN}`),
              axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=J4CW56V87PEA&format=json&by=position&lat=${position.coords.latitude}&lng=${position.coords.longitude}`),
            ])   
        )
        .then(
        ([firstRes, secondRes, thirdRes]) => {
          setWeather({...weather, 
            cityName: secondRes.data.name,
            country: secondRes.data.sys.country,
            weather: secondRes.data.weather[0].main,
            description: secondRes.data.weather[0].description,
            temperature: secondRes.data.main.temp,
            temperature_max: secondRes.data.main.temp_max,
            temperature_min: secondRes.data.main.temp_min,
            weatherIcon: secondRes.data.weather[0].icon,
            lon: secondRes.data.coord.lon,
            lat: secondRes.data.coord.lat,
            stateName: firstRes.data.features[0].properties.state,
            time: moment().tz(`${thirdRes.data.zoneName}`).format('MMMM Do YYYY, h:mm a')
          })
          setError('')
        })
       .catch(error => {
          console.log(error.response.data.error)
       })
      }, () => {
        setGeoLocationStatus('Unable to retrieve your location');
      });
    }
  }

    return (
      <div>

      <div className="container">
          <form >
            <input type="text" name="City" value={cityInput} placeholder="Search for a city" onChange={handleChange} />
            <FontAwesomeIcon className="searchbtn" icon={faSearch} onClick={handleSubmit}/>
            <FontAwesomeIcon style={{color: 'blue'}} className="searchbtn" icon={faLocationArrow} onClick={getLocation}/>
          </form>
          <WeatherDisplay weather={weather} error={error} geoLocationStatus={geoLocationStatus}/>
      </div>

      </div>
    )
}

export default WeatherInfo