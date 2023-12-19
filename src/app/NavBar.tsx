import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800">
      <h1 className="text-4xl font-pacifico">Curio</h1>
      <div>
        <Link
          href="/posts"
          className="text-white px-4 py-2 hover:text-gray-300"
        >
          Posts
        </Link>
        <Link
          href="/posts/new"
          className="text-white px-4 py-2 hover:text-gray-300"
        >
          New
        </Link>
        <a href="#" className="text-white px-4 py-2 hover:text-gray-300">
          About
        </a>
      </div>
    </nav>
  );
}
