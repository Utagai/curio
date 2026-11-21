import { changelog } from "./changelog";
import EnableNotifications from "./EnableNotifications";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center m-4 h-full">
      <div className="font-librecaslon bg-gray-700 rounded-lg shadow-xl border border-pink-200 m-4 p-4 flex flex-col items-left">
        <p className="text-2xl font-baloo2 text-pink-400">curio</p>
        <p>[ku·ri·o]</p> <p className="italic">noun, plural cu·ri·os</p>
        <hr className="m-4" />
        <p>1. A rare, unusual, or intriguing object.</p>
        <p>2. An app for sharing IRL easter eggs.</p>
        <p>3. Work in progress.</p>
        <p className="text-center">🚧 🐇 🚧</p>
      </div>
      <EnableNotifications />
      <section
        aria-labelledby="changelog-heading"
        className="w-full max-w-2xl bg-gray-700 rounded-lg shadow-xl border border-pink-200 m-4 p-6"
      >
        <h2
          id="changelog-heading"
          className="text-2xl font-baloo2 text-pink-400"
        >
          Changelog
        </h2>
        <p className="mt-1 text-sm text-gray-300">
          A running list of what&apos;s new in Curio.
        </p>
        <ol className="mt-6 flex flex-col gap-6">
          {changelog.map((entry) => (
            <li
              key={entry.date}
              className="border-l-2 border-pink-400/40 pl-4"
            >
              <time
                dateTime={entry.date}
                className="block font-semibold text-pink-300"
              >
                {formatDate(entry.date)}
              </time>
              <ul className="mt-1 list-disc list-inside space-y-1 text-gray-100">
                {entry.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
