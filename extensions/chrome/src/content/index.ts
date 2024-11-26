import "@/styles/globals.css"

import { shouldInitialize } from "@/utils/url-utils"

import { thinkingBlockManager } from "./thinking-block"

const initializeExtension = async () => {
  console.log("[Thinking Claude] Starting extension initialization...")

  // Skip initialization for unsupported pages
  if (!shouldInitialize(window.location.href)) {
    console.log(
      "[Thinking Claude] Skipping initialization for unsupported page"
    )
    return
  }

  console.log("[Thinking Claude] Page supported, continuing initialization")

  // Immediately inject initial CSS to prevent FOUC
  const initialStyle = document.createElement("style")
  initialStyle.id = "tc-initial-styles"
  initialStyle.textContent = `
    /* Initially hide all thinking blocks with transition */
    pre > div:first-child {
      opacity: 0;
      transition: opacity 0.2s ease-in;
    }
  `
  document.head.appendChild(initialStyle)

  // Add a small delay to ensure DOM is fully loaded
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Inject main CSS for enhanced UI
  const style = document.createElement("style")
  style.textContent = `
    /* Only hide elements that have our enhanced version */
    pre > div:first-child:has(+ div.tc-thinking-block-container) {
      position: absolute !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -1 !important;
      clip: rect(0 0 0 0) !important;
      clip-path: inset(50%) !important;
      height: 1px !important;
      width: 1px !important;
      margin: -1px !important;
      overflow: hidden !important;
    }

    /* Only hide elements after we've processed them */
    pre .text-text-300[data-tc-processed="true"],
    .code-block__code[data-tc-processed="true"] {
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
    pre {
      background: none !important;
    }
  `
  document.head.appendChild(style)
  console.log("[Thinking Claude] Injected CSS styles")

  // Initialize block manager
  console.log("[Thinking Claude] Starting block manager initialization...")
  thinkingBlockManager.initialize()

  // Remove initial styles after successful initialization
  setTimeout(() => {
    const initialStyles = document.getElementById("tc-initial-styles")
    if (initialStyles) {
      // Fade blocks back in if our enhanced UI failed to mount
      initialStyles.textContent = `
        pre > div:first-child:not(:has(+ div.tc-thinking-block-container)) {
          opacity: 1;
          transition: opacity 0.2s ease-out;
        }
      `
      // Remove initial styles after transition
      setTimeout(() => initialStyles.remove(), 250)
    }
  }, 500)

  // Add cleanup on unload
  window.addEventListener("unload", () => {
    thinkingBlockManager.cleanup()
    document.getElementById("tc-initial-styles")?.remove()
  })
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  console.log(
    "[Thinking Claude] Document loading, waiting for DOMContentLoaded"
  )
  document.addEventListener("DOMContentLoaded", initializeExtension)
} else {
  console.log(
    "[Thinking Claude] Document already loaded, initializing immediately"
  )
  initializeExtension()
}

// Cleanup on unload
window.addEventListener("unload", () => {
  console.log("[Thinking Claude] Extension unloading, starting cleanup...")
})
