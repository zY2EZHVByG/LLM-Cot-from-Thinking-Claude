import {
  ANIMATION_STYLES,
  CLASSES,
  ICONS,
  SELECTORS,
  TIMINGS,
} from "./constants"

// Initial style injection - runs immediately
const initialStyles = document.createElement("style")
initialStyles.id = "thinking-initial-styles"
initialStyles.textContent = `
  ${SELECTORS.PRE} {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
`
document.documentElement.appendChild(initialStyles)

class CodeBlockCollapser {
  private observers: Set<MutationObserver>
  static instance: CodeBlockCollapser | null = null

  static getInstance(): CodeBlockCollapser {
    if (!CodeBlockCollapser.instance) {
      CodeBlockCollapser.instance = new CodeBlockCollapser()
    }
    return CodeBlockCollapser.instance
  }

  private constructor() {
    this.observers = new Set()
    this.injectStyles()
    this.initWithRetry()

    window.addEventListener("unload", () => this.cleanup())
  }

  private injectStyles() {
    // Remove initial hiding style
    const initialStyle = document.getElementById("thinking-initial-styles")
    if (initialStyle) {
      initialStyle.remove()
    }

    // Inject permanent styles
    if (!document.getElementById("thinking-styles")) {
      const styleSheet = document.createElement("style")
      styleSheet.id = "thinking-styles"
      styleSheet.textContent = `
        ${ANIMATION_STYLES}
        ${SELECTORS.PRE} {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
      `
      document.head.appendChild(styleSheet)
    }
  }

  createElement(
    tag: string,
    className: string = "",
    innerHTML: string = ""
  ): HTMLElement {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (innerHTML) element.innerHTML = innerHTML
    return element
  }

