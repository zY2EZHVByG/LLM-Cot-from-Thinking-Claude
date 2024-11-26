export const createMutationObserver = (
  onMutation: () => void,
  delay: number = 100
): MutationObserver => {
  return new MutationObserver((mutations) => {
    let shouldProcess = false

    for (const mutation of mutations) {
      // Check for added nodes
      if (mutation.addedNodes.length > 0) {
        shouldProcess = true
        break
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
        mutation.attributeName === "data-is-streaming"
      ) {
        shouldProcess = true
        break
      }
    }

    if (shouldProcess) {
      setTimeout(onMutation, delay)
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
