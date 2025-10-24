import type * as React from "react"
import { useFormContext, Controller, type FieldValues, type Path } from "react-hook-form"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  component?: "input" | "textarea" | "select" | React.ComponentType<any>
  type?: string
  required?: boolean
  helperText?: string
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  className?: string
  disabled?: boolean
  rows?: number
}

export function FormField<T extends FieldValues>({
  name,
  label,
  component = "input",
  type = "text",
  required = false,
  helperText,
  placeholder,
  options = [],
  className,
  disabled = false,
  rows,
}: FormFieldProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]
  const hasError = !!error
  const isValid = !hasError && (control._formState.dirtyFields as any)[name]

  const renderInput = (field: any) => {
    const inputClassName = cn(
      "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500",
      hasError && "border-red-500 focus-visible:ring-red-500/20",
      isValid && "border-emerald-500 focus-visible:ring-emerald-500/20",
    )

    if (component === "textarea") {
      return (
        <Textarea
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={inputClassName}
          aria-invalid={hasError}
        />
      )
    }

    if (component === "select") {
      return (
        <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
          <SelectTrigger
            className={cn(
              "w-full bg-slate-700 border-slate-600 text-slate-100",
              hasError && "border-red-500 focus-visible:ring-red-500/20",
              isValid && "border-emerald-500 focus-visible:ring-emerald-500/20",
            )}
            aria-invalid={hasError}
          >
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-slate-100 focus:bg-slate-600">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (typeof component === "function") {
      const CustomComponent = component
      return <CustomComponent {...field} disabled={disabled} />
    }

    return (
      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
        aria-invalid={hasError}
      />
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-slate-100 text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            {renderInput(field)}
            {isValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Check className="size-4 text-emerald-500" />
              </div>
            )}
          </div>
        )}
      />

      {helperText && !hasError && <p className="text-slate-400 text-sm">{helperText}</p>}

      {hasError && (
        <p className="text-red-500 text-sm flex items-start gap-1">
          <span className="mt-0.5">⚠</span>
          {error.message as string}
        </p>
      )}
    </div>
  )
}
