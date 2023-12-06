import DifficultyLabel, { Difficulty } from "../difficulty";

export default function Post() {
  return (
    <>
      <main className="p-4 m-8">
        <div className="mb-6">
          <h2 className="text-3xl mb-2">
            Title <span className="text-sm text-gray-400">by Bob</span>
            <DifficultyLabel diff={Difficulty.MEDIUM} />
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
          <div className="md:flex-1 bg-gray-700 p-4 rounded-lg shadow-drop mb-4 md:mb-0">
            <img
              src="https://source.unsplash.com/random"
              alt="placeholder"
              className="w-full h-auto rounded-lg"
            />
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
          <p>lorem ipsum dolor sit amet</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-drop flex items-center">
            <div className="w-24 h-24 bg-gray-700 mr-4"></div>
            <div>
              <h4 className="text-lg mb-1">found by Kim</h4>
              <p className="text-gray-400 mb-1">Lorem ipsum dolor sit amet.</p>
              <p className="text-gray-500 text-sm">December 2, 2023</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-drop flex items-center">
            <div className="w-24 h-24 bg-gray-700 mr-4"></div>
            <div>
              <h4 className="text-lg mb-1">found by Alice</h4>
              <p className="text-gray-400 mb-1">Lorem ipsum dolor sit amet.</p>
              <p className="text-gray-500 text-sm">December 1, 2023</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
