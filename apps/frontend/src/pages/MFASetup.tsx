import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  ChevronLeft,
  Check,
  Copy,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

type MFAMethod = "app" | "sms" | "email"

interface MFASetupPageProps {
  qrCode?: string
  secretKey?: string
  backupCodes?: string[]
  onSetup?: (code: string) => Promise<void>
  onSkip?: () => void
}

export default function MFASetupPage({
  qrCode = "otpauth://totp/OpsNex:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=OpsNex",
  secretKey = "JBSWY3DPEHPK3PXP",
  backupCodes = [
    "1234-5678-9012",
    "3456-7890-1234",
    "5678-9012-3456",
    "7890-1234-5678",
    "9012-3456-7890",
    "2345-6789-0123",
    "4567-8901-2345",
    "6789-0123-4567",
    "8901-2345-6789",
    "0123-4567-8901",
  ],
  onSetup,
  onSkip,
}: MFASetupPageProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod | null>(null)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [backupCodesSaved, setBackupCodesSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleMethodSelect = (method: MFAMethod) => {
    setSelectedMethod(method)
  }

  const handleContinueToSetup = () => {
    if (selectedMethod) {
      setCurrentStep(2)
    }
  }

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...verificationCode]
    newCode[index] = value

    setVerificationCode(newCode)

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when complete
    if (index === 5 && value && newCode.every((digit) => digit)) {
      handleVerifyCode(newCode.join(""))
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (onSetup) {
        await onSetup(code)
      }

      setCurrentStep(3)
    } catch (err) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendSMSCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCodeSent(true)
    } catch (err) {
      setError("Failed to send code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey)
  }

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
  }

  const handleDownloadCodes = () => {
    const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "opsnex-backup-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrintCodes = () => {
    const printWindow = window.open("", "", "width=600,height=400")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>OpsNex Backup Codes</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              h1 { font-size: 18px; margin-bottom: 20px; }
              .codes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            </style>
          </head>
          <body>
            <h1>OpsNex MFA Backup Codes</h1>
            <div class="codes">
              ${backupCodes.map((code) => `<div>${code}</div>`).join("")}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleFinishSetup = async () => {
    if (!backupCodesSaved) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      setError("Failed to complete setup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError("")
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert className="bg-emerald-500/10 border-emerald-500/50 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <AlertDescription className="text-base">Two-factor authentication enabled!</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <Button onClick={() => navigate("/")} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        <div className="bg-slate-700 rounded-lg border border-slate-600 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-teal-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 text-center mb-2">Secure your account</h1>
            <p className="text-slate-400 text-center text-sm">
              Add an extra layer of security with two-factor authentication
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    step === currentStep ? "bg-teal-500" : step < currentStep ? "bg-teal-600" : "bg-slate-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Step {currentStep} of 3</p>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Choose Method */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-100">Choose your authentication method</h2>

              <div className="space-y-3">
                {/* Authenticator App */}
                <button
                  onClick={() => handleMethodSelect("app")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedMethod === "app"
                      ? "border-teal-500 bg-slate-600"
                      : "border-slate-600 bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Smartphone className="h-6 w-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-100">Authenticator App</h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded">
                          Most Secure
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">Use Google Authenticator, Authy, or similar</p>
                    </div>
                  </div>
                </button>

                {/* SMS */}
                <button
                  onClick={() => handleMethodSelect("sms")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedMethod === "sms"
                      ? "border-teal-500 bg-slate-600"
                      : "border-slate-600 bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100 mb-1">SMS Text Message</h3>
                      <p className="text-sm text-slate-400">Receive codes via text message</p>
                    </div>
                  </div>
                </button>

                {/* Email */}
                <button
                  onClick={() => handleMethodSelect("email")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedMethod === "email"
                      ? "border-teal-500 bg-slate-600"
                      : "border-slate-600 bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100 mb-1">Email</h3>
                      <p className="text-sm text-slate-400">Receive codes via email</p>
                    </div>
                  </div>
                </button>
              </div>

              <Button
                onClick={handleContinueToSetup}
                disabled={!selectedMethod}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>

              {onSkip && (
                <button
                  onClick={onSkip}
                  className="w-full text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>
          )}

          {/* Step 2: Setup - Authenticator App */}
          {currentStep === 2 && selectedMethod === "app" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-100">Scan QR code</h2>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-slate-900 rounded-lg border-2 border-teal-500">
                  <QRCodeSVG value={qrCode} size={200} level="H" />
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">1. Open your authenticator app</p>
                <p className="text-sm text-slate-400">2. Scan this QR code</p>
                <p className="text-sm text-slate-400">3. Enter the 6-digit code below</p>
              </div>

              {/* Manual Entry */}
              <div>
                <button
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  className="flex items-center gap-2 text-sm text-teal-500 hover:text-teal-400 transition-colors"
                >
                  Can't scan? Enter code manually
                  <ChevronDown className={`h-4 w-4 transition-transform ${showManualEntry ? "rotate-180" : ""}`} />
                </button>

                {showManualEntry && (
                  <div className="mt-3 p-3 bg-slate-900 rounded border border-slate-600">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-slate-100">{secretKey}</code>
                      <Button
                        onClick={handleCopySecret}
                        variant="ghost"
                        size="sm"
                        className="text-teal-500 hover:text-teal-400"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Code Input */}
              <div>
                <Label className="text-slate-300 mb-2 block">Verification Code</Label>
                <div className="flex gap-2 justify-center">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold bg-slate-800 border-slate-600 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={() => handleVerifyCode(verificationCode.join(""))}
                  disabled={verificationCode.some((digit) => !digit) || isLoading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Setup - SMS */}
          {currentStep === 2 && selectedMethod === "sms" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-100">Enter your phone number</h2>

              {!codeSent ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Phone Number</Label>
                      <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-24 bg-slate-800 border-slate-600 text-slate-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                            <SelectItem value="+91">+91</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 bg-slate-800 border-slate-600 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSendSMSCode}
                      disabled={!phoneNumber || isLoading}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send Code"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-400">
                    We sent a 6-digit code to {countryCode} {phoneNumber}
                  </p>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Verification Code</Label>
                    <div className="flex gap-2 justify-center">
                      {verificationCode.map((digit, index) => (
                        <Input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeInput(index, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-semibold bg-slate-800 border-slate-600 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSendSMSCode}
                    className="text-sm text-teal-500 hover:text-teal-400 transition-colors"
                  >
                    Didn't receive? Resend
                  </button>

                  <Button
                    onClick={() => handleVerifyCode(verificationCode.join(""))}
                    disabled={verificationCode.some((digit) => !digit) || isLoading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Backup Codes */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-100">Save your backup codes</h2>

              <Alert className="bg-amber-500/10 border-amber-500/50 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Store these in a safe place. You'll need them if you lose access to your authenticator.
                </AlertDescription>
              </Alert>

              {/* Backup Codes Display */}
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-600">
                <div className="grid grid-cols-2 gap-3">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm text-slate-100 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyAllCodes}
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-500 hover:bg-teal-600/10 bg-transparent"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button
                  onClick={handleDownloadCodes}
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-500 hover:bg-teal-600/10 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handlePrintCodes}
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-500 hover:bg-teal-600/10 bg-transparent"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-slate-800 rounded-lg border border-slate-600">
                <Checkbox
                  id="backup-codes-saved"
                  checked={backupCodesSaved}
                  onCheckedChange={(checked) => setBackupCodesSaved(checked as boolean)}
                  className="mt-0.5 border-slate-500 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <Label htmlFor="backup-codes-saved" className="text-sm text-slate-300 cursor-pointer">
                  I have saved my backup codes in a secure location
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleFinishSetup}
                  disabled={!backupCodesSaved || isLoading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                >
                  {isLoading ? "Finishing..." : "Finish Setup"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
