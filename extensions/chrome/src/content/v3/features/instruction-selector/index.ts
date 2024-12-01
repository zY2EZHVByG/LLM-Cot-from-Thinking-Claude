import type { MutationObserverService } from "@/services/mutation-observer"
import { shouldInitialize } from "@/utils/url-utils"

import { BaseFeature } from "../base-feature"
import {
  cleanupSelectDemo,
  processInputContainer,
} from "./process-input-container"

/**
 * Feature that adds input selection functionality
 */
export class TCInstructionSelector extends BaseFeature {
  /**
   * @param mutationObserver - Service to observe DOM changes for input
   */
  constructor(private mutationObserver: MutationObserverService) {
    super("tc-instruction-selector")
  }

  /**
   * Initialize the input selector feature
   * Sets up mutation observer for input container
   * @returns Cleanup function to unsubscribe from mutation observer and remove custom attributes
   */
  initialize(): void | (() => void) {
    if (!shouldInitialize(window.location.href, "new")) {
      return
    }
    console.log("[TC] 📝 ~ TCInstructionSelector initialized")

    this.mutationObserver.initialize()

    const unsubscribe = this.mutationObserver.subscribe(processInputContainer)

    // Initial check
    processInputContainer()

    return () => {
      unsubscribe()
      // Clean up feature-specific attributes
      document
        .querySelectorAll("[data-tc-input-container]")
        .forEach((el) => el.removeAttribute("data-tc-input-container"))
      cleanupSelectDemo()
    }
  }
}
