import { contentLogger } from "./contentLogger";
import { waitOnceForElement } from "./waitOnceForElement";

async function main() {
  const richGridRenderer$ = await waitOnceForElement(
    "#contents.ytd-rich-grid-renderer",
  );
  const preferredGridItemsPerRow = await chrome.runtime.sendMessage({
    type: "GET_GRID_ITEMS_PER_ROW",
  });
  const style = window.getComputedStyle(richGridRenderer$);
  const gridItemsPerRow = style.getPropertyValue(
    "--ytd-rich-grid-items-per-row",
  );
  contentLogger.info(`YT native grid items per row: ${gridItemsPerRow}`);

  richGridRenderer$.style.setProperty(
    "--ytd-rich-grid-items-per-row",
    preferredGridItemsPerRow,
  );
  contentLogger.info(
    `Overwrote grid items per row to: ${preferredGridItemsPerRow}`,
  );
}

main();
