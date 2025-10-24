"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Plus, Minus } from "lucide-react"

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  onIncrement?: () => void
  onDecrement?: () => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, label, error, helperText, required, id, onIncrement, onDecrement, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || `number-input-${generatedId}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    const handleIncrement = () => {
      if (onIncrement) {
        onIncrement()
      } else if (ref && "current" in ref && ref.current) {
        ref.current.stepUp()
        ref.current.dispatchEvent(new Event("input", { bubbles: true }))
      }
    }

    const handleDecrement = () => {
      if (onDecrement) {
        onDecrement()
      } else if (ref && "current" in ref && ref.current) {
        ref.current.stepDown()
        ref.current.dispatchEvent(new Event("input", { bubbles: true }))
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-100 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="number"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "flex h-14 w-full rounded-lg border bg-slate-700 px-4 py-3 pr-24 text-base text-slate-100 placeholder:text-slate-400",
              "border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={props.disabled}
              aria-label="Decrease value"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-md bg-slate-600 text-teal-500",
                "hover:bg-slate-500 active:bg-slate-600",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-colors duration-200",
              )}
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={props.disabled}
              aria-label="Increase value"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-md bg-slate-600 text-teal-500",
                "hover:bg-slate-500 active:bg-slate-600",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-colors duration-200",
              )}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-sm text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

NumberInput.displayName = "NumberInput"

export { NumberInput }
