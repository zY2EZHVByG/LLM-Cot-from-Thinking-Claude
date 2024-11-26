import { icons, selectors, styles } from "@/constants/constants"

/**
 * Manages the creation and styling of UI components for thinking process blocks.
 * Provides factory methods for creating buttons, headers, and containers with consistent styling.
 */
export class UIComponentManager {
  /**
   * Creates a DOM element with optional class name and inner HTML.
   * @param tag - The HTML tag name for the element
   * @param className - Optional CSS class names to add
   * @param innerHTML - Optional inner HTML content
   * @returns The created HTML element
   */
  static createElement(
    tag: string,
    className: string = "",
    innerHTML: string = ""
  ): HTMLElement {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (innerHTML) element.innerHTML = innerHTML
    return element
  }

  /**
   * Creates a toggle button for showing/hiding thinking process content.
   * @param isStreaming - Whether Claude is currently streaming a response
   * @returns A styled button element with appropriate text and icon
   */
  static createToggleButton(isStreaming = false): HTMLButtonElement {
    const button = this.createElement(
      "button",
      "flex items-center text-text-500 hover:text-text-300"
    )
    const labelText = isStreaming
      ? "Claude is Thinking..."
      : "Hide thinking process"
    button.innerHTML = `
      ${icons.arrow}
      <span class="${styles.labelClass}${
        isStreaming ? " thinking-animation" : ""
      }">${labelText}</span>
    `
    return button as HTMLButtonElement
  }

  /**
   * Creates a copy button with appropriate styling and icon.
   * @returns A styled button element for copying content
   */
  static createCopyButton(): HTMLButtonElement {
    const copyBtnContainer = this.createElement(
      "div",
      "from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md"
    )

    const copyBtn = this.createElement(
      "button",
      "flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 hover:bg-bg-200 opacity-60 hover:opacity-100"
    ) as HTMLButtonElement

    const copyIcon = this.createElement("span", "", icons.copy)
    const copyBtnText = this.createElement(
      "span",
      "text-text-200 pr-0.5",
      "Copy"
    )

    copyBtn.appendChild(copyIcon)
    copyBtn.appendChild(copyBtnText)
    copyBtnContainer.appendChild(copyBtn)

    return copyBtn
  }

  /**
   * Creates a header element containing toggle and copy buttons.
   * @param toggleBtn - The toggle button element
   * @param copyBtn - The copy button element
   * @returns A styled header element containing the buttons
   */
  static createHeader(
    toggleBtn: HTMLButtonElement,
    copyBtn: HTMLButtonElement
  ): HTMLElement {
    const header = this.createElement("div", "thinking-header", "")
    header.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-300);"

    header.appendChild(toggleBtn)
    header.appendChild(copyBtn.parentElement!)

    return header
  }

  /**
   * Sets up the container element with appropriate styling and classes.
   * @param container - The container element to style
   */
  static setupContainer(container: HTMLElement): void {
    container.className =
      "code-block__code !my-0 !rounded-lg !text-sm !leading-relaxed"
    container.style.cssText =
      "transition: 0.3s ease-in-out; overflow: hidden auto; max-height: 50vh; opacity: 1; padding: 1em; max-width: 100%; display: block;"

    const content = container.querySelector(selectors.code)
    if (content instanceof HTMLElement) {
      content.style.cssText =
        "white-space: pre-wrap !important; word-break: break-word !important; overflow-wrap: break-word !important; display: block !important; max-width: 100% !important;"
    }
  }
}
