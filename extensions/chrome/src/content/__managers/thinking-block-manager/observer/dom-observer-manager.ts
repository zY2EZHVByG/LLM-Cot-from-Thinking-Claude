import { timings } from "@/constants/constants"

/**
 * Manages DOM observation for thinking process blocks.
 * Watches for new code blocks being added to the page and triggers processing.
 * Also performs periodic checks for any blocks that might have been missed.
 */
export class DOMObserverManager {
  private observers: Set<MutationObserver>
  private processBlock: (pre: HTMLElement) => void

  /**
   * Creates a new DOMObserverManager instance.
   * @param processBlock - Callback function to process newly found code blocks
   */
  constructor(processBlock: (pre: HTMLElement) => void) {
    this.observers = new Set()
    this.processBlock = processBlock
  }

  /**
   * Initializes the DOM observer with retry capability.
   * Will attempt to retry setup if it fails, up to a maximum number of retries.
   * @param retryCount - Current number of retry attempts
   */
  initWithRetry(retryCount = 0): void {
    try {
      this.setupObserver()
    } catch (error) {
      console.error(error)
      if (retryCount < timings.maxRetries) {
        setTimeout(() => this.initWithRetry(retryCount + 1), timings.retryDelay)
      }
    }
  }

  /**
   * Cleans up all observers by disconnecting them and clearing the set.
   */
  cleanupObservers(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
  }

  /**
   * Sets up the mutation observer to watch for DOM changes.
   * Observes the entire document body for added nodes that might contain code blocks.
   */
  private setupObserver(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const pre = node.matches("pre") ? node : node.querySelector("pre")
            if (pre) {
              setTimeout(() => this.processBlock(pre), timings.mutationDelay)
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    this.observers.add(observer)
    this.setupPeriodicBlockCheck()
  }

  /**
   * Sets up periodic checking for code blocks that might have been missed.
   * Runs at regular intervals defined in timing configuration.
   */
  private setupPeriodicBlockCheck(): void {
    setInterval(() => {
      document.querySelectorAll("pre").forEach((pre) => {
        if (!pre.querySelector(".thinking-header")) {
          this.processBlock(pre as HTMLElement)
        }
      })
    }, timings.checkInterval)
  }
}
