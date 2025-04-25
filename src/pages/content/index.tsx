import { contentLogger } from "./contentLogger";
import { waitOnceForElement } from "./waitOnceForElement";

async function main() {
  const richGridRenderer$ = await waitOnceForElement(
    "#contents.ytd-rich-grid-renderer",
  );
  const style = window.getComputedStyle(richGridRenderer$);
  const gridItemsPerRow = style.getPropertyValue(
    "--ytd-rich-grid-items-per-row",
  );
  contentLogger.info(`Current grid items per row: ${gridItemsPerRow}`);
}

main();
