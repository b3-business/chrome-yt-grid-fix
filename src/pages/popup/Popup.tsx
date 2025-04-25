import "@src/styles/tailwind.css";
import { createResource } from "solid-js";
import { popupLogger } from "./popupLogger";

export function PopupPage() {
  const [preferredGridItemsPerRow, { mutate, refetch }] = createResource(
    async () => {
      const storageResponse = await chrome.storage.sync.get({
        preferredGridItemsPerRow: 5,
      });
      popupLogger.debug(
        `Got preferred grid items per row: ${storageResponse.preferredGridItemsPerRow}`,
      );
      return storageResponse.preferredGridItemsPerRow;
    },
  );

  const handleChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    chrome.storage.sync.set({
      preferredGridItemsPerRow: value,
    });
    popupLogger.debug(`Set preferred grid items per row: ${value}`);
    mutate(value);
  };

  return (
    <div class="h-[200px] w-[400px] bg-neutral-900 p-4 text-base text-white">
      <h1 class="mb-4 text-xl font-bold">YouTube Grid Fix</h1>
      <div class="flex items-center">
        <label for="grid-items-per-row" class="mr-2 w-max min-w-max text-base">
          Preferred grid items per row:
        </label>
        <input
          class="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          id="grid-items-per-row"
          type="number"
          value={preferredGridItemsPerRow()}
          onchange={handleChange}
        />
      </div>
    </div>
  );
}
