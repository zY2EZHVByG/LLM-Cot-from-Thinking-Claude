import "@/styles/globals.css"

import { shouldInitialize } from "@/utils/url-utils"

import { addThinkingBlockToggle } from "./v3/features/thinking-block"

// Only initialize on appropriate pages
if (shouldInitialize(window.location.href)) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addThinkingBlockToggle)
  } else {
    addThinkingBlockToggle()
  }
}
