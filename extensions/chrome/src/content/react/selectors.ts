/** Sequence of selectors from outside to inside
 * 1. responseContainer: '[data-is-streaming]'
 *    The outermost container div with data-is-streaming attribute, containing the entire Claude response including thinking process, message, and footer. Has gradient background and rounded corners.
 *
 * 2. thinkingProcessBlock: 'pre, .text-text-300, .code-block__code'
 *    The <pre> element, holds the entire thinking process section including header and content.
 *    Has rounded corners and specific styling.
 *
 * 3. thinkingLabel: '.text-text-300'
 *    The div containing the text label for the thinking process.
 *    Located at the top of the thinking process block.
 *
 * 4. thinkingProcessContentContainer: '.code-block__code'
 *    The div with class "code-block__code" that wraps the thinking process content.
 *    Has specific background color, padding, and code styling properties.
 *
 * 5. thinkingProcessContent: 'code'
 *    The innermost <code> element, containing the actual thinking process text.
 *    Content is wrapped in <span> elements.
 *
 * 6. mainContainer: '.relative.flex.flex-col'
 *    The main container div with specific styling and layout.
 *
 * 7. originalCopyBtn: '.pointer-events-none'
 *    The copy button with pointer-events-none.
 *    Located in the header area, includes an SVG icon and "Copy" text.
 *
 * 8. enhancedContainer: '[data-tc-container-id]'
 *    The container element with data-tc-container-id attribute.
 *
 * 9. processedElement: '[data-tc-processed]'
 *    The element with data-tc-processed attribute.
 */

/** Selectors for finding and interacting with Claude's thinking blocks */
export const THINKING_SELECTORS = {
  // Container selectors
  responseContainer: "[data-is-streaming]",
  mainContainer: ".relative.flex.flex-col",

  // Core thinking block selectors
  thinkingProcessBlock:
    "pre, .text-text-300, .code-block__code, [class*='text-text-'], [class*='code-block']",
  thinkingLabel: ".text-text-300, [class*='text-text-']",
  thinkingProcessContentContainer: ".code-block__code, [class*='code-block']",
  thinkingProcessContent: "code",

  // UI elements
  originalCopyBtn: ".pointer-events-none",

  // Enhanced elements
  enhancedContainer: "[data-tc-container-id]",
  processedElement: "[data-tc-processed]",
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
    element.matches(THINKING_SELECTORS.thinkingLabel) ||
    element.matches(THINKING_SELECTORS.thinkingProcessContentContainer)
  ) {
    return true
  }

  // Then check for child elements
  const hasThinkingLabel = !!element.querySelector(
    THINKING_SELECTORS.thinkingLabel
  )
  const hasCodeContainer = !!element.querySelector(
    THINKING_SELECTORS.thinkingProcessContentContainer
  )

  return hasThinkingLabel || hasCodeContainer
}