  createCopyButton() {
    const container = this.createElement("div", CLASSES.COPY_CONTAINER)
    const button = this.createElement("button", CLASSES.COPY_BUTTON)
    const iconSpan = this.createElement("span", "", ICONS.COPY)
    const textSpan = this.createElement("span", CLASSES.COPY_TEXT, "Copy")

    button.append(iconSpan, textSpan)
    container.appendChild(button)

    button.addEventListener("click", () => {
      const preElement = button.closest<HTMLPreElement>(SELECTORS.PRE)
      const codeElement = preElement?.querySelector<HTMLElement>(SELECTORS.CODE)
      const codeText = codeElement?.textContent

      if (!codeText) return

      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          iconSpan.innerHTML = ICONS.TICK
          textSpan.textContent = "Copied!"

          setTimeout(() => {
            iconSpan.innerHTML = ICONS.COPY
            textSpan.textContent = "Copy"
          }, TIMINGS.COPY_FEEDBACK)
        })
        .catch((error) => {
          console.error("Failed to copy:", error)
        })
    })

    return container
  }

  createToggleButton(isStreaming: boolean = false) {
    const button = this.createElement("button", CLASSES.TOGGLE_BUTTON)
    const labelText = isStreaming
      ? "Claude is thinking..."
      : "View thinking process"
    button.innerHTML = `
        ${ICONS.ARROW}
        <span class="${CLASSES.TOGGLE_LABEL}${
          isStreaming ? ` ${CLASSES.THINKING_ANIMATION}` : ""
        }">${labelText}</span>
      `
    return button
  }

  updateHeaderState(headerContainer: HTMLElement, isStreaming: boolean) {
    const toggleBtn = headerContainer.querySelector<HTMLButtonElement>(
      `.${CLASSES.TOGGLE_BUTTON}`
    )
    if (!toggleBtn) return

    const label = toggleBtn.querySelector<HTMLSpanElement>("span")
    if (!label) return

    label.textContent = isStreaming
      ? "Claude is thinking..."
      : "View thinking process"

    if (isStreaming) {
      label.classList.add(CLASSES.THINKING_ANIMATION)
    } else {
      label.classList.remove(CLASSES.THINKING_ANIMATION)
    }
  }

  setupCodeContainer(container: HTMLElement, toggleBtn: HTMLElement) {
    if (!container) return

    container.style.cssText = `
        background: var(--bg-300);
        transition: all 0.3s ease-in-out;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1em;
        max-width: 100%;
        display: block;
        max-height: 50vh;
        opacity: 1;
      `

    const codeElement = container.querySelector<HTMLElement>(SELECTORS.CODE)
    if (!codeElement) return

    codeElement.style.cssText = `
          white-space: pre-wrap !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          display: block !important;
          max-width: 100% !important;
        `

    const arrow = toggleBtn.querySelector<SVGElement>("svg")
    const label = toggleBtn.querySelector<HTMLSpanElement>("span")
    if (!arrow || !label) return

    // Set initial state to open
    arrow.style.transform = "rotate(180deg)"
    if (!label.classList.contains(CLASSES.THINKING_ANIMATION)) {
      label.textContent = "Hide thinking process"
    }

    toggleBtn.addEventListener("click", () => {
      const shouldToggleOpen = container.style.maxHeight === "0px"
      container.style.maxHeight = shouldToggleOpen ? "50vh" : "0"
      container.style.opacity = shouldToggleOpen ? "1" : "0"
      container.style.padding = shouldToggleOpen ? "1em" : "0"

      arrow.style.transform = `rotate(${shouldToggleOpen ? 180 : 0}deg)`
      if (!label.classList.contains(CLASSES.THINKING_ANIMATION)) {
        label.textContent = shouldToggleOpen
          ? "Hide thinking process"
          : "View thinking process"
      }
    })
  }

  processBlock(pre: HTMLElement) {
    const headerContainer = this.createElement("div", CLASSES.THINKING_HEADER)
    headerContainer.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-300);"

    const isStreaming = pre.closest('[data-is-streaming="true"]') !== null
    const toggleBtn = this.createToggleButton(isStreaming)
    const copyBtn = this.createCopyButton()

    headerContainer.append(toggleBtn, copyBtn)

    const codeContainer = pre.querySelector<HTMLElement>(
      SELECTORS.CODE_CONTAINER
    )
    if (!codeContainer) return
    this.setupCodeContainer(codeContainer, toggleBtn)

    const mainContainer = pre.querySelector<HTMLElement>(
      SELECTORS.MAIN_CONTAINER
    )
    if (!mainContainer) return

    const codeParentElement = pre.querySelector<HTMLElement>(
      SELECTORS.CODE_CONTAINER
    )?.parentElement
    if (!codeParentElement) return

    mainContainer.insertBefore(headerContainer, codeParentElement)

    const streamingContainer = pre.closest("[data-is-streaming]")
    if (streamingContainer) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-is-streaming"
          ) {
            const isStreamingNow =
              streamingContainer.getAttribute("data-is-streaming") === "true"
            this.updateHeaderState(headerContainer, isStreamingNow)
          }
        }
      })

      observer.observe(streamingContainer, {
        attributes: true,
        attributeFilter: ["data-is-streaming"],
      })

      this.observers.add(observer)

      new MutationObserver(() => {
        if (!document.contains(streamingContainer)) {
          observer.disconnect()
          this.observers.delete(observer)
        }
      }).observe(document.body, { childList: true, subtree: true })
    }

    for (const selector of [
      SELECTORS.THINKING_LABEL,
      SELECTORS.ORIGINAL_COPY_BTN,
    ]) {
      const element = pre.querySelector(selector) as HTMLElement | null
      if (element) element.style.display = "none"
    }
  }

  processExistingBlocks(): void {
    for (const pre of document.querySelectorAll<HTMLElement>(SELECTORS.PRE)) {
      const header = pre.querySelector<HTMLElement>(SELECTORS.THINKING_LABEL)
      if (!header?.textContent) continue

      if (
        header.textContent.trim() === "thinking" &&
        !pre.querySelector(`.${CLASSES.THINKING_HEADER}`)
      ) {
        this.processBlock(pre)
      }
    }
  }

  initWithRetry(retryCount: number = 0) {
    if (retryCount >= TIMINGS.MAX_RETRIES) return

    const blocks = document.querySelectorAll(SELECTORS.PRE)
    if (blocks.length === 0) {
      setTimeout(() => this.initWithRetry(retryCount + 1), TIMINGS.RETRY_DELAY)
      return
    }

    this.processExistingBlocks()
    this.setupObserver()
    this.setupPeriodicCheck()
  }

  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false
      for (const mutation of mutations) {
        if (
          mutation.addedNodes.length > 0 ||
          (mutation.type === "attributes" &&
            mutation.attributeName === "data-is-streaming")
        ) {
          shouldProcess = true
        }
      }

      if (shouldProcess) {
        this.processExistingBlocks()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-is-streaming"],
    })

    this.observers.add(observer)
  }

  setupPeriodicCheck(): void {
    setInterval(() => {
      this.processExistingBlocks()
    }, TIMINGS.CHECK_INTERVAL)
  }

  cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
  }
}

declare global {
  interface Window {
    codeBlockCollapser?: CodeBlockCollapser
  }
}

CodeBlockCollapser.getInstance()

document.addEventListener("DOMContentLoaded", () => {
  if (!window.codeBlockCollapser) {
    window.codeBlockCollapser = CodeBlockCollapser.getInstance()
  }
})
