import { bgLogger } from "./bgLogger";

export function initStorage() {
  const defaultOptions = {
    preferredGridItemsPerRow: 5,
  };

  chrome.storage.sync.get(Object.keys(defaultOptions)).then((response) => {
    if (!response.preferredGridItemsPerRow) {
      chrome.storage.sync.set({ preferredGridItemsPerRow: 5 });
      bgLogger.info(
        "Initialized preferredGridItemsPerRow with",
        defaultOptions.preferredGridItemsPerRow,
      );
    }
  });
}
