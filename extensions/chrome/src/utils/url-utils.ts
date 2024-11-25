export const isChatPage = (url: string): boolean => {
  return url.startsWith("https://claude.ai/chat/")
}

export const shouldInitialize = (url: string): boolean => {
  return isChatPage(url)
}
