import { CLAUDE_ORIGINAL_SELECTORS } from "."

// Helper function to check if element is a thinking block
export const isThinkingBlock = (
  element: Element | null
): element is HTMLDivElement => {
  if (!element || !(element instanceof HTMLDivElement)) {
    return false
  }

  // First check if the element itself is a thinking label or code container
  if (
    element.matches(CLAUDE_ORIGINAL_SELECTORS.claudeThinkingLabel) ||
    element.matches(CLAUDE_ORIGINAL_SELECTORS.claudeThinkingProcessContent)
  ) {
    return true
  }

  // Then check for child elements
  const hasThinkingLabel = !!element.querySelector(
    CLAUDE_ORIGINAL_SELECTORS.claudeThinkingLabel
  )
  const hasCodeContainer = !!element.querySelector(
    CLAUDE_ORIGINAL_SELECTORS.claudeThinkingProcessContentContainer
  )

  return hasThinkingLabel || hasCodeContainer
}
