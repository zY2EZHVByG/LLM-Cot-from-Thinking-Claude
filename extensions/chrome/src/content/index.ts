import "@/styles/globals.css"

import { shouldInitialize } from "@/utils/url-utils"

import { thinkingProcessManager } from "./react/thinking-process-manager"

const initializeExtension = async () => {
  console.log("[Thinking Claude] Initializing extension...")

  // Skip initialization for unsupported pages
  if (!shouldInitialize(window.location.href)) {
    console.log(
      "[Thinking Claude] Skipping initialization for unsupported page"
    )
    return
  }

  // Inject minimal CSS for FOUC prevention and original element hiding
  const style = document.createElement("style")
  style.textContent = `
    /* Hide visual elements of original thinking block when our component is loaded */
    .grid.grid-cols-1 pre > div:first-child:has(+ div[data-thinking-process-root]) {
      position: absolute !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -1 !important;
      /* Keep the element in DOM but visually hidden */
      clip: rect(0 0 0 0) !important;
      clip-path: inset(50%) !important;
      height: 1px !important;
      width: 1px !important;
      margin: -1px !important;
      overflow: hidden !important;
    }

    /* Hide unenhanced elements to prevent FOUC */
    .grid.grid-cols-1 pre .absolute:not([data-extension-loaded="true"]),
    .code-block__code:not([data-extension-loaded="true"]) {
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
    }

    /* Shimmer animation for streaming state */
    @keyframes gradientWave {
      0% { background-position: 200% 50%; }
      100% { background-position: -200% 50%; }
    }

    /* Ensure code block has proper styling */
    .grid.grid-cols-1 pre {
      margin: 0 !important;
      padding: 0 !important;
      background: none !important;
    }
  `
  document.head.appendChild(style)

  // Start observing thinking process blocks
  thinkingProcessManager.startObserving()
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension)
} else {
  initializeExtension()
}

// Cleanup when extension is disabled or removed
window.addEventListener("unload", () => {
  thinkingProcessManager.stopObserving()
})
