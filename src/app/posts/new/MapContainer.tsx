"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function MapContainer() {
  const Map = dynamic(() => import("./Map"), {
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl bg-gray-700">loading map...</h1>
      </div>
    ),
    ssr: false,
  });
  return (
    <div className="md:flex-1 bg-gray-700 p-4 rounded-lg shadow-drop">
      <div className="h-full w-full">
        <Map />
      </div>
    </div>
  );
}
