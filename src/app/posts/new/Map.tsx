import Leaflet from "leaflet";
import { MapContainer, Marker, TileLayer, Circle } from "react-leaflet";
import { useMap, useMapEvent } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Latlng as LatLng } from "@/app/model/latlng";

export const MapResizeRequestEventName = "map-resize-request";

export default function MyMap(props: {
  onMarkerChange: ((loc: LatLng) => void) | undefined;
  clickable: boolean;
}) {
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

  const [clickedLatLng, setClickedLatLng] = useState<LatLng>({
    lat: 40.7767,
    lng: -73.9727,
  });

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
          if (props.onMarkerChange !== undefined) {
            props.onMarkerChange(latlng); // Update the parent component's state.
          }
        }}
        clickable={props.clickable}
      />
    </MapContainer>
  );
}

function ListenerComponent(props: {
  setClickedLatLng: (loc: LatLng) => void;
  clickable: boolean;
}) {
  const map = useMap();
  useMapEvent("click", (e) => {
    if (!props.clickable) return;
    props.setClickedLatLng(e.latlng);
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
