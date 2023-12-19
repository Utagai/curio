import EditableHeader from "./EditableHeader";
import SubmitButton from "./SubmitButton";
import UploadImageButton from "./UploadImageButton";
import MapContainer from "./MapContainer";

export default function NewPost() {
  return (
    <>
      <main className="py-8 px-32 m-8">
        <div className="mb-6">
          <h2 className="text-3xl mb-2">
            <span>
              <EditableHeader placeholder="Your Title" />
            </span>
            <span className="text-sm text-gray-400">
              by {"you" /* TODO: Need to dynamically get this value */}
            </span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
          <div className="md:flex-1 bg-gray-700 p-4 rounded-lg shadow-drop mb-4 md:mb-0">
            <UploadImageButton />
          </div>
          <MapContainer />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-drop mb-6">
          <h3 className="text-xl mb-2">Description</h3>

          <textarea
            className="editable bg-gray-700 w-full p-4 rounded-lg"
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
