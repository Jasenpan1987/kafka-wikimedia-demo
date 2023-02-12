import { getEnv } from "./utils/env";

function main() {
  const author = getEnv("AUTHOR");
  console.log("hello from " + author);
}

main();
