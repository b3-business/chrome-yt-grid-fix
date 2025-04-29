import { contentLogger } from "./contentLogger";

export function waitOnceForElements(selector: string) {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    return Promise.resolve(Array.from(elements) as HTMLElement[]);
  }

  return new Promise<HTMLElement[]>((resolve, reject) => {
    // Callback function to execute when mutations are observed.
    const mutationObserverCallback = function (mutationsList, observer) {
      let nodesFound = [];

      // Use traditional for loops for performance
      for (let i = 0; i < mutationsList.length; i++) {
        const mutation = mutationsList[i];

        if (mutation.type !== "childList") {
          continue;
        }

        // A child node has been added
        for (let j = 0; j < mutation.addedNodes.length; j++) {
          const addedNode = mutation.addedNodes[j];
          // Check if the added node is an element && matches the selector
          if (addedNode.nodeType === 1 && addedNode.matches(selector)) {
            contentLogger.info(`Element ${selector} was added to the DOM.`);

            nodesFound.push(addedNode);
          }
        }
      }

      if (nodesFound.length > 0) {
        // You've found the element, so you might want to disconnect the observer
        // if you only need to detect the first insertion.
        observer.disconnect();
        resolve(nodesFound);
      }
    };

    // Create an observer instance linked to the callback function.
    const observer = new MutationObserver(mutationObserverCallback);

    // Start observing the target node for configured mutations.
    observer.observe(targetNode, config);

    contentLogger.debug(
      `Waiting for element ${selector} to be added to the DOM...`,
    );
  });
}
