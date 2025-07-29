"use client";

import { Latlng } from "@/app/model/latlng";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";

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
        loading: () => <LoadingIndicator message="Loading map..." />,
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
