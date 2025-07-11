"use client";

import { useState, useEffect } from "react";
import EditableHeader from "./EditableHeader";
import UploadImageButton from "./UploadImageButton";
import MapContainer from "./MapContainer";
import SubmitButton from "./SubmitButton";
import { Difficulty } from "@/app/model/difficulty";
import { useRouter } from "next/navigation";
import { MapResizeRequestEventName } from "./Map";
import DifficultySelector from "./DifficultySelector";
import { DEFAULT_LOC_LATLNG } from "@/app/model/latlng";

type newPostState = {
  username: string | null | undefined;
  token: string | null;
  title: string;
  imageFile: File;
  loc: {
    lat: number;
    lng: number;
  };
  description: string;
  difficulty: Difficulty;
};
// ClientPage is the actual new post page that the user sees, but we needed to
// isolate our scopes. This is because we need client-side react code via e.g.
// useState, useEffect, and simulataneouly, we need server-side code such as
// currentUser().
type ClientPageProps = {
  username: string | null | undefined;
  token: string | null;
};
export default function ClientPage({ username, token }: ClientPageProps) {
  const [state, setState] = useState<newPostState>({
    username,
    token,
    // TODO: This magic value + its duplicate in Map.tsx should be moved to model/latlng.
    loc: DEFAULT_LOC_LATLNG,
    difficulty: Difficulty.MEDIUM,
  } as newPostState);
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setState((prevState) => ({
            ...prevState,
            loc: { lat: latitude, lng: longitude },
          }));
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 2000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  return (
    <>
      <main className="py-8 md:px-32 px-4px-32 m-4">
        <div className="mb-4">
          <h2 className="text-3xl">
            <span className="block md:inline-block">
              <EditableHeader
                placeholder="Your Title"
                onChange={(title) => setState({ ...state, title })}
              />
            </span>
            <span className="text-sm text-gray-400">by {state.username}</span>
            <span className="p-2">
              <DifficultySelector
                onSelect={(difficulty) => setState({ ...state, difficulty })}
              />
            </span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="md:flex-1 bg-gray-700 p-2 rounded-lg shadow-drop mb-4 md:mb-0">
            <UploadImageButton
              onUpload={(file) => {
                setState({ ...state, imageFile: file });
                // Leaflet is annoying because it requires us to manually call invalidateSize() on the map when the parent
                // container's height changes... I tried a few options through CSS but couldn't get it to update without
                // this machinery.
                window.dispatchEvent(new Event(MapResizeRequestEventName));
                console.log("dispatched map resize request");
              }}
            />
          </div>
          <MapContainer
            onMarkerChange={(loc) => {
              setState({ ...state, loc });
            }}
            clickable={true}
            initialLocation={state.loc}
          />
        </div>

        <div className="bg-gray-800 p-2 rounded-lg shadow-drop mb-4">
          <h3 className="text-xl font-semibold mb-2">Description</h3>

          <textarea
            className="editable bg-gray-700 w-full p-2 rounded-lg"
            rows={4}
            placeholder="Your description"
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
          ></textarea>
        </div>

        <SubmitButton
          onClick={() => {
            console.log(
              `PUT /api/posts. title: ${state.title}, description: ${state.description}, difficulty: ${state.difficulty}, imageFile: ${state.imageFile}, loc: ${state.loc}`,
            );
            const formData = new FormData();
            formData.append("title", state.title);
            formData.append("description", state.description);
            formData.append("difficulty", state.difficulty);
            formData.append("image", state.imageFile);
            formData.append("lat", state.loc.lat.toString());
            formData.append("lng", state.loc.lng.toString());
            formData.append("author", state.username!);
            formData.append("time", new Date().toISOString());

            fetch("/api/post", {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${state.token}`,
              },
              body: formData,
            })
              .then((res) => {
                return res.json();
              })
              .then((post) => {
                router.push(`/post/${post.id}`);
              });
          }}
        />
      </main>
    </>
  );
}
