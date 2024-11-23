import { styles } from "@/constants/constants"

/**
 * Manages the injection and removal of styles for thinking process blocks.
 * Handles animation styles and ensures they are only injected once.
 */
export class StyleManager {
  /**
   * Injects the required styles for thinking process animations into the document head.
   * Checks if styles are already present to avoid duplicate injection.
   */
  static injectStyles(): void {
    if (!document.getElementById("thinking-animation-styles")) {
      const styleSheet = document.createElement("style")
      styleSheet.id = "thinking-animation-styles"
      styleSheet.textContent = styles.animation
      document.head.appendChild(styleSheet)
    }
  }
}
