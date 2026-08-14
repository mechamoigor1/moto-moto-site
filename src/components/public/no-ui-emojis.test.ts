import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const UI_DIRECTORIES = [
  join(process.cwd(), "src", "app"),
  join(process.cwd(), "src", "components"),
];
const EMOJI_PATTERN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

async function findUiEmojiFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const matches = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return findUiEmojiFiles(path);
      }

      if (!entry.isFile() || !/\.tsx?$/.test(entry.name)) {
        return [];
      }

      return EMOJI_PATTERN.test(await readFile(path, "utf8")) ? [relative(process.cwd(), path)] : [];
    })
  );

  return matches.flat();
}

describe("UI emoji policy", () => {
  it("does not use Unicode emoji in app or component TypeScript", async () => {
    const emojiFiles = (await Promise.all(UI_DIRECTORIES.map(findUiEmojiFiles))).flat();

    expect(emojiFiles).toEqual([]);
  });
});
