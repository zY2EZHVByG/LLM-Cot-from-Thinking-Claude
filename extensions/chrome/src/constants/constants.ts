import { Icons, Selectors, Styles, Timings } from "@/types"

export const selectors: Selectors = {
  // Using data attribute for message container
  messageContainer: "[data-is-streaming]",

  // Using combination of class and content for thinking label
  thinkingLabel: 'div.text-xs:has(text="thinking")',

  // Using class and language attribute for code block
  code: 'code[class*="language-thinking"]',

  // Using specific class combinations and structure
  codeContainer: ".relative.flex.flex-col.rounded-lg",

  // Using specific pre within grid structure
  pre: ".grid-cols-1.grid > pre",

  // Using specific class and container structure
  thinkingProcess: '.code-block__code:has(>code[class*="language-thinking"])',
}

export const timings: Timings = {
  retryDelay: 1000,
  mutationDelay: 100,
  checkInterval: 2000,
  copyFeedback: 2000,
  maxRetries: 10,
}

export const icons: Icons = {
  arrow: `<svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256" style="transition: transform 0.3s ease-in-out; margin-right: 8px;"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  tick: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg>`,
}

export const styles: Styles = {
  animation: `
    @keyframes gradientWave {
      0% { background-position: 200% 50%; }
      100% { background-position: -200% 50%; }
    }
    
    .thinking-animation {
      background: linear-gradient(
        90deg,
        rgba(156, 163, 175, 0.7) 0%,
        rgba(209, 213, 219, 1) 25%,
        rgba(156, 163, 175, 0.7) 50%,
        rgba(209, 213, 219, 1) 75%,
        rgba(156, 163, 175, 0.7) 100%
      );
      background-size: 200% 100%;
      animation: gradientWave 3s linear infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
    }

    .thinking-header {
      user-select: none;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background-color: rgb(40, 44, 52);
      border-radius: 6px 6px 0 0;
    }

    .thinking-content {
      transition: all 0.3s ease-in-out;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 0;
      opacity: 0;
      padding: 0;
      max-width: 100%;
      display: block;
      background-color: rgb(40, 44, 52);
      border-radius: 0 0 6px 6px;
    }

    .thinking-content code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      display: block !important;
      max-width: 100% !important;
    }
  `,
  buttonClass: "flex items-center text-text-500 hover:text-text-300",
  labelClass: "font-medium text-sm",
}
