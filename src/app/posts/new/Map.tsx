import Leaflet from "leaflet";
import { MapContainer, Marker, TileLayer, Circle } from "react-leaflet";
import { useMap, useMapEvent } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { DEFAULT_LOC_LATLNG, Latlng as LatLng } from "@/app/model/latlng";

export const MapResizeRequestEventName = "map-resize-request";

type MyMapProps = {
  onMarkerChange: ((loc: LatLng) => void) | undefined;
  clickable: boolean;
  initialLocation: LatLng | undefined;
};

export default function Map({
  onMarkerChange,
  clickable,
  initialLocation,
}: MyMapProps) {
  // This overrides leaflet's default marker icons with our own.
  // See next.config.js for how these files come to be.
  // Stolen shamelessly from the following project without fully undersetanding it:
  // https://github.com/colbyfayock/next-leaflet-starter
  useEffect(() => {
    (async function init() {
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "../leaflet/images/marker-icon-2x.png",
        iconUrl: "../leaflet/images/marker-icon.png",
        shadowUrl: "../leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  if (!initialLocation) {
    initialLocation = DEFAULT_LOC_LATLNG;
  }

  const [clickedLatLng, setClickedLatLng] = useState<LatLng>(initialLocation);

  useEffect(() => {
    if (initialLocation) {
      setClickedLatLng(initialLocation);
    }
  }, [initialLocation]);

  return (
    <MapContainer
      center={[clickedLatLng.lat, clickedLatLng.lng]}
      zoom={14}
      className="h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[clickedLatLng.lat, clickedLatLng.lng]}></Marker>
      <Circle
        center={[clickedLatLng.lat, clickedLatLng.lng]}
        pathOptions={{ color: "pink" }}
        radius={800} // Is about 1/2 mile radius (the API's unit is meters). This means it should draw about a 1 mile diameter circle.
      ></Circle>
      <ListenerComponent
        setClickedLatLng={(latlng: LatLng) => {
          setClickedLatLng(latlng); // Update the displayed map marker state.
          if (onMarkerChange !== undefined) {
            onMarkerChange(latlng); // Update the parent component's state.
          }
        }}
        clickable={clickable}
      />
    </MapContainer>
  );
}

type ListenerComponentProps = {
  setClickedLatLng: (loc: LatLng) => void;
  clickable: boolean;
};

function ListenerComponent({
  setClickedLatLng,
  clickable,
}: ListenerComponentProps) {
  const map = useMap();
  useMapEvent("click", (e) => {
    if (!clickable) return;
    setClickedLatLng(e.latlng);
  });
  window.addEventListener(MapResizeRequestEventName, () => {
    console.log("map resize request received");
    const resize = () => {
      setTimeout(() => {
        if (map.invalidateSize(true).getSize() == map.getSize()) {
          console.log("map size has not changed");
          resize();
        } else {
          console.log("map size changed");
          return;
        }
      }, 100);
    };
    resize();
  });
  return null;
}
