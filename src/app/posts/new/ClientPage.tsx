"use client";

import { useState, useEffect } from "react";
import EditableHeader from "./EditableHeader";
import UploadImageButton from "./UploadImageButton";
import MapContainer from "./MapContainer";
import SubmitButton from "./SubmitButton";
import { Difficulty } from "@/app/model/difficulty";
import { useRouter } from "next/navigation";
import { MapResizeRequestEventName } from "./Map";
import { createPost } from "@/app/actions";
import DifficultySelector from "./DifficultySelector";
import { DEFAULT_LOC_LATLNG } from "@/app/model/latlng";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import LoadingIndicator from "@/app/components/LoadingIndicator";

// Convert feet to degrees (approximately)
// 1 degree of latitude ≈ 364,000 feet
// 1 degree of longitude varies by latitude, but we'll use an approximation
const FEET_TO_DEGREES_LAT = 1 / 364000;
const FEET_TO_DEGREES_LNG = 1 / 288200; // Approximate for mid-latitudes

function addLocationJitter(
  lat: number,
  lng: number,
): { lat: number; lng: number } {
  // Random distance between 250-300 feet
  const minDistance = 250;
  const maxDistance = 300;
  const distance = Math.random() * (maxDistance - minDistance) + minDistance;

  // Random direction (0 to 2π radians)
  const angle = Math.random() * 2 * Math.PI;

  // Convert to coordinate offsets
  const latOffset = distance * Math.cos(angle) * FEET_TO_DEGREES_LAT;
  const lngOffset = distance * Math.sin(angle) * FEET_TO_DEGREES_LNG;

  return {
    lat: lat + latOffset,
    lng: lng + lngOffset,
  };
}

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
type GeolocationState = "loading" | "success" | "fallback";

export default function ClientPage({ username, token }: ClientPageProps) {
  const [state, setState] = useState<newPostState>({
    username,
    token,
    loc: DEFAULT_LOC_LATLNG,
    difficulty: Difficulty.MEDIUM,
  } as newPostState);
  const [geolocationState, setGeolocationState] =
    useState<GeolocationState>("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // TODO: This is a hack until we set up something like Sentry or whatever frontend logging solution we decide on.
  const [tippyMsg, setTippyMsg] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const jitteredLocation = addLocationJitter(latitude, longitude);
          setState((prevState) => ({
            ...prevState,
            loc: { lat: jitteredLocation.lat, lng: jitteredLocation.lng },
          }));
          setGeolocationState("success");
        },
        (error) => {
          console.error("Error getting user location:", error);
          setTippyMsg(
            `error getting user location: (msg: ${error.message}, code: ${error.code})`,
          );
          setGeolocationState("fallback");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      // No geolocation support - just use default location
      setGeolocationState("fallback");
    }
  }, []);

  return (
    <>
      <Tippy content={tippyMsg} theme="error" visible={!!tippyMsg}>
        <main className="py-8 px-4px-32 m-2">
          <div className="mb-4">
            <h2 className="text-3xl">
              <span className="block md:inline-block">
                <EditableHeader
                  placeholder="Curio Name"
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

          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 bg-gray-800 p-6 rounded-lg shadow-xl border border-pink-200">
            <div className="md:flex-1 mb-4 md:mb-0">
              <UploadImageButton
                onUpload={(file) => {
                  setState({ ...state, imageFile: file });
                  console.log("ON UPLOAD?!");
                  // Leaflet is annoying because it requires us to manually call invalidateSize() on the map when the parent
                  // container's height changes... I tried a few options through CSS but couldn't get it to update without
                  // this machinery.
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event(MapResizeRequestEventName));
                  }
                  console.log("dispatched map resize request");
                }}
              />
            </div>
            {geolocationState === "loading" ? (
              <div className="md:flex-1">
                <div className="w-full md:h-full aspect-square md:aspect-auto rounded-lg overflow-hidden bg-gray-700">
                  <LoadingIndicator message="Getting your location..." />
                </div>
              </div>
            ) : (
              <MapContainer
                onMarkerChange={(loc) => {
                  setState({ ...state, loc });
                }}
                clickable={true}
                initialLocation={state.loc}
              />
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-pink-200 mb-4">
            <h3 className="text-xl font-semibold mb-2">Description</h3>

            <textarea
              className="editable bg-gray-700 w-full p-2 rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
              rows={4}
              placeholder="Describe your curio. (FYI: If you allowed geolocation permissions, the shown map pin has been automatically jittered.)"
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="flex justify-center md:justify-start">
            <SubmitButton
              onClick={async () => {
                console.log(
                  `PUT /api/posts. title: ${state.title}, description: ${state.description}, difficulty: ${state.difficulty}, imageFile: ${state.imageFile}, loc: ${state.loc}`,
                );

                setIsSubmitting(true);

                try {
                  const formData = new FormData();
                  formData.append("title", state.title);
                  formData.append("description", state.description);
                  formData.append("difficulty", state.difficulty);
                  formData.append("image", state.imageFile);
                  formData.append("lat", state.loc.lat.toString());
                  formData.append("lng", state.loc.lng.toString());
                  formData.append("author", state.username!);
                  formData.append("time", new Date().toISOString());

                  const post = await createPost(formData);
                  if (post) {
                    router.push(`/post/${post.id}`);
                  }
                } catch (error) {
                  console.error("Error creating post:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Submit
            </SubmitButton>
          </div>
        </main>
      </Tippy>
    </>
  );
}
