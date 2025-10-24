import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuthStore } from "../store/useAuthStore"
import logo from "@/assets/logo.png"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginPageProps {
  onSubmit?: (email: string, password: string, rememberMe: boolean) => Promise<void>
  isLoading?: boolean
  error?: string
  onForgotPassword?: () => void
  onSignUp?: () => void
}

export default function LoginPage({
  onSubmit,
  isLoading: externalLoading,
  error: externalError,
  onForgotPassword,
  onSignUp,
}: LoginPageProps = {}) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)
  const [showError, setShowError] = useState(true)

  const isLoading = externalLoading ?? internalLoading
  const error = externalError ?? internalError

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmitForm = async (data: LoginFormData) => {
    setInternalError(null)
    setShowError(true)

    if (onSubmit) {
      try {
        setInternalLoading(true)
        await onSubmit(data.email, data.password, data.rememberMe)
      } catch (err) {
        setInternalError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setInternalLoading(false)
      }
    } else {
      setInternalLoading(true)
      try {
        await login({
          email: data.email,
          password: data.password,
        })
        navigate("/")
      } catch (err: any) {
        setInternalError(err.response?.data?.message || "Invalid email or password")
      } finally {
        setInternalLoading(false)
      }
    }
  }

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword()
    } else {
      console.log("[v0] Forgot password clicked")
    }
  }

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp()
    } else {
      navigate("/register")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card rounded-xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="OpsNex Logo" className="h-24 w-auto object-contain" style={{ mixBlendMode: 'lighten' }} />
            </div>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && showError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setShowError(false)}
                  className="text-destructive-foreground hover:text-foreground transition-colors"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                autoFocus
                className={`h-12 ${
                  errors.email ? "border-destructive focus:border-destructive focus:ring-destructive" : ""
                }`}
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`h-12 pr-12 ${
                    errors.password ? "border-destructive focus:border-destructive focus:ring-destructive" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                />
                <Label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/90 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Don't have an account?</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleSignUp}
                className="text-primary hover:text-primary/90 font-medium transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
