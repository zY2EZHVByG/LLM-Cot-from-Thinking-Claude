import { CLAUDE_ORIGINAL_SELECTORS } from "@/selectors"

import { DOMElements } from "../types"

export const generateBlockId = () =>
  `tc-block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const getThinkingBlockElements = (block: Element): DOMElements => ({
  thinkingLabel: block.querySelector(
    CLAUDE_ORIGINAL_SELECTORS.claudeThinkingLabel
  ),
  codeContainer: block.querySelector(
    CLAUDE_ORIGINAL_SELECTORS.claudeThinkingProcessContentContainer
  ),
  codeContent: block.querySelector(
    CLAUDE_ORIGINAL_SELECTORS.claudeThinkingProcessContent
  ),
  mainContainer: block.querySelector(
    CLAUDE_ORIGINAL_SELECTORS.claudeMainContainer
  ),
})

export const isThinkingBlock = (block: Element): boolean => {
  const { thinkingLabel } = getThinkingBlockElements(block)
  return thinkingLabel?.textContent?.trim().toLowerCase() === "thinking"
}

export const isStreaming = (block: Element): boolean =>
  block
    .closest(CLAUDE_ORIGINAL_SELECTORS.claudeResponseContainer)
    ?.getAttribute("data-is-streaming") === "true"

export const hideElement = (element: Element | null) => {
  if (!element) return
  ;(element as HTMLElement).style.display = "none"
  element.setAttribute("data-tc-processed", "true")
}

export const createThinkingBlockContainer = (
  blockId: string
): HTMLDivElement => {
  const container = document.createElement("div")
  container.className = "tc-thinking-block-container"
  container.setAttribute("data-tc-container-id", blockId)
  return container
}
