import { CLAUDE_ORIGINAL_SELECTORS } from "@/selectors"
import { createRoot } from "react-dom/client"

import { ThinkingBlock } from "@/components/thinking-block"

import { ThinkingBlockRoots } from "../types"
import {
  createThinkingBlockContainer,
  generateBlockId,
  getThinkingBlockElements,
  hideElement,
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
    // Check if block needs reprocessing
    const blockId = block.getAttribute("data-tc-block-id")
    const existingContainer = blockId
      ? document.querySelector(`[data-tc-container-id="${blockId}"]`)
      : null

    // If block was previously processed but container is missing, clean up
    if (blockId && !existingContainer) {
      this.roots[blockId]?.unmount()
      delete this.roots[blockId]
      this.processedBlocks.delete(block)
      block.querySelectorAll("[data-tc-processed]").forEach((el) => {
        el.removeAttribute("data-tc-processed")
        ;(el as HTMLElement).style.display = ""
      })
    }

    // Skip if already processed and container exists
    if (this.processedBlocks.has(block) && existingContainer) return

    // Validate thinking block
    if (!isThinkingBlock(block)) return

    // Get DOM elements
    const { codeContainer, codeContent, mainContainer } =
      getThinkingBlockElements(block)

    if (!codeContainer || !codeContent || !mainContainer) return

    try {
      // Generate or use existing block ID
      const newBlockId = blockId || generateBlockId()

      if (!blockId) {
        block.setAttribute("data-tc-block-id", newBlockId)
      }

      // Create and setup container
      const container = createThinkingBlockContainer(newBlockId)

      // Create React root and render component
      const root = createRoot(container)
      // set root in map
      this.roots[newBlockId] = root

      root.render(
        <ThinkingBlock
          containerRef={block as HTMLElement}
          isStreaming={isStreaming(block)}
        />
      )

      // Insert React component and hide original elements
      mainContainer.insertBefore(container, codeContainer.parentElement)
      this.processedBlocks.add(block)

      // Hide original elements
      const elementsToHide = [
        block.querySelector(CLAUDE_ORIGINAL_SELECTORS.claudeThinkingLabel),
        block.querySelector(CLAUDE_ORIGINAL_SELECTORS.originalCopyBtn),
        codeContainer,
      ]
      elementsToHide.forEach(hideElement)
    } catch (error) {
      console.error("Error mounting thinking block:", error)
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
