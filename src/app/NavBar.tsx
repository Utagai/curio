import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 rounded-full m-2 shadow-lg">
      <h1 className="text-2xl md:text-4xl font-baloo2 flex items-center ml-2">
        <Image
          src="/logo.svg"
          alt="Curio Logo"
          width={32}
          height={32}
          className="mr-2"
        />
        curio
      </h1>
      <div className="flex items-center mr-2">
        <Link
          href="/posts"
          className="text-lg md:text-xl text-white px-2 md:px-4 py-2 hover:underline hover:text-pink-400 font-baloo2"
        >
          posts
        </Link>
        <Link
          href="/posts/new"
          className="text-lg md:text-xl text-white px-2 md:px-4 py-2 hover:underline hover:text-pink-400 font-baloo2"
        >
          new
        </Link>
        <Link
          href="/about"
          className="text-lg md:text-xl text-white px-2 md:px-4 py-2 hover:underline hover:text-pink-400 font-baloo2"
        >
          about
        </Link>
        <span className="inline-block ml-2">
          <UserButton />
        </span>
      </div>
    </nav>
  );
}
