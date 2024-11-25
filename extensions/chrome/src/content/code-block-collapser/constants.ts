export const SELECTORS = {
  PRE: "pre",
  CODE_CONTAINER: ".code-block__code",
  MAIN_CONTAINER: ".relative.flex.flex-col",
  THINKING_LABEL: ".text-text-300",
  ORIGINAL_COPY_BTN: ".pointer-events-none",
  CODE: "code",
} as const

export const CLASSES = {
  THINKING_HEADER: "thinking-header",
  COPY_CONTAINER:
    "from-bg-300/90 to-bg-300/70 pointer-events-auto rounded-md bg-gradient-to-b p-0.5 backdrop-blur-md",
  COPY_BUTTON:
    "flex flex-row items-center gap-1 rounded-md p-1 py-0.5 text-xs transition-opacity delay-100 hover:bg-bg-200 opacity-60 hover:opacity-100",
  COPY_TEXT: "text-text-200 pr-0.5",
  TOGGLE_BUTTON: "flex items-center text-text-500 hover:text-text-300",
  TOGGLE_LABEL: "font-medium text-sm",
  THINKING_ANIMATION: "thinking-animation",
} as const

export const ANIMATION_STYLES = `
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
` as const

export const ICONS = {
  COPY: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path></svg>`,
  TICK: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" class="text-text-500 mr-px -translate-y-[0.5px]"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`,
  ARROW: `<svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256" style="transition: transform 0.3s ease-in-out; margin-right: 8px;"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
} as const

export const TIMINGS = {
  RETRY_DELAY: 1000,
  MUTATION_DELAY: 100,
  CHECK_INTERVAL: 2000,
  COPY_FEEDBACK: 2000,
  MAX_RETRIES: 10,
} as const
