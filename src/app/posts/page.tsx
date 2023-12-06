export default function Posts() {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-green rounded-lg overflow-hidden card-shadow">
          <img
            src="https://source.unsplash.com/random/400x200"
            alt="preview image"
            className="w-full"
          />
          <div className="p-4">
            <h3 className="font-semibold">Title by Sam</h3>
            <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
              Easy
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-1">
        <a
          href="#"
          className="px-3 py-1 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300"
        >
          1
        </a>
        <a
          href="#"
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          2
        </a>
        <span className="px-3 py-1">...</span>
        <a
          href="#"
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          &gt;
        </a>
      </div>
    </main>
  );
}
