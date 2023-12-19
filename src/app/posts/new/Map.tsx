import Leaflet from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

export default function MyMap() {
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

  return (
    <MapContainer center={[51.505, -0.09]} zoom={15} className="h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}></Marker>
    </MapContainer>
  );
}
