type ObserverCallback = () => void

class MutationObserverService {
  private observer: MutationObserver | null = null
  private callbacks: Set<ObserverCallback> = new Set()
  private timeouts: Map<ObserverCallback, NodeJS.Timeout> = new Map()
  private isProcessing = false

  initialize() {
    if (this.observer) return

    this.observer = new MutationObserver(() => {
      if (this.isProcessing) return

      this.isProcessing = true
      this.callbacks.forEach((callback) => {
        const existingTimeout = this.timeouts.get(callback)
        if (existingTimeout) {
          clearTimeout(existingTimeout)
        }

        const timeout = setTimeout(() => {
          callback()
          this.isProcessing = false
        }, 200) // Slightly increased debounce time

        this.timeouts.set(callback, timeout)
      })
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  subscribe(callback: ObserverCallback) {
    this.callbacks.add(callback)
    return () => this.unsubscribe(callback)
  }

  private unsubscribe(callback: ObserverCallback) {
    this.callbacks.delete(callback)
    const timeout = this.timeouts.get(callback)
    if (timeout) {
      clearTimeout(timeout)
      this.timeouts.delete(callback)
    }
  }
}

export const mutationObserver = new MutationObserverService()
