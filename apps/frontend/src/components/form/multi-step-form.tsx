import * as React from "react"
import { useForm, FormProvider, type FieldValues, type DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface Step {
  title: string
  description?: string
  fields: string[]
  content: React.ReactNode
}

interface MultiStepFormProps<T extends FieldValues> {
  steps: Step[]
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: DefaultValues<T>
  schema?: z.ZodSchema<T>
  loading?: boolean
  className?: string
  showProgress?: boolean
}

export function MultiStepForm<T extends FieldValues>({
  steps,
  onSubmit,
  defaultValues,
  schema,
  loading = false,
  className,
  showProgress = true,
}: MultiStepFormProps<T>) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])

  const methods = useForm<T>({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
    mode: "onBlur",
  })

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep].fields
    const isValid = await methods.trigger(currentStepFields as any)
    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])])
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex)
    } else if (stepIndex === currentStep + 1) {
      await handleNext()
    }
  }

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isLastStep) {
      try {
        await onSubmit(data)
      } catch (error) {
        console.error("Form submission failed:", error)
      }
    } else {
      await handleNext()
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={cn("bg-slate-700 rounded-xl p-6 space-y-6", className)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep && !completedSteps.includes(index)}
                  className={cn(
                    "flex items-center justify-center size-10 rounded-full font-semibold transition-all",
                    "disabled:cursor-not-allowed",
                    index === currentStep && "bg-teal-500 text-white ring-4 ring-teal-500/20",
                    completedSteps.includes(index) && index !== currentStep && "bg-emerald-500 text-white",
                    index > currentStep && !completedSteps.includes(index) && "bg-slate-600 text-slate-400",
                  )}
                >
                  {completedSteps.includes(index) && index !== currentStep ? <Check className="size-5" /> : index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-2 rounded-full transition-colors",
                      completedSteps.includes(index) ? "bg-emerald-500" : "bg-slate-600",
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {showProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-slate-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-slate-100 text-lg font-bold">{steps[currentStep].title}</h3>
            {steps[currentStep].description && (
              <p className="text-slate-400 text-sm mt-1">{steps[currentStep].description}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">{steps[currentStep].content}</div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-600">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="text-slate-300 hover:text-slate-100"
          >
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {!isLastStep && (
              <Button type="button" onClick={handleNext} className="bg-teal-500 hover:bg-teal-600 text-white">
                Next
              </Button>
            )}
            {isLastStep && (
              <Button type="submit" disabled={loading} className="bg-teal-500 hover:bg-teal-600 text-white">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
