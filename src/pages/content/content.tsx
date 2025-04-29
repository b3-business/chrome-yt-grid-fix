import { contentLogger } from "./contentLogger";
import { waitOnceForElements } from "./waitOnceForElements";

const ytdAppSelector = "ytd-app";
const richGridSelector = "ytd-rich-grid-renderer";
const richGridContentSelector = "#contents.ytd-rich-grid-renderer";

// Functions in content script
// ----------------------------

async function searchElementAndApplyGridFix() {
  const richGridElements = await waitOnceForElements(richGridSelector);
  const storageResponse = await chrome.storage.sync.get({
    preferredGridItemsPerRow: 5,
  });

  updateGridItemsPerRow(
    richGridElements,
    storageResponse.preferredGridItemsPerRow,
  );
}

function updateGridItemsPerRow(
  richGridElements: HTMLElement[],
  preferredGridItemsPerRow: number,
) {
  for (const richGridElement of richGridElements) {
    // contentLogger.debug(`richGridElement:`, richGridElement);
    const style = window.getComputedStyle(richGridElement);
    const gridItemsPerRow = style.getPropertyValue(
      "--ytd-rich-grid-items-per-row",
    );

    // Immediate apply
    // richGridElement.style.setProperty(
    //   "--ytd-rich-grid-items-per-row",
    //   preferredGridItemsPerRow.toString(),
    // );
    // contentLogger.info(
    //   `Overwrote grid items per row from: ${gridItemsPerRow} to: ${preferredGridItemsPerRow}`,
    // );

    // Delayed apply
    const delayedApply = setTimeout(() => {
      const richGridContent = richGridElement.querySelector(
        richGridContentSelector,
      ) as HTMLElement;
      richGridElement.style.setProperty(
        "--ytd-rich-grid-items-per-row",
        preferredGridItemsPerRow.toString(),
      );
      richGridContent.style.setProperty(
        "--ytd-rich-grid-items-per-row",
        preferredGridItemsPerRow.toString(),
      );
      clearTimeout(delayedApply);
      contentLogger.info(
        `Overwrote grid items per row from: ${gridItemsPerRow} to: ${preferredGridItemsPerRow}`,
      );
    }, 10);

    contentLogger.debug(
      `Delayed apply of grid items per row to: ${preferredGridItemsPerRow}`,
    );
  }
}

// Top-Level Code in content script
// ----------------------------

// Runs on page load
searchElementAndApplyGridFix();

//
// (window as any).navigation.addEventListener("navigate", (event: any) => {
//   const url = new URL(event.destination.url);
//   const delayedExec = setTimeout(async () => {
//     contentLogger.info("doing onPageLoad again", { url: url.href });
//     onPageLoad();
//     clearTimeout(delayedExec);
//   }, 2000);
// });

Setup a listener for navigation changes
const ytdAppElements = document.querySelectorAll(ytdAppSelector);
if (ytdAppElements.length > 0) {
  contentLogger.debug("ytdAppElement found");
  ytdAppElements.forEach((ytdAppElement) => {
    ytdAppElement.addEventListener("yt-navigate-finish", (event) => {
      contentLogger.debug("yt-navigate-finish triggered");
      searchElementAndApplyGridFix();
    });
  });
}

// Setup a listener for changes to the storage
chrome.storage.sync.onChanged.addListener((changes) => {
  contentLogger.debug(`Storage changes: ${JSON.stringify(changes)}`);
  if (changes.preferredGridItemsPerRow) {
    searchElementAndApplyGridFix();
  }
});
