import React from "react"

import { createRoot, type Root } from "react-dom/client"

import { ThinkingProcess } from "./thinking-process"

// Selectors for finding elements in Claude's DOM
const THINKING_SELECTORS = {
  responseContainer: "[data-is-streaming]",
  thinkingProcessBlock: ".grid.grid-cols-1 pre",
  thinkingProcessContent: ".code-block__code",
} as const

interface MountedComponent {
  root: Root
  streamingObserver?: MutationObserver
  container: HTMLElement
  rootDiv: HTMLElement
}

class ThinkingProcessManager {
  private mountedComponents: Map<HTMLElement, MountedComponent> = new Map()
  private observer: MutationObserver

  constructor() {
    this.observer = new MutationObserver(this.handleDOMChanges.bind(this))
  }

  public startObserving(): void {
    console.log("[Thinking Claude] Starting observation...")
    this.processExistingBlocks()

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  public stopObserving(): void {
    console.log("[Thinking Claude] Stopping observation...")
    this.observer.disconnect()

    // Cleanup all mounted components
    this.mountedComponents.forEach(({ root, streamingObserver, rootDiv }) => {
      streamingObserver?.disconnect()
      root.unmount()
      rootDiv.remove() // Remove the root div from DOM
    })
    this.mountedComponents.clear()
  }

  private processExistingBlocks(): void {
    try {
      const containers = document.querySelectorAll<HTMLElement>(
        THINKING_SELECTORS.thinkingProcessBlock
      )
      containers.forEach(this.mountComponent.bind(this))
    } catch (error) {
      console.error(
        "[Thinking Claude] Error processing existing blocks:",
        error
      )
    }
  }

  private handleDOMChanges(mutations: MutationRecord[]): void {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return

        if (
          node.matches(THINKING_SELECTORS.thinkingProcessBlock) &&
          !this.isOwnRootDiv(node) &&
          !node.querySelector("[data-thinking-process-root]")
        ) {
          this.mountComponent(node)
        }

        // Process child containers
        node
          .querySelectorAll<HTMLElement>(
            THINKING_SELECTORS.thinkingProcessBlock
          )
          .forEach((container) => {
            if (
              !this.isOwnRootDiv(container) &&
              !container.querySelector("[data-thinking-process-root]")
            ) {
              this.mountComponent(container)
            }
          })
      })
    }
  }

  private isOwnRootDiv(element: HTMLElement): boolean {
    // Check if this element is one of our root divs
    return Array.from(this.mountedComponents.values()).some(
      ({ rootDiv }) => rootDiv === element
    )
  }

  private mountComponent(container: HTMLElement): void {
    try {
      // Additional check at the start of mount
      if (
        this.mountedComponents.has(container) ||
        container.querySelector("[data-thinking-process-root]")
      ) {
        return
      }

      // Get streaming state from the closest response container
      const responseContainer = container.closest<HTMLElement>(
        THINKING_SELECTORS.responseContainer
      )
      if (!responseContainer) {
        console.log(
          "[Thinking Claude] No response container found, skipping mount"
        )
        return
      }

      const isStreaming =
        responseContainer.getAttribute("data-is-streaming") === "true"

      // Create root div and append it to container
      const rootDiv = document.createElement("div")
      rootDiv.id = "thinking-claude-root"
      rootDiv.setAttribute("data-thinking-process-root", "true")
      rootDiv.className = "rounded-xl w-full"
      // TODO: REMOVE THE MARGIN RIGHT WHEN WE HAVE A BETTER SOLUTION
      container.appendChild(rootDiv)

      // Create React root
      const root = createRoot(rootDiv)

      // Create streaming observer
      const streamingObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-is-streaming" &&
            mutation.target instanceof HTMLElement
          ) {
            const newIsStreaming =
              mutation.target.getAttribute("data-is-streaming") === "true"
            root.render(
              <ThinkingProcess
                containerRef={container}
                isStreaming={newIsStreaming}
              />
            )
          }
        })
      })

      // Store component info before observing
      this.mountedComponents.set(container, {
        root,
        streamingObserver,
        container,
        rootDiv,
      })

      // Start observing streaming state changes
      streamingObserver.observe(responseContainer, {
        attributes: true,
        attributeFilter: ["data-is-streaming"],
      })

      // Initial render
      root.render(
        <ThinkingProcess containerRef={container} isStreaming={isStreaming} />
      )

      console.log("[Thinking Claude] Mounted component to:", container)
    } catch (error) {
      console.error("[Thinking Claude] Error mounting component:", error)
    }
  }

  private unmountComponent(element: HTMLElement): void {
    try {
      // Check if this element is a mounted container
      const mounted = this.mountedComponents.get(element)
      if (mounted) {
        const { root, streamingObserver, rootDiv } = mounted
        streamingObserver?.disconnect()
        root.unmount()
        rootDiv.remove() // Remove the root div from DOM
        this.mountedComponents.delete(element)
        console.log("[Thinking Claude] Unmounted component from:", element)
        return
      }

      // Check if any mounted components are children of this element
      for (const [container, component] of this.mountedComponents.entries()) {
        if (element.contains(container)) {
          const { root, streamingObserver, rootDiv } = component
          streamingObserver?.disconnect()
          root.unmount()
          rootDiv.remove() // Remove the root div from DOM
          this.mountedComponents.delete(container)
          console.log(
            "[Thinking Claude] Unmounted child component from:",
            container
          )
        }
      }
    } catch (error) {
      console.error("[Thinking Claude] Error unmounting component:", error)
    }
  }
}
export const thinkingProcessManager = new ThinkingProcessManager()
