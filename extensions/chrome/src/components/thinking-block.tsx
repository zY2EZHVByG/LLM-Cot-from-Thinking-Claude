import React, { useCallback, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ThinkingBlockProps {
  containerRef: HTMLElement
  isStreaming: boolean
}

interface CodeViewerProps {
  className?: string
  originalElement: HTMLElement
}

const CodeViewer = ({ className, originalElement }: CodeViewerProps) => {
  return (
    <code
      className={cn(originalElement.className, className)}
      dangerouslySetInnerHTML={{ __html: originalElement.innerHTML }}
    />
  )
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({
  containerRef,
  isStreaming,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [codeElement, setCodeElement] = useState<HTMLElement | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const element = containerRef.querySelector(
      ".code-block__code > code"
    ) as HTMLElement
    if (!element) return
    setCodeElement(element)
  }, [containerRef, isStreaming])

  const handleCopy = useCallback(async () => {
    try {
      if (!codeElement) return
      await navigator.clipboard.writeText(codeElement.textContent || "")
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("[Thinking Claude] Failed to copy:", error)
    }
  }, [codeElement])

  if (!codeElement) return null

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "relative flex flex-col rounded-xl bg-muted/50 px-4 py-2 space-y-2 w-full",
        isStreaming && "tc-animate-shimmer"
      )}
    >
      <div className="flex items-center justify-between text-text-500">
        <CollapsibleTrigger asChild>
          <Button size="sm" variant="ghost" className="gap-2 text-sm">
            <ChevronUpIcon
              className={`h-4 w-4 transform transition-transform duration-200 ease-out ${!isOpen ? "rotate-180" : ""}`}
            />
            {isStreaming ? (
              <span className="tc-animate-shimmer">Claude is thinking...</span>
            ) : (
              <span>Thinking Process</span>
            )}
            <span className="sr-only">Toggle thinking process</span>
          </Button>
        </CollapsibleTrigger>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          disabled={!codeElement}
          className="transition-all duration-200 ease-out text-text-500 text-xs hover:bg-bg-200 hover:text-text-300 p-1 py-0.5 h-6"
        >
          {isCopied ? (
            <TickIcon className="size-3" />
          ) : (
            <CopyIcon className="size-3" />
          )}
          <span className="text-text-500 text-xs">Copy</span>
          <span className="sr-only">
            {isCopied ? "Copied" : "Copy thinking process"}
          </span>
        </Button>
      </div>

      <CollapsibleContent className="tc-collapsible-content overflow-x-hidden overflow-y-auto max-h-[40vh]">
        <div
          className={cn(
            "h-fit text-sm text-text-300 whitespace-pre-wrap break-words font-mono",
            isStreaming && "tc-animate-shimmer"
          )}
          style={{
            fontFamily:
              '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
            lineHeight: 1.5,
            tabSize: 2,
            hyphens: "none",
          }}
        >
          {codeElement && <CodeViewer originalElement={codeElement} />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Icons
function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="currentColor"
      viewBox="0 0 256 256"
      className={"fill-text-500"}
      {...props}
    >
      <path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"></path>
    </svg>
  )
}

function TickIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="currentColor"
      viewBox="0 0 256 256"
      className="text-text-500 -translate-y-[0.5px]"
      {...props}
    >
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
    </svg>
  )
}
