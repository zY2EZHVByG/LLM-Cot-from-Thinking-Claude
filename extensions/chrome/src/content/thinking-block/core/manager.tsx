import { CLAUDE_ORIGINAL_SELECTORS } from "@/selectors"
import { createRoot } from "react-dom/client"

import { ThinkingBlock } from "@/components/thinking-block"

import { ThinkingBlockRoots } from "../types"
import {
  createThinkingBlockContainer,
  generateBlockId,
  getThinkingBlockElements,
  isStreaming,
  isThinkingBlock,
} from "../utils/dom"
import { createMutationObserver, observeDOM } from "../utils/observer"

class ThinkingBlockManager {
  private observer: MutationObserver | null = null
  private checkInterval: number | null = null
  private processedBlocks = new Set<Element>()
  private roots: ThinkingBlockRoots = {}

  private processBlock(block: Element) {
    // Skip if the block is already being processed
    if (block.hasAttribute("data-tc-processing")) {
      return
    }

    // Check if block needs reprocessing
    const blockId = block.getAttribute("data-tc-block-id")
    const existingContainer = blockId
      ? document.querySelector(`[data-tc-container-id="${blockId}"]`)
      : null

    // Skip if already processed and container exists
    if (this.processedBlocks.has(block) && existingContainer) {
      return
    }

    // Mark block as being processed
    block.setAttribute("data-tc-processing", "true")

    try {
      // Validate thinking block
      if (!isThinkingBlock(block)) {
        return
      }

      // Get DOM elements
      const { codeContainer, codeContent, mainContainer } =
        getThinkingBlockElements(block)

      if (!codeContainer || !codeContent || !mainContainer) return

      // Generate or use existing block ID
      const newBlockId = blockId || generateBlockId()

      if (!blockId) {
        block.setAttribute("data-tc-block-id", newBlockId)
      }

      // Only create new container and root if they don't exist
      if (!existingContainer) {
        // Create and setup container
        const container = createThinkingBlockContainer(newBlockId)

        // Insert our container at the start of the flex container, before the thinking header
        const thinkingHeader = block.querySelector(
          CLAUDE_ORIGINAL_SELECTORS.claudeThinkingLabel
        )
        thinkingHeader?.parentElement?.insertBefore(container, thinkingHeader)

        // Create React root and render component
        const root = createRoot(container)
        this.roots[newBlockId] = root

        // Mark as processed
        this.processedBlocks.add(block)

        // Render component
        root.render(
          <ThinkingBlock
            containerRef={block as HTMLElement}
            isStreaming={isStreaming(block)}
          />
        )
      }
    } finally {
      // Always remove processing marker
      block.removeAttribute("data-tc-processing")
    }
  }

  private processExistingBlocks = () => {
    const blocks = document.querySelectorAll(
      CLAUDE_ORIGINAL_SELECTORS.claudeThinkingProcessBlock
    )
    blocks.forEach((block) => this.processBlock(block))
  }

  private initWithRetry(retryCount = 0) {
    const maxRetries = 10
    const retryDelay = 1000

    if (retryCount >= maxRetries) return

    const blocks = document.querySelectorAll(
      CLAUDE_ORIGINAL_SELECTORS.claudeThinkingProcessBlock
    )
    if (blocks.length === 0) {
      setTimeout(() => this.initWithRetry(retryCount + 1), retryDelay)
      return
    }

    this.processExistingBlocks()

    // Setup observer if not already setup
    if (!this.observer) {
      this.observer = createMutationObserver(this.processExistingBlocks)
      observeDOM(this.observer)
    }

    // Set up periodic check if not already setup
    if (!this.checkInterval) {
      this.checkInterval = window.setInterval(this.processExistingBlocks, 2000)
    }
  }

  initialize() {
    console.log("Initializing thinking block manager...")
    this.initWithRetry()
  }

  cleanup() {
    this.observer?.disconnect()
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval)
    }
    Object.values(this.roots).forEach((root) => root.unmount())
    this.roots = {}
    this.processedBlocks.clear()
  }
}

// Export singleton instance
export const thinkingBlockManager = new ThinkingBlockManager()
