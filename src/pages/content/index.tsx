import {
  ExtensionMessage,
  GetGridItemsPerRowMessage,
  GetGridItemsPerRowResponse,
} from "@src/lib/ExtensionMessage.type";
import { contentLogger } from "./contentLogger";
import { waitOnceForElement } from "./waitOnceForElement";

const richGridSelector = "#contents.ytd-rich-grid-renderer";
let richGridElement: HTMLElement | undefined;

async function main() {
  richGridElement = await waitOnceForElement(richGridSelector);
  const preferredGridItemsPerRow = await chrome.runtime.sendMessage<
    GetGridItemsPerRowMessage,
    GetGridItemsPerRowResponse
  >({
    type: "GET_GRID_ITEMS_PER_ROW",
  });

  updateGridItemsPerRow(richGridElement, preferredGridItemsPerRow.value);
}
main();

chrome.runtime.onMessage.addListener(
  (originalMessage, sender, sendResponse) => {
    const parsedMessage = ExtensionMessage.safeParse(originalMessage);
    if (!parsedMessage.success) {
      contentLogger.error(`Invalid message: ${parsedMessage.error}`);
      sendResponse({ error: `Invalid message: ${parsedMessage.error}` });
      return false;
    }
    const message = parsedMessage.data;
    contentLogger.debug(`Received message: ${message}`);

    if (message.type === "UPDATE_GRID_ITEMS_PER_ROW") {
      updateGridItemsPerRow(richGridElement, message.value);
      return true;
    }

    return false;
  },
);

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
