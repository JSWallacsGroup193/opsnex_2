import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Eye, EyeOff, Check, X, AlertCircle, CheckCircle2 } from "lucide-react"

// Password strength calculation (simplified zxcvbn-like logic)
const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" }
  if (score <= 3) return { score: 2, label: "Medium", color: "bg-amber-500" }
  return { score: 3, label: "Strong", color: "bg-emerald-500" }
}

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

interface ResetPasswordPageProps {
  token?: string
  onSubmit?: (password: string) => Promise<void>
}

export default function ResetPasswordPage({ token, onSubmit }: ResetPasswordPageProps = {}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirectCountdown, setRedirectCountdown] = useState(3)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  })

  const password = watch("password", "")
  const confirmPassword = watch("confirmPassword", "")
  const passwordStrength = calculatePasswordStrength(password)

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^a-zA-Z0-9]/.test(password) },
  ]

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      // Simulate token validation
      const isValid = token !== "invalid-token"
      setTokenValid(isValid)

      if (isValid) {
        // Simulate token expiry (5 minutes from now)
        const expiryTime = Date.now() + 5 * 60 * 1000
        setTokenExpiry(expiryTime)
      }
    }

    validateToken()
  }, [token])

  // Token expiry countdown
  useEffect(() => {
    if (!tokenExpiry) return

    const interval = setInterval(() => {
      const remaining = Math.floor((tokenExpiry - Date.now()) / 1000)
      if (remaining <= 0) {
        setTokenValid(false)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [tokenExpiry])

  // Success redirect countdown
  useEffect(() => {
    if (!success) return

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Redirect to login
          window.location.href = "/login"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [success])

  const handleFormSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (onSubmit) {
        await onSubmit(data.password)
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestNewLink = () => {
    window.location.href = "/forgot-password"
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-700 rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Link Expired</h1>
          </div>

          <Alert className="mb-6 bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">This reset link has expired or is invalid</AlertDescription>
          </Alert>

          <Button onClick={handleRequestNewLink} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            Request New Link
          </Button>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-teal-500 hover:text-teal-400 hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-700 rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Password Reset!</h1>
          </div>

          <Alert className="mb-6 bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertDescription className="text-emerald-400">Password reset successfully!</AlertDescription>
          </Alert>

          <p className="text-slate-400 text-sm text-center mb-6">
            Redirecting to login in {redirectCountdown} seconds...
          </p>

          <Link to="/login">
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Sign in with your new password</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Token expiry warning
  const timeRemaining = tokenExpiry ? Math.floor((tokenExpiry - Date.now()) / 1000) : null
  const showExpiryWarning = timeRemaining && timeRemaining < 300 // Less than 5 minutes

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-700 rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-teal-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Create new password</h1>
          <p className="text-sm text-slate-400">Your new password must be different from previously used passwords</p>
        </div>

        {/* Token expiry warning */}
        {showExpiryWarning && (
          <Alert className="mb-4 bg-amber-500/10 border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-400">
              This link expires in {Math.floor(timeRemaining! / 60)}:{(timeRemaining! % 60).toString().padStart(2, "0")}{" "}
              minutes
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-100">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500 pr-10"
                {...register("password")}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.score === 1
                        ? "text-red-500"
                        : passwordStrength.score === 2
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Requirements List */}
                <div className="space-y-1">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <X className="w-3 h-3 text-slate-400" />
                      )}
                      <span className={req.met ? "text-emerald-500" : "text-slate-400"}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-100">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500 pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {passwordsMatch && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              )}
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-teal-500 hover:text-teal-400 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
