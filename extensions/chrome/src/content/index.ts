import "@/styles/globals.css"

import { shouldInitialize } from "@/utils/url-utils"

function addCodeBlockToggle() {
  console.log("[TC] Setting up code block toggle")

  let timeout: NodeJS.Timeout
  const observer = new MutationObserver(() => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const headers = document.querySelectorAll(
        ".text-text-300.absolute.pl-3.pt-2\\.5.text-xs:not(:empty), div[data-is-streaming='true'] .text-text-300.absolute.pl-3.pt-2\\.5.text-xs:not(:empty), .pointer-events-none.sticky"
      )
      console.log("[TC] Processing headers after mutations:", headers.length)

      headers.forEach((header) => {
        if (header.hasAttribute("data-tc-processed")) return
        header.setAttribute("data-tc-processed", "true")

        const codeBlock = header
          .closest("pre")
          ?.querySelector(".code-block__code")
        if (!codeBlock) {
          console.log("[TC] No code block found for header")
          return
        }

        // Make the element clickable
        ;(header as HTMLElement).style.cssText =
          "cursor: pointer; pointer-events: auto !important"

        const clickHandler = () => {
          console.log("[TC] Element clicked!")
          codeBlock.classList.toggle("collapsed")
          console.log(
            "[TC] Code block collapsed state:",
            codeBlock.classList.contains("collapsed")
          )
        }

        // Add collapsed class by default
        // codeBlock.classList.add("collapsed")

        // If this is the copy button container
        if (header.classList.contains("pointer-events-none")) {
          const buttonContainer = header.querySelector(
            ".from-bg-300\\/90"
          ) as HTMLElement
          const copyButton = header.querySelector("button")

          if (buttonContainer && copyButton) {
            buttonContainer.style.cssText =
              "pointer-events: auto; user-select: none"
            header.addEventListener("click", clickHandler)

            copyButton.addEventListener(
              "click",
              async (e) => {
                e.stopPropagation()
                console.log("[TC] Copy button clicked")

                const codeElement = codeBlock.querySelector("code")
                if (!codeElement) return

                try {
                  await navigator.clipboard.writeText(
                    codeElement.textContent || ""
                  )

                  // Update button text and SVG
                  const textSpan = copyButton.querySelector("span")
                  const svg = copyButton.querySelector("svg")
                  if (textSpan && svg) {
                    const originalText = textSpan.textContent
                    const originalSvgPath = svg.innerHTML

                    textSpan.textContent = "Copied"
                    svg.innerHTML =
                      '<path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>'

                    setTimeout(() => {
                      textSpan.textContent = originalText
                      svg.innerHTML = originalSvgPath
                    }, 2000)
                  }
                } catch (err) {
                  console.error("[TC] Failed to copy:", err)
                }
              },
              true
            )
          }
        } else {
          header.addEventListener("click", clickHandler)
        }
      })
    }, 100)
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

// Only initialize on appropriate pages
if (shouldInitialize(window.location.href)) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addCodeBlockToggle)
  } else {
    addCodeBlockToggle()
  }
}
