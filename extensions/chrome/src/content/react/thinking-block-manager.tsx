import { createRoot } from "react-dom/client"

import { THINKING_SELECTORS } from "./selectors"
import { ThinkingProcess } from "./thinking-block"

/**
 * Manages the detection and enhancement of thinking process blocks in Claude's responses
 */
class ThinkingBlockManager {
  private observer: MutationObserver | null = null
  private checkInterval: number | null = null
  private processedBlocks = new Set<Element>()
  private roots = new Map<string, ReturnType<typeof createRoot>>()

  /**
   * Process a thinking block element by mounting a React component
   */
  private processBlock(block: Element) {
    // Check if block needs reprocessing
    const blockId = block.getAttribute("data-tc-block-id")
    const existingContainer = blockId
      ? document.querySelector(`[data-tc-container-id="${blockId}"]`)
      : null

    // If block was previously processed but container is missing, clean up
    if (blockId && !existingContainer) {
      this.roots.get(blockId)?.unmount()
      this.roots.delete(blockId)
      this.processedBlocks.delete(block)
      // Remove processed attributes to allow reprocessing
      block.querySelectorAll("[data-tc-processed]").forEach((el) => {
        el.removeAttribute("data-tc-processed")
        ;(el as HTMLElement).style.display = ""
      })
    }

    // Skip if already processed and container exists
    if (this.processedBlocks.has(block) && existingContainer) return

    // Check for thinking label
    const thinkingLabel = block.querySelector(THINKING_SELECTORS.thinkingLabel)
    if (!thinkingLabel || thinkingLabel.textContent?.trim() !== "thinking")
      return

    // Create container for React component
    const container = document.createElement("div")
    container.className = "thinking-block-container"

    // Get code container and content
    const codeContainer = block.querySelector(
      THINKING_SELECTORS.thinkingProcessContentContainer
    )
    const codeContent = block.querySelector(
      THINKING_SELECTORS.thinkingProcessContent
    )
    if (!codeContainer || !codeContent) return

    // Check if block is streaming
    const isStreaming =
      block
        .closest(THINKING_SELECTORS.responseContainer)
        ?.getAttribute("data-is-streaming") === "true"

    // Mount React component
    try {
      // Generate unique ID for the block if it doesn't exist
      const newBlockId =
        blockId ||
        `tc-block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      if (!blockId) {
        block.setAttribute("data-tc-block-id", newBlockId)
      }
      container.setAttribute("data-tc-container-id", newBlockId)

      const root = createRoot(container)
      this.roots.set(newBlockId, root)
      root.render(
        <ThinkingProcess
          containerRef={block as HTMLElement}
          isStreaming={isStreaming}
        />
      )

      // Insert React component
      const mainContainer = block.querySelector(
        THINKING_SELECTORS.mainContainer
      )
      if (mainContainer) {
        mainContainer.insertBefore(container, codeContainer.parentElement)
        this.processedBlocks.add(block)

        // Mark elements as processed
        const elementsToHide = [
          block.querySelector(THINKING_SELECTORS.thinkingLabel),
          block.querySelector(THINKING_SELECTORS.originalCopyBtn),
          codeContainer,
        ]
        elementsToHide.forEach((el) => {
          if (el) {
            ;(el as HTMLElement).style.display = "none"
            el.setAttribute("data-tc-processed", "true")
          }
        })

        console.log("[TC Block] Successfully processed block:", {
          blockId: newBlockId,
          isStreaming,
          hasThinkingLabel: !!block.querySelector(
            THINKING_SELECTORS.thinkingLabel
          ),
          hasCodeContainer: !!codeContainer,
          hasCodeContent: !!codeContent,
          mountPoint: mainContainer.tagName,
          containerClass: container.className,
          timing: {
            processedAt: new Date().toISOString(),
            blockCount: this.processedBlocks.size,
          },
        })
      }
    } catch (error) {
      console.error("Error mounting thinking block:", error)
    }
  }

  /**
   * Process all existing thinking blocks
   */
  private processExistingBlocks = () => {
    const blocks = document.querySelectorAll(
      THINKING_SELECTORS.thinkingProcessBlock
    )
    blocks.forEach((block) => this.processBlock(block))
  }

  /**
   * Set up mutation observer to detect new thinking blocks
   */
  private setupObserver() {
    if (this.observer) return

    this.observer = new MutationObserver((mutations) => {
      let shouldProcess = false
      for (const mutation of mutations) {
        // Check for added nodes
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true
          break
        }
        // Check for removed nodes that might be our containers
        if (mutation.removedNodes.length > 0) {
          for (const node of mutation.removedNodes) {
            if (
              node instanceof Element &&
              node.matches(".thinking-block-container")
            ) {
              shouldProcess = true
              break
            }
          }
        }
        // Check for streaming attribute changes
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-is-streaming"
        ) {
          shouldProcess = true
          break
        }
      }

      if (shouldProcess) {
        setTimeout(this.processExistingBlocks, 100) // Small delay to ensure DOM is ready
      }
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-is-streaming"],
    })
  }

  /**
   * Initialize with retry logic
   */
  private initWithRetry(retryCount = 0) {
    const maxRetries = 10
    const retryDelay = 1000

    if (retryCount >= maxRetries) return

    const blocks = document.querySelectorAll(
      THINKING_SELECTORS.thinkingProcessBlock
    )
    if (blocks.length === 0) {
      setTimeout(() => this.initWithRetry(retryCount + 1), retryDelay)
      return
    }

    this.processExistingBlocks()
    this.setupObserver()

    // Set up periodic check
    if (!this.checkInterval) {
      this.checkInterval = window.setInterval(this.processExistingBlocks, 2000)
    }
  }

  /**
   * Initialize the block manager
   */
  initialize() {
    console.log("Initializing thinking block manager...")
    this.initWithRetry()
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.observer?.disconnect()
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval)
    }
    this.roots.forEach((root) => root.unmount())
    this.roots.clear()
    this.processedBlocks.clear()
  }
}

// Export a singleton instance
const thinkingBlockManager = new ThinkingBlockManager()
export { thinkingBlockManager }
