import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Lock, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordPageProps {
  onSubmit?: (email: string) => Promise<void>
  onBackToLogin?: () => void
  onResend?: (email: string) => Promise<void>
}

export default function ForgotPasswordPage({ onSubmit, onBackToLogin, onResend }: ForgotPasswordPageProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  // Auto-focus email input on mount
  useState(() => {
    setTimeout(() => setFocus("email"), 100)
  })

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    // Trim and lowercase email
    const email = data.email.trim().toLowerCase()
    setSubmittedEmail(email)

    try {
      if (onSubmit) {
        await onSubmit(email)
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (onResend) {
        await onResend(submittedEmail)
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (err) {
      setError("Failed to resend email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <Link
          to="/login"
          onClick={(e) => {
            if (onBackToLogin) {
              e.preventDefault()
              handleBackToLogin()
            }
          }}
          className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to login</span>
        </Link>

        {/* Card */}
        <div className="bg-slate-700 rounded-lg shadow-xl p-8 border border-slate-600">
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-teal-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-100 mb-2">Reset your password</h1>
                <p className="text-slate-400 text-sm">Enter your email and we'll send you a reset link</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-100">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    autoFocus
                    className={`h-12 bg-slate-600 border-slate-500 text-slate-100 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500 ${
                      errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-teal-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Check your email!</h2>
                <p className="text-slate-400 text-sm mb-6">
                  We sent a password reset link to <span className="text-slate-300 font-medium">{submittedEmail}</span>
                </p>

                <Alert className="mb-6 bg-emerald-500/10 border-emerald-500/50 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Password reset email sent successfully</AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <p className="text-slate-400 text-sm">
                    Didn't receive it?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-teal-500 hover:text-teal-400 font-medium hover:underline disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Resend email"}
                    </button>
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToLogin}
                    className="w-full h-12 bg-slate-600 border-slate-500 text-slate-100 hover:bg-slate-500 hover:text-slate-100"
                  >
                    Back to login
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  onClick={(e) => {
                    if (onBackToLogin) {
                      e.preventDefault()
                      handleBackToLogin()
                    }
                  }}
                  className="text-teal-500 hover:text-teal-400 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
