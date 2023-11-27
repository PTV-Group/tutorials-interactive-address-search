import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

import { useState } from "react";

import { ErrorBoundary } from "./ErrorBoundary";
import { SearchInput } from "./SearchInput";
import { VectorMap } from "./VectorMap";

const apiKey = "YOUR_API_KEY";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState({
    longitude: 8.4055677,
    latitude: 49.0070036,
    zoom: 10,
    pitch: 0,
    bearing: 0
  })
  return (
    <ErrorBoundary>
      <div className="map">
        <VectorMap
          apiKey={apiKey}
          locations={locations}
          initialViewState={center}
          onMove={(event) => {
            setCenter( {
              longitude : event.target.getCenter().lng,
              latitude: event.target.getCenter().lat
            }
            )
          }}
        />
      </div>
      <div className="search">
        <SearchInput
          apiKey={apiKey}
          center={center}
          maximumNumberOfSuggestions={5}
          onSearch={(locations) => { setLocations(locations) }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
