import React, { Component } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

import right from "./images/icon-arrow.svg";

import "./App.scss";

const GOOGLE_MAP_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const GEO_KEY = process.env.REACT_APP_GEO_API_KEY;
var data = {};
var center = { lat: 44, lng: -80 };

export class App extends Component {
  location = '';
  ipAddress = '';
  timeZone = '';
  isp = '';

  componentDidMount() {
    this.getGeoData("129.78.110.124");
  }

  onSearch = (e) => {
    e.preventDefault();
    this.getGeoData(e.target.form.search.value);
    e.target.form.reset();
  }

  getGeoData = async (ip) => {
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${GEO_KEY}&ipAddress=${ip}`);
    const json = await response.json();
    center = { lat: json.location.lat, lng: json.location.lng };
    data = json;
    this.location = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
    this.ipAddress = data.ip;
    this.timeZone = data.location.timezone;
    this.isp = data.isp;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1>IP Address Tracker</h1>
          <div className="search">
            <form>
              <input type="text" name="search" placeholder="Search for any IP address or domain" />
              <button onClick={this.onSearch}>
                <img src={right} alt="" aria-hidden='true' />
                <span className="sr-only">Search button</span>
              </button>
            </form>
          </div>
          <div className="info">
            <ul>
              <li>
                <h2>IP ADDRESS</h2>
                <p>{this.ipAddress}</p>
              </li>
              <li>
                <h2>LOCATION</h2>
                <p>{this.location}</p>
              </li>
              <li>
                <h2>TIMEZONE</h2>
                <p>UTC {this.timeZone}</p>
              </li>
              <li>
                <h2>ISP</h2>
                <p>{this.isp}</p>
              </li>
            </ul>
          </div>
        </header>
        <main>
          <AppGoogleMap />
        </main>
      </div>
    )
  }
}

const AppGoogleMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_KEY,
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return <Map />;
}

const Map = () => {
  return (
    <GoogleMap
      mapContainerClassName="map-container"
      zoom={12}
      center={center}
    >
      <MarkerF position={center} />
    </GoogleMap>
  );
}

export default App;
