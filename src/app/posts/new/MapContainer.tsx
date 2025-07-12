"use client";

import { Latlng } from "@/app/model/latlng";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Do not confuse this with MapContainer from react-leaflet. This is a container
// for the Map component in this project.
// As you might guess, I'm happy to take suggestions for a better name.

type MapContainerProps = {
  onMarkerChange?: (loc: Latlng) => void;
  clickable: boolean;
  initialLocation?: Latlng;
};

export default function MapContainer({
  onMarkerChange,
  clickable,
  initialLocation,
}: MapContainerProps) {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        loading: () => (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-3xl bg-gray-700">loading map...</h1>
          </div>
        ),
        ssr: false,
      }),
    [],
  );
  return (
    <div className="md:flex-1">
      <div className="w-full md:h-full aspect-square md:aspect-auto rounded-lg overflow-hidden">
        <Map
          onMarkerChange={onMarkerChange}
          clickable={clickable}
          initialLocation={initialLocation}
        />
      </div>
    </div>
  );
}
