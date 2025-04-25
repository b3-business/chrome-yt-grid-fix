import {
  ExtensionMessage,
  GetGridItemsPerRowResponse,
  UpdateGridItemsPerRowResponse,
} from "@src/lib/ExtensionMessage.type";
import { mainLogger } from "@src/utils/logger";

const logger = mainLogger.getSubLogger({ name: "background" });
logger.info("background script loaded");

chrome.runtime.onMessage.addListener(
  async (pureMessage, sender, sendResponse) => {
    const messageParsed = ExtensionMessage.safeParse(pureMessage);

    if (!messageParsed.success) {
      logger.error(`DEV ERROR: Invalid message: ${messageParsed.error}`);
      sendResponse({ error: `Invalid message: ${messageParsed.error}` });
      return false;
    }
    const message = messageParsed.data;
    logger.debug(`Received valid message: ${message}`);

    // Handle message: GET_GRID_ITEMS_PER_ROW
    // used by the content script & the popup
    // ------------------------------------------
    if (message.type === "GET_GRID_ITEMS_PER_ROW") {
      const response = await chrome.storage.sync.get(
        "preferredGridItemsPerRow",
      );
      if (!response.preferredGridItemsPerRow) {
        await chrome.storage.sync.set({ preferredGridItemsPerRow: 5 });
        sendResponse({
          type: "GET_GRID_ITEMS_PER_ROW_RESPONSE",
          value: 5,
        } satisfies GetGridItemsPerRowResponse);
        return true;
      }

      sendResponse({
        type: "GET_GRID_ITEMS_PER_ROW_RESPONSE",
        value: response.preferredGridItemsPerRow,
      } satisfies GetGridItemsPerRowResponse);
      return true; // Indicates that the response will be sent asynchronously
    }

    // Handle message: UPDATE_GRID_ITEMS_PER_ROW
    // ------------------------------------------
    if (message.type === "UPDATE_GRID_ITEMS_PER_ROW") {
      await chrome.storage.sync.set({
        preferredGridItemsPerRow: message.value,
      });
      sendResponse({
        type: "UPDATE_GRID_ITEMS_PER_ROW_RESPONSE",
      } satisfies UpdateGridItemsPerRowResponse);
      return true;
    }
  },
);
