import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

import { useState } from "react";

import { ErrorBoundary } from "./ErrorBoundary";
import { SearchInput } from "./SearchInput";
import { VectorMap } from "./VectorMap";

const apiKey = "YOUR_API_KEY";

const App = () => {
  const [locations, setLocations] = useState([]);
  return (
    <ErrorBoundary>
      <div className="map">
        <VectorMap
          apiKey={apiKey}
          locations={locations}
        />
      </div>
      <div className="search">
        <SearchInput
          apiKey={apiKey}
          maximumNumberOfSuggestions={5}
          onSearch={(locations) => { setLocations(locations) }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
