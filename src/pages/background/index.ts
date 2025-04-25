import {
  ExtensionMessage,
  GetGridItemsPerRowResponse,
  UpdateGridItemsPerRowResponse,
} from "@src/lib/ExtensionMessage.type";
import { mainLogger } from "@src/utils/logger";
import { initStorage } from "./initStorage";

const logger = mainLogger.getSubLogger({ name: "background" });
logger.info("background script loaded");

initStorage();

chrome.runtime.onMessage.addListener((pureMessage, sender, sendResponse) => {
  const messageParsed = ExtensionMessage.safeParse(pureMessage);

  if (!messageParsed.success) {
    logger.error(`DEV ERROR: Invalid message: ${messageParsed.error.message}`);
    sendResponse({
      error: `Invalid message: ${messageParsed.error.message}`,
    });
    return false;
  }
  const message = messageParsed.data;
  logger.debug(`Received valid message: `, message);

  // Handle message: GET_GRID_ITEMS_PER_ROW
  // used by the content script & the popup
  // ------------------------------------------
  if (message.type === "GET_GRID_ITEMS_PER_ROW") {
    chrome.storage.sync
      .get("preferredGridItemsPerRow")
      .then((response) => {
        logger.debug(`Raw sync storage response: `, response);

        if (!response.preferredGridItemsPerRow) {
          return chrome.storage.sync
            .set({ preferredGridItemsPerRow: 5 })
            .then(() => {
              return response.preferredGridItemsPerRow;
            });
        }
        return response.preferredGridItemsPerRow;
      })
      .then((preferredGridItemsPerRow) => {
        sendResponse({
          type: "GET_GRID_ITEMS_PER_ROW_RESPONSE",
          value: preferredGridItemsPerRow,
        } satisfies GetGridItemsPerRowResponse);
      });
    return true;
  }

  // Handle message: UPDATE_GRID_ITEMS_PER_ROW
  // ------------------------------------------
  if (message.type === "UPDATE_GRID_ITEMS_PER_ROW") {
    chrome.storage.sync
      .set({
        preferredGridItemsPerRow: message.value,
      })
      .then(() => {
        sendResponse({
          type: "UPDATE_GRID_ITEMS_PER_ROW_RESPONSE",
        } satisfies UpdateGridItemsPerRowResponse);
      });
    return true;
  }
});
