import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800">
      <h1 className="text-4xl font-pacifico">Wond</h1>
      <div>
        <Link
          href="/listing"
          className="text-white px-4 py-2 hover:text-gray-300"
        >
          Posts
        </Link>
        <a href="#" className="text-white px-4 py-2 hover:text-gray-300">
          About
        </a>
      </div>
    </nav>
  );
}
