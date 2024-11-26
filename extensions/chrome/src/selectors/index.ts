/** Original HTML
<pre>
  <div class="relative flex flex-col rounded-lg">
    <div class="text-text-300...">thinking</div>
    <div class="pointer-events-none...">copy button</div>
    <div>
      <div class="code-block__code...">content</div>
    </div>
  </div>
</pre>
 */

/** Selectors for finding and interacting with Claude's thinking blocks */
export const TC_SELECTORS = {
  // Enhanced elements
  enhancedContainer: "[data-tc-container-id]",
  processedElement: "[data-tc-processed]",
} as const

export const CLAUDE_ORIGINAL_SELECTORS = {
  // Container selectors
  claudeResponseContainer: "[data-is-streaming]",
  // this is the main container for the thinking block directly after the <pre>
  claudeMainContainer: ".relative.flex.flex-col",

  // Core thinking block selectors
  claudeThinkingProcessBlock:
    "pre, .text-text-300, .code-block__code, [class*='text-text-'], [class*='code-block']",
  claudeThinkingLabel: ".text-text-300, [class*='text-text-']",
  claudeThinkingProcessContentContainer:
    ".code-block__code, [class*='code-block']",
  claudeThinkingProcessContent: "code",

  // UI elements
  originalCopyBtn: ".pointer-events-none",
} as const

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
