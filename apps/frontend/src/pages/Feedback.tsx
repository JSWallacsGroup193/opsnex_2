import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { StarRating } from '@/components/ui/star-rating'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, MessageSquare, Send } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'

const categories = [
  { value: 'bug', label: 'Bug Report', emoji: '🐛' },
  { value: 'feature_request', label: 'Feature Request', emoji: '💡' },
  { value: 'complaint', label: 'Complaint', emoji: '😞' },
  { value: 'praise', label: 'Praise', emoji: '🎉' },
  { value: 'other', label: 'Other', emoji: '💬' },
]

export default function Feedback() {
  const token = useAuthStore((s) => s.token)
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category) {
      toast.error('Please select a feedback category')
      return
    }
    
    if (!message.trim()) {
      toast.error('Please enter your feedback message')
      return
    }

    setSubmitting(true)

    try {
      await axios.post(
        '/api/v1/feedback',
        {
          category,
          rating: rating > 0 ? rating : undefined,
          message: message.trim(),
          contactEmail: contactEmail.trim() || undefined,
          userAgent: navigator.userAgent,
          pageUrl: window.location.href,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSubmitted(true)
      toast.success('Feedback submitted successfully!')

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
        setCategory('')
        setRating(0)
        setMessage('')
        setContactEmail('')
      }, 5000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setCategory('')
    setRating(0)
    setMessage('')
    setContactEmail('')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white">Feedback</h1>
            <p className="text-slate-400 mt-1">Help us improve OpsNex</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <Card className="bg-gradient-to-br from-teal-500/10 to-green-500/10 border-teal-500/20 p-8 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-teal-500/20 p-4">
                <CheckCircle2 className="w-16 h-16 text-teal-500" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Thank You for Your Feedback!
            </h2>
            
            <p className="text-slate-300 text-lg mb-2">
              Your feedback has been successfully submitted.
            </p>
            
            <p className="text-slate-400 mb-8">
              We review all feedback weekly and use it to continuously improve OpsNex.
              {contactEmail && ' We\'ll reach out to you if we need more information.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleReset}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit More Feedback
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Feedback</h1>
          <p className="text-slate-400 mt-1">Help us improve OpsNex</p>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card className="bg-slate-800 border-slate-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-100">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="category"
                  className="bg-slate-900 border-slate-700 text-slate-100 h-11 focus:border-teal-500"
                >
                  <SelectValue placeholder="Select feedback type..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      className="text-slate-100 focus:bg-slate-800 focus:text-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-400">
                Help us route your feedback to the right team
              </p>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-slate-100">
                Overall Rating (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && (
                  <span className="text-slate-400 text-sm">
                    {rating} {rating === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">
                How would you rate your overall experience?
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-100">
                Your Feedback <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={6}
                className="bg-slate-900 border-slate-700 text-slate-100 focus:border-teal-500 resize-none"
                required
              />
              <p className="text-sm text-slate-400">
                Be as detailed as possible to help us understand your feedback
              </p>
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-slate-100">
                Email for Follow-up (Optional)
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-slate-900 border-slate-700 text-slate-100 h-11 focus:border-teal-500"
              />
              <p className="text-sm text-slate-400">
                Leave blank to submit anonymously. We'll only use this to follow up on your feedback.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-700">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium h-11"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="bg-slate-800 border-slate-700 p-6 mt-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Your feedback is reviewed weekly by our product team</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>We use your input to prioritize new features and improvements</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>If you provided contact info, we may reach out for clarification</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Bug reports are triaged and addressed based on severity</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
