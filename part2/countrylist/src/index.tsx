import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import axios from 'axios'

const CountryView = ({country, open, changeFilter, weather}: {weather: Weather | null, country: Country, open: boolean, changeFilter: (filter: string) => void}) => {
    if (open) {
        return ( 
            <div>
                <h1>{country.name}</h1>
                <p>Capital {country.capital}</p>
                <p>Population {country.population}</p>
                <h3>Languages</h3>
                <ul>
                    {country.languages.map(l => <li key={l.name}>{l.name}</li>)}
                </ul>
                <img alt={'country flag'} src={country.flag} width={300} />
                {weather && <div>
                    <h3>Weather in {country.capital}</h3>
                    <p>temperature: {weather.current.temp_c} Celsius</p>
                    <p>{weather.current.condition.text}</p>
                    <img alt={'Weather icon'} src={weather.current.condition.icon} width={200}/>
                    <p>wind: {weather.current.wind_kph} direction {weather.current.wind_dir}</p>
                </div>}
            </div>)
    } else {
        return <p>{country.name} <button onClick={() => changeFilter(country.name)}> show </button></p> 
    }
}

const App = () => {
    const [countries, updateCountries] = useState<Array<Country>>([])
    const [filter, changeFilter] = useState('')
    const [weather, changeWeather] = useState(null as Weather | null)

    const fetchCountries = async () => {
        const res = await axios.get('https://restcountries.eu/rest/v2/all')
        updateCountries(res.data as Country[])
    }

    const getWeather = async (capital: string) => {
        const res = await axios.get(`https://api.apixu.com/v1/current.json?key=c065838c51044470bb1153929192007&q=${capital}`)
        changeWeather(res.data as Weather)
    }

    const updateFilter = (newFilter: string) => {
        changeFilter(newFilter)
        if (filterCountries(newFilter).length === 1) {
            getWeather(filterCountries(newFilter)[0].capital)
        } else {
            changeWeather(null)
        }
    }

    useEffect(() => {
        fetchCountries()
    }, [])

    const filterCountries = (filter: string) => countries.filter(({name}) => name.toLowerCase().includes(filter.toLowerCase()))
    const filteredCountries = filterCountries(filter)

    return (
        <div>
            <p> find countries <input value={filter} onChange={(event) => updateFilter(event.target.value)} /></p>
            {filteredCountries.length < 10 ? filteredCountries
                .map(country => 
                    <CountryView 
                        key={country.name}
                        changeFilter={updateFilter}
                        open={filteredCountries.length === 1} 
                        country={country}
                        weather={weather}
                    />)
                : filter && <p>Too many results, be more specific</p>}
        </div>)
}

ReactDOM.render(<App />, document.getElementById('root'))




interface Country {
  name: string
  topLevelDomain: string[]
  alpha2Code: string
  alpha3Code: string
  callingCodes: string[]
  capital: string
  altSpellings: string[]
  region: string
  subregion: string
  population: number
  latlng: number[]
  demonym: string
  area?: number
  gini?: number
  timezones: string[]
  borders: string[]
  nativeName: string
  numericCode?: string
  currencies: Currency[]
  languages: Language[]
  translations: Translations
  flag: string
}

interface Translations {
  de?: string
  es?: string
  fr?: string
  ja?: string
  it?: string
  br: string
  pt: string
  nl?: string
  hr?: string
  fa: string
}

interface Language {
  iso639_1?: string
  iso639_2: string
  name: string
  nativeName: string
}

interface Currency {
  code?: string | string
  name?: string | string
  symbol?: null | string | string
}

interface Weather {
  location: Location;
  current: Current;
}

interface Current {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}