export interface Selectors {
  pre: string
  thinkingProcess: string
  messageContainer: string
  thinkingLabel: string
  codeContainer: string
  code: string
}

export interface Timings {
  retryDelay: number
  mutationDelay: number
  checkInterval: number
  copyFeedback: number
  maxRetries: number
}

export interface Icons {
  arrow: string
  tick: string
  copy: string
}

export interface Styles {
  animation: string
  buttonClass: string
  labelClass: string
}
