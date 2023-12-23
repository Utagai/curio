"use client";

import { Latlng } from "@/app/model/latlng";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Do not confuse this with MapContainer from react-leaflet. This is a container
// for the Map component in this project.
// As you might guess, I'm happy to take suggestions for a better name.
export default function MapContainer(props: {
  onMarkerChange: ((loc: Latlng) => void) | undefined;
}) {
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
    []
  );
  return (
    <div className="md:flex-1 bg-gray-700 p-2 rounded-lg shadow-drop">
      <div className="w-full md:h-full aspect-square md:aspect-auto">
        <Map onMarkerChange={props.onMarkerChange} />
      </div>
    </div>
  );
}
