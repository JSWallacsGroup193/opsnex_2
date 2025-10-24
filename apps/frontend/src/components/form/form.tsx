import * as React from "react"
import { useForm, FormProvider, type FieldValues, type DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { cn } from "@/lib/utils"

interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: DefaultValues<T>
  schema?: z.ZodSchema<T>
  loading?: boolean
  className?: string
  children: React.ReactNode
  autoSave?: boolean
  autoSaveDelay?: number
  onAutoSave?: (data: T) => void | Promise<void>
}

export function Form<T extends FieldValues>({
  onSubmit,
  defaultValues,
  schema,
  className,
  children,
  autoSave = false,
  autoSaveDelay = 2000,
  onAutoSave,
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
    mode: "onBlur",
  })

  const [autoSaveStatus, setAutoSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle")
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    if (!autoSave || !onAutoSave) return

    const subscription = methods.watch((data) => {
      setAutoSaveStatus("idle")

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        setAutoSaveStatus("saving")
        try {
          await onAutoSave(data as T)
          setAutoSaveStatus("saved")
          setTimeout(() => setAutoSaveStatus("idle"), 2000)
        } catch (error) {
          setAutoSaveStatus("idle")
          console.error("Auto-save failed:", error)
        }
      }, autoSaveDelay)
    })

    return () => {
      subscription.unsubscribe()
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [autoSave, onAutoSave, autoSaveDelay, methods])

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission failed:", error)
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={cn("bg-slate-700 rounded-xl p-6 space-y-6 relative", className)}>
        {autoSave && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-sm">
            {autoSaveStatus === "saving" && <span className="text-slate-400">Saving...</span>}
            {autoSaveStatus === "saved" && (
              <span className="text-emerald-500 flex items-center gap-1">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
          </div>
        )}
        {children}
      </form>
    </FormProvider>
  )
}

export { useFormContext } from "react-hook-form"
