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

export function ThinkingProcess({
  containerRef,
  isStreaming,
}: ThinkingBlockProps) {
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
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
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
          className="text-text-500 text-xs"
        >
          {isCopied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
          <span className="text-text-500 text-xs">
            {isCopied ? "Copied" : "Copy"}
          </span>
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

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="6 9 12 15 18 9" />
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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
