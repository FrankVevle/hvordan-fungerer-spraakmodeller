import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../tilskudd/jus-kilder.js"),
  "utf8"
);
const loaded = new Function(`${src}; return { JUS_KILDER, JUS_TYPELABEL };`)();

export const JUS_KILDER = loaded.JUS_KILDER;
export const JUS_TYPELABEL = loaded.JUS_TYPELABEL;
