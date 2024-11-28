import { MutationObserverService } from "@/services/mutation-observer"
import { shouldInitialize } from "@/utils/url-utils"

import { TCThinkingBlock } from "../features/thinking-block"
import { FeatureManager } from "./feature-manager"

/**
 * Manages the lifecycle and coordination of all extension features and services
 */
export class ExtensionManager {
  private featureManager: FeatureManager
  private mutationObserver: MutationObserverService

  constructor() {
    this.mutationObserver = new MutationObserverService()
    this.featureManager = new FeatureManager()

    this.registerFeatures()
    this.setupNavigationListener()
  }

  /**
   * Register all extension features
   */
  private registerFeatures(): void {
    // Register features with their required services
    this.featureManager.register(new TCThinkingBlock(this.mutationObserver))
    // Add more features here
  }

  /**
   * Initialize the extension if conditions are met
   */
  initialize(): void {
    if (!shouldInitialize(window.location.href)) {
      return
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.featureManager.initialize()
      })
    } else {
      this.featureManager.initialize()
    }
  }

  /**
   * Set up listener for navigation events
   */
  private setupNavigationListener(): void {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "NAVIGATION") {
        this.featureManager.cleanup()
      }
    })
  }

  /**
   * Clean up all features and services
   */
  cleanup(): void {
    this.featureManager.cleanup()
  }
}
