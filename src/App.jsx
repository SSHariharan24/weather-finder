import { useEffect, useState } from 'react';
import './App.css';
import PropTypes from "prop-types";
//import images 
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humitidy.png";
import rainIcon from "./assets/rain.png";
import sunIcon from "./assets/sun.png";
import searchIcon from "./assets/searchicon.png";
import snowIcon from "./assets/snow.jpg";
import windIcon from "./assets/wind.png";

//
const WeatherDetails=({icon,temp,city,country,lati,logi,humidity,wind})=>{
   return (<>
  <div className="images">
    <img src={icon} alt=""></img>
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>

  <div className="cord">
  <div>
  <span className="lat">latitude</span>
  <span>{lati}</span>
  </div>

  <div>
  <span className="log">longitude</span>
  <span>{logi}</span>
  </div>
  </div>

  <div className="data-container">
    <div className="elements">
      <img src={humidityIcon} alt='humitidy' className='icon'></img>
      <div className='data'>
        <div className="humidity-percent">{humidity}</div>
        <div className="text">Humidity</div>
      </div>
    </div>
    <div className="elements">
      <img src={windIcon} alt='icon' className='icon'></img>
      <div className='data'>
        <div className="wind-percent">{wind}km/h</div>
        <div className="text">Wind Speed</div>
      </div>
    </div>
  </div>
  </>
  );
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  lati: PropTypes.number.isRequired,
  logi: PropTypes.number.isRequired,
};

//https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=514385a59346d9dc2a3a2f250463ee88&units=Metric

function App() {
  let api_key = "514385a59346d9dc2a3a2f250463ee88";

  const [text,setText] = useState("chennai");
  const [icon,setIcon] = useState(sunIcon);
  const [temp,setTemp] = useState(0);
  const [city,setCity] = useState("");
  const [country,setCountry] = useState("");
  const [lat,setLat] = useState(0);
  const [log,setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind,setWind] = useState(0);
  const [citynotfound,setCityNotFound] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const Searches = async ()=>{
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
    try{
      let res = await fetch(url);
      let data = await res.json();
     // console.log(data)
     if(data.cod === "404"){
      console.log("City not found");
      setCityNotFound(true);
      setLoading(false);
      return;
     }

     setHumidity(data.main.humidity);
     setWind(data.wind.speed);
     setTemp(Math.floor(data.main.temp));
     setCity(data.name);
     setCountry(data.sys.country);
     setLat(data.coord.lat);
     setLog(data.coord.lon);
     const weatherIconCode = data.weather[0].icon;
     setIcon(weatherIconMap[weatherIconCode] || sunIcon)

}catch(error){
      console.error("An error occured:",error.message);
      setError("An error occured while fetching weather data.");
    }finally{
      setLoading(false);
    }
  };

  const handlekey = (e) => {
    setText(e.target.value);
  };
  const handlekeydown = (e) => {
    if(e.key === "Enter"){
      Searches();
    }
  };

  useEffect(function(){
  Searches();
  },[]);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="city-input" placeholder="Search-City" onChange={handlekey} value={text} onKeyDown={handlekeydown}></input>
          <div className="search-icon">
            <img src={searchIcon} alt="searchimage" onClick={()=>Searches()}></img>
            </div>
        </div>
       <WeatherDetails 
         icon={icon}
         temp={temp}
         city={city}
         country={country} 
         lati={lat} logi={log}
         humidity={humidity}
         wind={wind}
         />

        {/* {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="Loading-error">{error}</div> }
        { citynotfound && <div className="city-not-found">City not found</div> }

        {!loading && !citynotfound && <WeatherDetails 
         icon={icon}
         temp={temp}
         city={city}
         country={country} 
         lati={lat} logi={log}
         humidity={humidity}
         wind={wind}
         />} */}

         </div>
    </>
  )
}

export default App
