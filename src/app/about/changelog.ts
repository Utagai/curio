/**
 * The Curio changelog.
 *
 * Keep entries in reverse-chronological order (newest first) and group all
 * changes made on the same day under a single entry. See AGENTS.md for the
 * convention on when and how to update this file.
 */
export type ChangelogEntry = {
  /** ISO date of the change, e.g. "2026-11-21". */
  date: string;
  /** Short, user-facing descriptions of what changed. */
  changes: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-11-21",
    changes: ["Added this changelog to the About page."],
  },
];
