import { contentLogger } from "./contentLogger";
import { waitOnceForElement } from "./waitOnceForElement";

const richGridSelector = "#contents.ytd-rich-grid-renderer";
let richGridElement: HTMLElement | undefined;

async function main() {
  richGridElement = await waitOnceForElement(richGridSelector);
  const storageResponse = await chrome.storage.sync.get({
    preferredGridItemsPerRow: 5,
  });

  updateGridItemsPerRow(
    richGridElement,
    storageResponse.preferredGridItemsPerRow,
  );
}
main();

// Setup a listener for changes to the storage
chrome.storage.sync.onChanged.addListener((changes) => {
  contentLogger.debug(`Storage changes: ${JSON.stringify(changes)}`);
  if (changes.preferredGridItemsPerRow) {
    updateGridItemsPerRow(
      richGridElement,
      changes.preferredGridItemsPerRow.newValue,
    );
  }
});

function updateGridItemsPerRow(
  richGridElement: HTMLElement | undefined,
  preferredGridItemsPerRow: number,
) {
  if (!richGridElement) {
    contentLogger.error(
      "Rich grid element not passed to updateGridItemsPerRow()",
    );
    return;
  }

  const style = window.getComputedStyle(richGridElement);
  const gridItemsPerRow = style.getPropertyValue(
    "--ytd-rich-grid-items-per-row",
  );
  contentLogger.info(`Last grid items per row: ${gridItemsPerRow}`);

  richGridElement.style.setProperty(
    "--ytd-rich-grid-items-per-row",
    preferredGridItemsPerRow.toString(),
  );
  contentLogger.info(
    `Overwrote grid items per row to: ${preferredGridItemsPerRow}`,
  );
}
