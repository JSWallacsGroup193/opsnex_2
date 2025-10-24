"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  showCharCount?: boolean
  maxLength?: number
  autoResize?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, label, error, helperText, required, id, showCharCount, maxLength, autoResize, onChange, ...props },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id || `textarea-${generatedId}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const [charCount, setCharCount] = React.useState(0)
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const handleRef = (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)

      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }

      onChange?.(e)
    }

    React.useEffect(() => {
      if (props.value) {
        setCharCount(String(props.value).length)
      }
    }, [props.value])

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-100 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={handleRef}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border bg-slate-700 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400",
            "border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200 resize-y",
            autoResize && "resize-none overflow-hidden",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
          {...props}
        />
        <div className="flex justify-between items-start mt-2">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-sm text-slate-400">
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && (
            <p className="text-sm text-slate-400 ml-4 flex-shrink-0">
              {charCount}
              {maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    )
  },
)

TextArea.displayName = "TextArea"

export { TextArea }
