import EditableHeader from "./EditableHeader";
import SubmitButton from "./SubmitButton";
import UploadImageButton from "./UploadImageButton";

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
          <div className="md:flex-1 bg-gray-700 p-4 rounded-lg shadow-drop">
            <div className="h-full w-full" id="map">
              <iframe
                className="h-full w-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24201.453993981195!2d-73.87777722063598!3d40.691994681261235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25d0d3ab223cd%3A0x16b11fd586b90f7d!2sRoberta&#39;s!5e0!3m2!1sen!2sus!4v1701649584713!5m2!1sen!2sus"
                loading="lazy"
              ></iframe>
            </div>
          </div>
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
