import { icons, timings } from "@/constants/constants"

/**
 * Manages event handling and UI state updates for thinking process blocks.
 * Handles button click events, copy functionality, and UI state transitions.
 */
export class EventManager {
  /**
   * Sets up the toggle button click handler.
   * @param toggleBtn - The button element that toggles the thinking process visibility
   * @param container - The container element that holds the thinking process content
   * @param updateUIState - Callback function to update the UI state
   */
  static setupToggleButton(
    toggleBtn: HTMLButtonElement,
    container: HTMLElement,
    updateUIState: (isOpen: boolean) => void
  ): void {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      const currentState = container.dataset.isOpen === "true"
      updateUIState(!currentState)
    })
  }

  /**
   * Sets up the copy button functionality.
   * Handles click events, clipboard operations, and feedback animations.
   * @param copyBtn - The button element that triggers the copy operation
   * @param content - The element containing the content to be copied
   */
  static setupCopyButton(
    copyBtn: HTMLButtonElement,
    content: Element | null
  ): void {
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (content && !copyBtn.disabled) {
        copyBtn.disabled = true
        copyBtn.style.opacity = "0.5"
        copyBtn.style.cursor = "default"
        navigator.clipboard.writeText(content.textContent || "")

        const copyBtnText = copyBtn.querySelector("span.text-text-200")
        const copyIcon = copyBtn.querySelector("span:first-child")

        if (copyBtnText) copyBtnText.textContent = "Copied!"
        if (copyIcon) copyIcon.innerHTML = icons.tick

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = "Copy"
          if (copyIcon) copyIcon.innerHTML = icons.copy
          copyBtn.disabled = false
          copyBtn.style.opacity = ""
          copyBtn.style.cursor = ""
        }, timings.copyFeedback)
      }
    })
  }

  /**
   * Updates the UI state of a thinking process block.
   * Handles animations, text changes, and visibility states.
   * @param container - The container element to update
   * @param toggleBtn - The toggle button element to update
   * @param isOpen - Whether the thinking process should be visible
   */
  static updateUIState(
    container: HTMLElement,
    toggleBtn: HTMLButtonElement,
    isOpen: boolean
  ): void {
    container.dataset.isOpen = isOpen.toString()
    const arrow = toggleBtn.querySelector("svg")
    const label = toggleBtn.querySelector("span")

    container.style.maxHeight = isOpen ? "50vh" : "0"
    container.style.opacity = isOpen ? "1" : "0"
    container.style.padding = isOpen ? "1em" : "0"

    if (label) {
      label.textContent = isOpen
        ? "Hide thinking process"
        : "View thinking process"
    }

    if (arrow) {
      arrow.style.transform = `rotate(${isOpen ? 180 : 0}deg)`
    }
  }
}
