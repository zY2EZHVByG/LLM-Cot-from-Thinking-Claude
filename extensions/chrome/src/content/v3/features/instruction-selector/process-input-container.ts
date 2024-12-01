import {
  CLAUDE_INPUT_BUTTONS_CONTAINER,
  CLAUDE_INPUT_CONTAINER,
} from "@/selectors/input-selectors"

import { createSelectRoot } from "./select-root"

let cleanup: (() => void) | null = null
let checkInterval: number | undefined = undefined

export function processInputContainer() {
  const inputContainer = document.querySelector(CLAUDE_INPUT_CONTAINER)
  if (!inputContainer) return

  const hasAttribute = inputContainer.hasAttribute("data-tc-input-container")
  if (hasAttribute) return

  inputContainer.setAttribute("data-tc-input-container", "true")

  const buttonsContainer = document.querySelector(
    CLAUDE_INPUT_BUTTONS_CONTAINER
  )

  if (buttonsContainer) {
    // console.log("[TC] 📝 ~ Found buttons container", buttonsContainer)
    // console.log("[TC] 📝 ~ Current children:", buttonsContainer.children.length)

    // Clear any existing interval
    if (checkInterval !== undefined) {
      clearInterval(checkInterval)
    }

    // Wait for all buttons to be added (model selector, style selector)
    checkInterval = window.setInterval(() => {
      const children = buttonsContainer.children
      console.log("[TC] 📝 ~ Checking children count:", children.length)

      // Wait until we have at least 2 children (model selector, style selector)
      if (children.length >= 2) {
        if (checkInterval !== undefined) {
          clearInterval(checkInterval)
        }
        checkInterval = undefined

        // Clean up previous instance if it exists
        if (cleanup) {
          cleanup()
        }

        // Create new React root
        cleanup = createSelectRoot(buttonsContainer as HTMLElement)
      }
    }, 100) // Check every 100ms
  }
}

// Cleanup function for the feature
export function cleanupSelectDemo() {
  if (cleanup) {
    cleanup()
    cleanup = null
  }
  if (checkInterval !== undefined) {
    clearInterval(checkInterval)
    checkInterval = undefined
  }
}
