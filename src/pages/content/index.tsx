import { mainLogger } from "@src/utils/logger";

const logger = mainLogger.getSubLogger({ name: "content.page" });

function main() {
  const $ytRichGridRenderer = document.querySelector("ytd-rich-grid-renderer");

  if (!$ytRichGridRenderer) {
    logger.error("Element yt-rich-grid-renderer not found");
  }
}

main();
