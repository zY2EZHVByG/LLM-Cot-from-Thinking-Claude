import { ThinkingBlockManager } from "./managers/thinking-block-manager"

/**
 * Check if current URL matches Claude chat pattern
 */
const isChatURL = (): boolean => {
  const url = window.location.href
  return url.startsWith("https://claude.ai/chat/")
}

/**
 * Initialize the extension only on Claude chat pages
 */
const init = (): void => {
  if (!isChatURL()) return

  const manager = new ThinkingBlockManager()
  manager.init()
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
