/** Sequence of selectors from outside to inside
 * 1. responseContainer: '[data-is-streaming]'
 *    The outermost container div with data-is-streaming attribute, containing the entire Claude response including thinking process, message, and footer. Has gradient background and rounded corners.
 *
 * 2. claudeMessageContainer: '.font-claude-message'
 *    The message container div with specific font styling, containing both thinking process and Claude's response.
 *    Has specific padding and leading styles.
 *
 * 3. thinkingProcessBlock: '.grid.grid-cols-1 pre'
 *    The <pre> element within a grid container, holds the entire thinking process section including header and content.
 *    Has rounded corners and specific styling.
 *
 * 4. thinkingProcessBlockHeaderTitle: '.grid.grid-cols-1 pre .absolute'
 *    The absolute-positioned div containing the text "thinking" in the header.
 *    Located at the top of the thinking process block.
 *
 * 5. thinkingProcessBlockHeaderCopyButton: '.grid.grid-cols-1 pre .sticky.pointer-events-none'
 *    The sticky-positioned div containing the copy button with pointer-events-none.
 *    Located in the header area, includes an SVG icon and "Copy" text.
 *
 * 6. thinkingProcessContentContainer: '.code-block__code'
 *    The div with class "code-block__code" that wraps the thinking process content.
 *    Has specific background color, padding, and code styling properties.
 *
 * 7. thinkingProcessContent: '.code-block__code .language-thinking code'
 *    The innermost <code> element within language-thinking class, containing the actual thinking process text.
 *    Content is wrapped in <span> elements.
 *
 * 8. Additional content structure:
 *    - thinkingContentSpans: Targets the outer spans that contain blocks of text
 *    - thinkingContentTextSpans: Targets the inner spans with the actual thinking process text
 */

export const THINKING_SELECTORS = {
  // Container elements
  responseContainer: "[data-is-streaming]",
  claudeMessageContainer: ".font-claude-message",
  thinkingProcessBlock: ".grid.grid-cols-1 pre",

  // Header elements
  thinkingProcessBlockHeaderTitle: ".grid.grid-cols-1 pre .absolute",
  thinkingProcessBlockHeaderCopyButton:
    ".grid.grid-cols-1 pre .sticky.pointer-events-none",

  // Content elements
  thinkingProcessContentContainer: ".code-block__code",
  thinkingProcessContent: ".code-block__code .language-thinking code",

  // Specific content structure
  thinkingContentSpans: ".language-thinking > span", // Outer spans containing text blocks
  thinkingContentTextSpans: ".language-thinking > span > span", // Inner spans with actual text content
} as const

/** Style properties for the thinking process content */
export const THINKING_CONTENT_STYLES = {
  codeStyle: {
    color: "rgb(171, 178, 191)",
    textShadow: "rgba(0, 0, 0, 0.3) 0px 1px",
    fontFamily:
      '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: 1.5,
    tabSize: 2,
    hyphens: "none",
  },
} as const
