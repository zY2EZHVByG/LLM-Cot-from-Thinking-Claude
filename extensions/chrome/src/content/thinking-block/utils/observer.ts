import { CLAUDE_ORIGINAL_SELECTORS } from "@/selectors"

export const createMutationObserver = (
  onMutation: () => void,
  delay: number = 100
): MutationObserver => {
  console.log("[Observer] Creating new mutation observer")
  let processingTimeout: NodeJS.Timeout | null = null

  return new MutationObserver((mutations) => {
    let shouldProcess = false

    // Clear any pending processing
    if (processingTimeout) {
      clearTimeout(processingTimeout)
    }

    for (const mutation of mutations) {
      // Skip mutations caused by our own changes
      if (
        mutation.target instanceof Element &&
        mutation.target.closest(".tc-thinking-block-container")
      ) {
        continue
      }

      // Check for added nodes that might contain streaming content
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (
            node instanceof Element &&
            node.closest(".tc-thinking-block-container")
          ) {
            continue
          }

          // If this is a text node or element with text content in a streaming container
          if (
            node.textContent &&
            node instanceof Element &&
            node
              .closest(CLAUDE_ORIGINAL_SELECTORS.claudeResponseContainer)
              ?.getAttribute("data-is-streaming") === "true"
          ) {
            shouldProcess = true
            console.log("[Observer] Streaming content update detected")
            break
          }
        }
      }

      // Check for removed nodes that might be our containers
      if (mutation.removedNodes.length > 0) {
        for (const node of mutation.removedNodes) {
          if (
            node instanceof Element &&
            node.matches(".tc-thinking-block-container")
          ) {
            shouldProcess = true
            break
          }
        }
      }

      // Check for streaming attribute changes
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-is-streaming" &&
        mutation.target instanceof Element &&
        !mutation.target.closest(".tc-thinking-block-container")
      ) {
        shouldProcess = true
        console.log("[Observer] Streaming state change detected")
        break
      }
    }

    if (shouldProcess) {
      // Debounce processing
      processingTimeout = setTimeout(onMutation, delay)
    }
  })
}

export const observeDOM = (observer: MutationObserver): void => {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-is-streaming"],
  })
}
