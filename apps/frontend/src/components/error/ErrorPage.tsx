import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

interface ErrorPageProps {
  errorCode: 404 | 500
  message?: string
  onRetry?: () => void
  errorDetails?: {
    code?: string
    timestamp?: string
    requestId?: string
    stackTrace?: string
  }
  isAdmin?: boolean
}

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
)

export function ErrorPage({ errorCode, message, onRetry, errorDetails, isAdmin = false }: ErrorPageProps) {
  const [countdown, setCountdown] = useState(10)
  const [showDetails, setShowDetails] = useState(false)
  const navigate = useNavigate()

  const is404 = errorCode === 404
  const defaultMessage = is404
    ? "Sorry, we couldn't find the page you're looking for."
    : "We're experiencing technical difficulties. Our team has been notified."

  useEffect(() => {
    if (is404) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [is404, navigate])

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <div className="flex items-center gap-2">
          <WrenchIcon className="h-8 w-8 text-[#14b8a6]" />
          <span className="text-2xl font-bold text-slate-100">OpsNex</span>
        </div>
      </div>

      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-[120px] font-bold text-slate-100 leading-none mb-4">{errorCode}</h1>
          <div className={`h-1 w-32 mx-auto mb-8 ${is404 ? "bg-[#14b8a6]" : "bg-red-500"}`} />

          <div className="mb-6">
            {is404 ? (
              <WrenchIcon className="h-20 w-20 text-[#14b8a6] mx-auto" />
            ) : (
              <AlertTriangleIcon className="h-20 w-20 text-red-500 mx-auto" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            {is404 ? "Page not found" : "Something went wrong"}
          </h2>

          <p className="text-lg text-slate-400 max-w-md mx-auto">{message || defaultMessage}</p>
        </div>

        {is404 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/" className="block">
              <Card className="bg-[#14b8a6] hover:bg-[#0d9488] transition-colors p-6 text-center border-0 cursor-pointer">
                <HomeIcon className="h-6 w-6 text-white mx-auto mb-2" />
                <span className="text-white font-semibold">Go to Dashboard</span>
              </Card>
            </Link>

            <Link to="/work-orders" className="block">
              <Card className="bg-[#334155] hover:bg-[#475569] transition-colors p-6 text-center border-0 cursor-pointer">
                <FileTextIcon className="h-6 w-6 text-slate-100 mx-auto mb-2" />
                <span className="text-slate-100 font-semibold">View Work Orders</span>
              </Card>
            </Link>

            <Link to="/ai" className="block">
              <Card className="bg-[#334155] hover:bg-[#475569] transition-colors p-6 text-center border-0 cursor-pointer">
                <MailIcon className="h-6 w-6 text-slate-100 mx-auto mb-2" />
                <span className="text-slate-100 font-semibold">AI Support Chat</span>
              </Card>
            </Link>
          </div>
        )}

        {!is404 && isAdmin && errorDetails && (
          <Card className="bg-[#334155] border-[#475569] mb-8 overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full p-4 flex items-center justify-between text-slate-100 hover:bg-[#475569] transition-colors"
            >
              <span className="font-semibold">Error Details</span>
              {showDetails ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>

            {showDetails && (
              <div className="p-4 pt-0 space-y-3">
                {errorDetails.code && (
                  <div>
                    <span className="text-slate-400 text-sm">Error Code:</span>
                    <code className="block mt-1 text-red-400 font-mono text-sm bg-[#1e293b] p-2 rounded">
                      {errorDetails.code}
                    </code>
                  </div>
                )}

                {errorDetails.timestamp && (
                  <div>
                    <span className="text-slate-400 text-sm">Timestamp:</span>
                    <p className="text-slate-100 text-sm mt-1">{errorDetails.timestamp}</p>
                  </div>
                )}

                {errorDetails.requestId && (
                  <div>
                    <span className="text-slate-400 text-sm">Request ID:</span>
                    <p className="text-slate-100 text-sm mt-1 font-mono">{errorDetails.requestId}</p>
                  </div>
                )}

                {errorDetails.stackTrace && (
                  <div>
                    <span className="text-slate-400 text-sm">Stack Trace:</span>
                    <pre className="mt-1 text-slate-300 text-xs bg-[#1e293b] p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                      {errorDetails.stackTrace}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!is404 && onRetry && (
            <Button onClick={onRetry} className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-8 py-6 text-lg">
              Try Again
            </Button>
          )}

          <Link to="/">
            <Button
              variant="secondary"
              className="bg-[#334155] hover:bg-[#475569] text-slate-100 px-8 py-6 text-lg w-full sm:w-auto"
            >
              Go to Dashboard
            </Button>
          </Link>

          {!is404 && (
            <Link to="/ai">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10 px-8 py-6 text-lg w-full sm:w-auto bg-transparent"
              >
                Report to AI Support
              </Button>
            </Link>
          )}
        </div>

        {is404 && (
          <div className="text-center mt-8 space-y-2">
            <Link to="/" className="text-[#14b8a6] hover:text-[#0d9488] font-semibold">
              Take me back
            </Link>
            <p className="text-slate-400 text-sm">Redirecting in {countdown} seconds...</p>
          </div>
        )}
      </div>
    </div>
  )
}
