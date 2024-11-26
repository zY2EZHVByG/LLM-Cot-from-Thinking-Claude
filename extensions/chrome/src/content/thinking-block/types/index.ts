import { Root } from "react-dom/client"

export interface ThinkingBlockState {
  isStreaming: boolean
  blockId: string
}

export interface ProcessedBlock {
  element: Element
  state: ThinkingBlockState
}

export interface ThinkingBlockRoots {
  [key: string]: Root
}

export interface DOMElements {
  thinkingLabel: Element | null
  codeContainer: Element | null
  codeContent: Element | null
  mainContainer: Element | null
}
