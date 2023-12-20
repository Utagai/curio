import EditableHeader from "./EditableHeader";
import SubmitButton from "./SubmitButton";
import UploadImageButton from "./UploadImageButton";
import MapContainer from "./MapContainer";
import { currentUser } from "@clerk/nextjs";

export default async function NewPost() {
  const user = await currentUser();
  return (
    <>
      <main className="py-8 md:px-32 px-4px-32 m-4">
        <div className="mb-4">
          <h2 className="text-3xl">
            <span className="block md:inline-block">
              <EditableHeader placeholder="Your Title" />
            </span>
            <span className="text-sm text-gray-400">by {user?.username}</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="md:flex-1 bg-gray-700 p-2 rounded-lg shadow-drop mb-4 md:mb-0">
            <UploadImageButton />
          </div>
          <MapContainer />
        </div>

        <div className="bg-gray-800 p-2 rounded-lg shadow-drop mb-4">
          <h3 className="text-xl font-semibold mb-2">Description</h3>

          <textarea
            className="editable bg-gray-700 w-full p-2 rounded-lg"
            rows={4}
            placeholder="Your description"
          ></textarea>
        </div>

        {/* TODO: This button currently doesn't do anything */}
        <SubmitButton />
      </main>
    </>
  );
}
