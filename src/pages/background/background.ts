import { mainLogger } from "@src/utils/logger";
import { initStorage } from "./initStorage";

const logger = mainLogger.getSubLogger({ name: "background" });
logger.info("background script loaded");

initStorage();
