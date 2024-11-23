import { selectors } from "@/constants/constants"

import { EventManager } from "./events/event-manager"
import { DOMObserverManager } from "./observer/dom-observer-manager"
import { StyleManager } from "./styles/style-manager"
import { UIComponentManager } from "./ui/ui-component-manager"

/**
 * Manages the thinking process visualization feature in Claude's interface.
 * Coordinates between UI components, DOM observation, events, and styles
 * to create and maintain interactive thinking process blocks.
 */
export class ThinkingBlockManager {
  private domObserver: DOMObserverManager

  /**
   * Initializes the ThinkingBlockManager instance.
   * Injects styles, sets up DOM observation, and adds an event listener for cleanup.
   */
  constructor() {
    StyleManager.injectStyles()
    this.domObserver = new DOMObserverManager(this.processBlock.bind(this))
    this.domObserver.initWithRetry()

    window.addEventListener("unload", () => this.cleanupResources())
  }

  /**
   * Processes a code block element to transform it into an interactive thinking process block.
   * Creates and sets up the toggle button, copy functionality, and container styling.
   * @param pre - The pre element containing the thinking process code
   */
  private processBlock(pre: HTMLElement): void {
    const container = pre.querySelector(selectors.code)?.parentElement
    if (!container) return

    const outerDiv = pre.querySelector(selectors.codeContainer)
    if (!outerDiv) return

    while (outerDiv.firstChild) {
      outerDiv.removeChild(outerDiv.firstChild)
    }

    container.dataset.isOpen = "true"

    const toggleBtn = UIComponentManager.createToggleButton()
    const copyBtn = UIComponentManager.createCopyButton()
    const header = UIComponentManager.createHeader(toggleBtn, copyBtn)

    UIComponentManager.setupContainer(container)

    outerDiv.appendChild(header)
    outerDiv.appendChild(container)

    const updateUIState = (isOpen: boolean) => {
      EventManager.updateUIState(container, toggleBtn, isOpen)
    }

    EventManager.setupToggleButton(toggleBtn, container, updateUIState)
    EventManager.setupCopyButton(
      copyBtn,
      container.querySelector(selectors.code)
    )
  }

  /**
   * Cleans up resources when the component is being destroyed.
   * Disconnects DOM observers and removes event listeners.
   */
  private cleanupResources(): void {
    this.domObserver.cleanupObservers()
  }

  // Add this method to resolve TypeScript error
  init(): void {
    // No additional initialization needed, as constructor handles it
  }
}
