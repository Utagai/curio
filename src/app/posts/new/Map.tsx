import Leaflet from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  Circle,
  CircleMarker,
} from "react-leaflet";
import { useMap, useMapEvent } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_LOC_LATLNG, Latlng as LatLng } from "@/app/model/latlng";

export const MapResizeRequestEventName = "map-resize-request";

const USER_LOCATION_COLOR = "#3b82f6";
const USER_LOCATION_ZOOM = 16;
// Don't auto-zoom out to show a user who is browsing from far away.
const MAX_AUTO_FIT_DISTANCE_METERS = 2000;

type MyMapProps = {
  onMarkerChange: ((loc: LatLng) => void) | undefined;
  clickable: boolean;
  initialLocation: LatLng | undefined;
  // Shows the device's current location as a blue dot. Defaults to true.
  showUserLocation?: boolean;
};

export default function Map({
  onMarkerChange,
  clickable,
  initialLocation,
  showUserLocation = true,
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
        radius={200} // Is about 1/8 mile radius (the API's unit is meters). This means it should draw about a 1/4 mile diameter circle.
      ></Circle>
      {showUserLocation && <UserLocation referenceLocation={initialLocation} />}
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

type UserPosition = {
  latlng: LatLng;
  accuracy: number;
};

function UserLocation({ referenceLocation }: { referenceLocation: LatLng }) {
  const map = useMap();
  const [position, setPosition] = useState<UserPosition | null>(null);
  const hasAutoFitted = useRef(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          latlng: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracy: pos.coords.accuracy,
        });
      },
      (error) => {
        // Permission denial is common, and the map is still usable without a
        // location dot, so just log this instead of showing an error.
        console.warn("Error watching user location:", error.message);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // The first time we get a fix, make sure both the user and the curio region
  // are visible. After that, leave the map alone so it doesn't jump around
  // while the user walks.
  useEffect(() => {
    if (!position || hasAutoFitted.current) return;
    hasAutoFitted.current = true;

    const reference = Leaflet.latLng(
      referenceLocation.lat,
      referenceLocation.lng,
    );
    const me = Leaflet.latLng(position.latlng.lat, position.latlng.lng);
    const distance = me.distanceTo(reference);

    if (distance > 40 && distance <= MAX_AUTO_FIT_DISTANCE_METERS) {
      map.fitBounds(Leaflet.latLngBounds([me, reference]), {
        padding: [32, 32],
        maxZoom: 17,
      });
    }
  }, [position, referenceLocation, map]);

  return (
    <>
      {position && (
        <>
          <Circle
            center={[position.latlng.lat, position.latlng.lng]}
            radius={Math.max(Math.min(position.accuracy, 1000), 1)}
            pathOptions={{
              color: USER_LOCATION_COLOR,
              weight: 1,
              opacity: 0.4,
              fillColor: USER_LOCATION_COLOR,
              fillOpacity: 0.12,
            }}
            interactive={false}
          />
          <CircleMarker
            center={[position.latlng.lat, position.latlng.lng]}
            radius={7}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: USER_LOCATION_COLOR,
              fillOpacity: 1,
            }}
            interactive={false}
          />
        </>
      )}
      <LocateControl
        position={position}
        referenceLocation={referenceLocation}
      />
    </>
  );
}

function LocateControl({
  position,
  referenceLocation,
}: {
  position: UserPosition | null;
  referenceLocation: LatLng;
}) {
  const map = useMap();
  const positionRef = useRef(position);
  const referenceRef = useRef(referenceLocation);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const locatingRef = useRef(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    referenceRef.current = referenceLocation;
  }, [referenceLocation]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    button.classList.toggle("is-locating", locating);
    button.disabled = locating;
    button.title = locating ? "Locating..." : "Show my location";
  }, [locating]);

  useEffect(() => {
    const control = new Leaflet.Control({ position: "bottomright" });

    const showPosition = (latlng: LatLng) => {
      const me = Leaflet.latLng(latlng.lat, latlng.lng);
      const reference = Leaflet.latLng(
        referenceRef.current.lat,
        referenceRef.current.lng,
      );
      const distance = me.distanceTo(reference);

      // When the curio is nearby, frame both so the user can see where they
      // are relative to it. Otherwise just center on the user.
      if (distance > 40 && distance <= MAX_AUTO_FIT_DISTANCE_METERS) {
        map.fitBounds(Leaflet.latLngBounds([me, reference]), {
          padding: [32, 32],
          maxZoom: 17,
        });
      } else {
        map.flyTo(
          [latlng.lat, latlng.lng],
          Math.max(map.getZoom(), USER_LOCATION_ZOOM),
        );
      }
    };

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (locatingRef.current) return;

      if (positionRef.current) {
        showPosition(positionRef.current.latlng);
        return;
      }

      if (typeof navigator === "undefined" || !navigator.geolocation) return;

      locatingRef.current = true;
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locatingRef.current = false;
          setLocating(false);
          showPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => {
          locatingRef.current = false;
          setLocating(false);
          console.warn("Error getting user location:", error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    };

    control.onAdd = () => {
      const container = Leaflet.DomUtil.create(
        "div",
        "leaflet-control curio-locate-control",
      );
      const button = Leaflet.DomUtil.create(
        "button",
        "curio-locate-button",
        container,
      ) as HTMLButtonElement;
      button.type = "button";
      button.title = "Show my location";
      button.setAttribute("aria-label", "Show my location");
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>`;
      button.addEventListener("click", handleClick);
      buttonRef.current = button;

      Leaflet.DomEvent.disableClickPropagation(container);
      Leaflet.DomEvent.disableScrollPropagation(container);

      return container;
    };

    map.addControl(control);

    return () => {
      map.removeControl(control);
      buttonRef.current = null;
    };
  }, [map]);

  return null;
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
