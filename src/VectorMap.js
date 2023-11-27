import "./VectorMap.css"

import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { Map, Marker, Popup } from "react-map-gl/maplibre";

const mapStyleUrl = "https://vectormaps-resources.myptv.com/styles/latest/standard.json";

const markerColor = "#4268F9";

const VectorMap = (props) => {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  const createMarker = (location) => {
    return (
      <Marker
        key={location.formattedAddress}
        color={markerColor}
        longitude={location.referencePosition.longitude}
        latitude={location.referencePosition.latitude}
        onClick={(event) => {
          event.originalEvent.stopPropagation();
          mapRef.current?.getMap().flyTo({
            center: [
              location.referencePosition.longitude, location.referencePosition.latitude
            ],
            zoom: 12
          });
          setPopupInfo(location);
        }}
      />
    );
  }

  const markers = useMemo(() => props.locations.map((location) => createMarker(location)), [props.locations]);

  const calculateBounds = (locations) => {
    if (locations.length === 0) {
      return { left: -180, right: 180, top: 90, bottom: -90 };
    }
    return locations.reduce((bounds, location) => {
      const { longitude, latitude } = location.referencePosition;
      return {
        left: Math.min(bounds.left, longitude),
        right: Math.max(bounds.right, longitude),
        top: Math.max(bounds.top, latitude),
        bottom: Math.min(bounds.bottom, latitude)
      };
    }, {
      left: locations[0].referencePosition.longitude,
      right: locations[0].referencePosition.longitude,
      top: locations[0].referencePosition.latitude,
      bottom: locations[0].referencePosition.latitude
    });
  };

  const zoomToLocations = (locations) => {
    const map = mapRef.current?.getMap();
    if (locations.length === 1) {
      map?.flyTo({
        center: [
          locations[0].referencePosition.longitude, locations[0].referencePosition.latitude
        ],
        zoom: 12
      });
    }
    if (locations.length > 1) {
      const bounds = calculateBounds(locations);
      map?.fitBounds([
        bounds.left, bounds.top, bounds.right, bounds.bottom
      ], {
        padding: {
          top: 100,
          bottom: 100,
          left: 500,
          right: 100
        }
      });
    }
  }

  useEffect(() => {
    setPopupInfo(null);
    zoomToLocations(props.locations);

  }, [props.locations]);

  const applyApiKey = useCallback((url, resourceType) => {
    if (resourceType === "Tile") {
      return {
        url: url,
        headers: {
          ApiKey: " " + props.apiKey
        }
      };
    }
    return { url: url, headers: {} };
  });

  return (
    <Map
      ref={mapRef}
      mapStyle={mapStyleUrl}
      initialViewState={props.initialViewState}
      transformRequest={(url, resourceType) => applyApiKey(url, resourceType)}
      onMove={props.onMove}>
      {markers}
      {!!popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.referencePosition.longitude)}
          latitude={Number(popupInfo.referencePosition.latitude)}
          onClose={() => setPopupInfo(null)}>
          <p>{popupInfo.formattedAddress}</p>
        </Popup>
      )}
    </Map>
  );
};

export { VectorMap };