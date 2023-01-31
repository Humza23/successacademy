import React from 'react'


const WeatherDisplay = (props) => {

    const iconAPIurl = `http://openweathermap.org/img/w/${props.weather.weatherIcon}.png`

    return (
        <div>
            {
          props.error ? 
        <div className='display'>
            <h3 className="pleaseEnter" style={{paddingTop: '.5rem', color: 'white', fontWeight: 'bolder', opacity: '2', textTransform: 'uppercase'}}>
            {props.error}* 
            </h3>
        </div> 
        : !props.weather.weather ? 
        <div className='display'>
            <h2 className="pleaseEnter"> {props.geoLocationStatus ? props.geoLocationStatus : 'Please enter a city name or use current location'} </h2>
        </div>
          : props.weather.stateName ?
        <div className='display'>
            <h2 className="cityDisplay"> {props.weather.cityName}, {props.weather.stateName} </h2>
            <h2 className="currentWeather"> {props.weather.weather} </h2>
            <img src={iconAPIurl} alt="weather icon" />
            <h3 className="currentDescription"> {props.weather.description}</h3>
            <h4 className="currentTemp"> {Math.round(props.weather.temperature)}&deg; </h4>
            <p> High: {Math.round(props.weather.temperature_max)}&deg; </p>
            <p> Low: {Math.round(props.weather.temperature_min)}&deg; </p>
            <hr style={{
            border: '1px solid white',
            marginTop: '1.25rem'

        }}
    />
            <p id="time"> {props.weather.time} </p>
        </div>
        : 
        <div className='display'>
            <h2> {props.weather.cityName} </h2>
            <h2> {props.weather.weather} </h2>
            <img src={iconAPIurl} alt="weather icon" />
            <h3> {props.weather.description}</h3>
            <h4> {Math.round(props.weather.temperature)} </h4>
            <p> High: {Math.round(props.weather.temperature_max)} </p>
            <p> Low: {Math.round(props.weather.temperature_min)} </p>
            <p> {props.weather.time} </p>
        </div>
          }
        </div>
    )
}

export default WeatherDisplay