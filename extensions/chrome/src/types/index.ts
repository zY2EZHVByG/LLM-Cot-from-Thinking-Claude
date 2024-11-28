/**
 * Base interface for all features
 */
export interface Feature {
  id: string
  initialize(): void | (() => void) // Return cleanup function if needed
}
