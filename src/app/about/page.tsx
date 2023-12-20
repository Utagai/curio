import { Libre_Caslon_Text } from "next/font/google";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center m-4 h-full">
      <div className="font-librecaslon bg-gray-700 rounded-sm drop-shadow-xl m-4 p-4 flex flex-col items-left">
        <p className="text-2xl">curio</p>
        <p>[ku·ri·o]</p> <p className="italic">noun, plural cu·ri·os</p>
        <hr className="m-4" />
        <p>1. A rare, unusual, or intriguing object.</p>
        <p>2. A website for sharing IRL easter eggs.</p>
        <p>3. A work in progress.</p>
      </div>
    </div>
  );
}
