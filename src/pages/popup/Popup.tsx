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
    <div class="h-max w-[400px] bg-neutral-900 p-4 text-base text-white">
      <h1 class="mb-4 text-xl font-bold">YouTube Grid Fix</h1>
      <div class="flex flex-col items-center gap-4">
        <div class="relative mb-6 w-full">
          <label
            for="grid-items-per-row-slider"
            class="mb-2 block text-sm font-medium text-slate-900 dark:text-white"
          >
            Preferred grid items per row:
          </label>
          <input
            id="grid-items-per-row-slider"
            type="range"
            min="1"
            max="6"
            value={preferredGridItemsPerRow()}
            onchange={handleChange}
            class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
          />
          <span class="absolute start-0 -bottom-6 text-sm text-gray-500 dark:text-gray-400">
            1
          </span>
          <span class="absolute start-1/5 -bottom-6 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400">
            2
          </span>
          <span class="absolute start-2/5 -bottom-6 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400">
            3
          </span>
          <span class="absolute start-3/5 -bottom-6 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400">
            4
          </span>
          <span class="absolute start-4/5 -bottom-6 -translate-x-1/2 text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400">
            5
          </span>
          <span class="absolute end-0 -bottom-6 text-sm text-gray-500 dark:text-gray-400">
            6
          </span>
        </div>

        {/* For future reference - maybe use for manual override */}
        {/* <div class="flex items-center gap-2">
          <label for="grid-items-per-row" class="w-max min-w-max text-base">
            Preferred grid items per row:
          </label>
          <input
            class="w-full appearance-none rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            id="grid-items-per-row"
            type="number"
            value={preferredGridItemsPerRow()}
            onchange={handleChange}
          />
        </div> */}
      </div>
    </div>
  );
}
