"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  User,
  Shield,
  SettingsIcon,
  Bell,
  CreditCard,
  Camera,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Check,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import api from "../utils/axiosClient"
import toast from "react-hot-toast"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobTitle?: string
  avatar?: string
  companyName?: string
  department?: string
  employeeId?: string
  bio?: string
  timezone: string
}

interface ActiveSession {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

interface LoginAttempt {
  timestamp: string
  ip: string
  location: string
  device: string
  success: boolean
}

interface SettingsPageProps {
  user: UserProfile
  onUpdateProfile?: (data: any) => void
  onUpdatePassword?: (current: string, newPassword: string) => void
  onUpdatePreferences?: (prefs: any) => void
  isLoading?: boolean
}

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  timezone: z.string(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function SettingsPage({
  user: initialUser,
  onUpdateProfile,
  onUpdatePassword,
  onUpdatePreferences,
  isLoading = false,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [showLoginHistory, setShowLoginHistory] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(initialUser.avatar)

  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, US",
      ip: "192.168.1.1",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "New York, US",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ])

  const [loginHistory] = useState<LoginAttempt[]>([
    {
      timestamp: "2024-01-15 10:30 AM",
      ip: "192.168.1.1",
      location: "New York, US",
      device: "Chrome on Windows",
      success: true,
    },
    {
      timestamp: "2024-01-14 3:45 PM",
      ip: "192.168.1.2",
      location: "New York, US",
      device: "Safari on iPhone",
      success: true,
    },
    {
      timestamp: "2024-01-13 11:20 AM",
      ip: "203.0.113.0",
      location: "Unknown",
      device: "Unknown",
      success: false,
    },
  ])

  const [notifications, setNotifications] = useState({
    workOrders: {
      newAssignment: { email: true, push: true, sms: false },
      statusChange: { email: true, push: true, sms: false },
      customerComment: { email: true, push: false, sms: false },
    },
    dispatch: {
      scheduleChange: { email: true, push: true, sms: true },
      emergencyCall: { email: true, push: true, sms: true },
    },
    system: {
      maintenance: { email: true, push: false, sms: false },
      newFeatures: { email: false, push: false, sms: false },
    },
    digest: {
      dailySummary: false,
      dailyTime: "08:00",
      weeklyReport: true,
      weeklyDay: "monday",
    },
    quietHours: {
      enabled: false,
      startTime: "22:00",
      endTime: "08:00",
    },
  })

  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)

  // Load notification preferences from backend
  useEffect(() => {
    async function loadNotificationPreferences() {
      try {
        setIsLoadingPreferences(true)
        const { data } = await api.get('/notifications/preferences')
        
        // Map backend preferences to frontend state
        setNotifications({
          workOrders: {
            newAssignment: { 
              email: data.emailWorkOrders ?? true, 
              push: data.inAppWorkOrders ?? true, 
              sms: data.smsWorkOrders ?? false 
            },
            statusChange: { 
              email: data.emailWorkOrders ?? true, 
              push: data.inAppWorkOrders ?? true, 
              sms: data.smsWorkOrders ?? false 
            },
            customerComment: { 
              email: data.emailWorkOrders ?? true, 
              push: data.inAppWorkOrders ?? false, 
              sms: false 
            },
          },
          dispatch: {
            scheduleChange: { 
              email: data.emailSystemAlerts ?? true, 
              push: data.inAppSystemAlerts ?? true, 
              sms: data.smsSystemAlerts ?? true 
            },
            emergencyCall: { 
              email: data.emailSystemAlerts ?? true, 
              push: data.inAppSystemAlerts ?? true, 
              sms: data.smsSystemAlerts ?? true 
            },
          },
          system: {
            maintenance: { 
              email: data.emailSystemAlerts ?? true, 
              push: data.inAppSystemAlerts ?? false, 
              sms: false 
            },
            newFeatures: { 
              email: data.emailReports ?? false, 
              push: data.inAppReports ?? false, 
              sms: false 
            },
          },
          digest: {
            dailySummary: data.dailyDigest ?? false,
            dailyTime: data.digestTime ?? "08:00",
            weeklyReport: data.weeklyDigest ?? true,
            weeklyDay: "monday",
          },
          quietHours: {
            enabled: false,
            startTime: "22:00",
            endTime: "08:00",
          },
        })
      } catch (error: any) {
        console.error('[Settings] Failed to load notification preferences:', error)
      } finally {
        setIsLoadingPreferences(false)
      }
    }

    loadNotificationPreferences()
  }, [])

  // Save notification preferences to backend
  const saveNotificationPreferences = async () => {
    try {
      setIsSavingPreferences(true)
      
      // Map frontend state to backend format
      const backendFormat = {
        emailEnabled: true,
        emailWorkOrders: notifications.workOrders.newAssignment.email || notifications.workOrders.statusChange.email,
        emailInvoices: true,
        emailReports: notifications.system.newFeatures.email,
        emailSystemAlerts: notifications.dispatch.scheduleChange.email || notifications.system.maintenance.email,
        
        inAppEnabled: true,
        inAppWorkOrders: notifications.workOrders.newAssignment.push || notifications.workOrders.statusChange.push,
        inAppInvoices: true,
        inAppReports: notifications.system.newFeatures.push,
        inAppSystemAlerts: notifications.dispatch.scheduleChange.push || notifications.system.maintenance.push,
        
        smsEnabled: notifications.workOrders.newAssignment.sms || notifications.dispatch.scheduleChange.sms,
        smsWorkOrders: notifications.workOrders.newAssignment.sms || notifications.workOrders.statusChange.sms,
        smsInvoices: false,
        smsSystemAlerts: notifications.dispatch.scheduleChange.sms || notifications.dispatch.emergencyCall.sms,
        
        dailyDigest: notifications.digest.dailySummary,
        weeklyDigest: notifications.digest.weeklyReport,
        digestTime: notifications.digest.dailyTime,
      }
      
      await api.put('/notifications/preferences', backendFormat)
      toast.success('Notification preferences saved successfully!')
    } catch (error: any) {
      console.error('[Settings] Failed to save notification preferences:', error)
      toast.error(error?.response?.data?.message || 'Failed to save notification preferences')
    } finally {
      setIsSavingPreferences(false)
    }
  }

  const [preferences, setPreferences] = useState({
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    numberFormat: "en-US",
    theme: "dark",
    sidebarDefault: "expanded",
    density: "comfortable",
    defaultView: "dashboard",
    widgets: {
      recentWorkOrders: true,
      upcomingSchedule: true,
      quickStats: true,
      notifications: true,
    },
  })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialUser.firstName,
      lastName: initialUser.lastName,
      email: initialUser.email,
      phone: initialUser.phone || "",
      jobTitle: initialUser.jobTitle || "",
      companyName: initialUser.companyName || "",
      department: initialUser.department || "",
      bio: initialUser.bio || "",
      timezone: initialUser.timezone,
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onProfileSubmit = (data: any) => {
    onUpdateProfile?.(data)
    setHasUnsavedChanges(false)
  }

  const onPasswordSubmit = (data: any) => {
    onUpdatePassword?.(data.currentPassword, data.newPassword)
    passwordForm.reset()
    setShowPasswordForm(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        setHasUnsavedChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTabChange = (tab: string) => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      setActiveTab(tab)
    }
  }

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Account Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400 text-sm sm:text-base">Customize loadout. Lock in your config</p>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-60 bg-slate-800 border-b lg:border-r lg:border-b-0 border-slate-700">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Settings</h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-teal-500/10 text-slate-100 border-l-2 border-teal-500"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                    }`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Profile Settings</h1>
                <p className="text-slate-400 mt-1">Manage your personal information</p>
              </div>

              {/* Avatar Section */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="size-32">
                      <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                      <AvatarFallback className="bg-slate-600 text-slate-100 text-2xl">
                        {initialUser.firstName[0]}
                        {initialUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="size-8 text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="avatar-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                      >
                        Upload Photo
                      </Button>
                    </label>
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          setAvatarPreview(undefined)
                          setHasUnsavedChanges(true)
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                {/* Personal Information */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-200">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        {...profileForm.register("firstName")}
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                        onChange={(e) => {
                          profileForm.register("firstName").onChange(e)
                          setHasUnsavedChanges(true)
                        }}
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{profileForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-200">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        {...profileForm.register("lastName")}
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                        onChange={(e) => {
                          profileForm.register("lastName").onChange(e)
                          setHasUnsavedChanges(true)
                        }}
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{profileForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-200">
                        Email
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          {...profileForm.register("email")}
                          readOnly
                          className="h-12 bg-slate-600 border-slate-500 text-slate-400"
                        />
                        <Button type="button" variant="ghost" className="text-teal-500 hover:text-teal-400">
                          Change
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-200">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        {...profileForm.register("phone")}
                        placeholder="(555) 123-4567"
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                        onChange={(e) => {
                          profileForm.register("phone").onChange(e)
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="jobTitle" className="text-slate-200">
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        {...profileForm.register("jobTitle")}
                        placeholder="HVAC Technician"
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                        onChange={(e) => {
                          profileForm.register("jobTitle").onChange(e)
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="text-slate-200">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        {...profileForm.register("companyName")}
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                        onChange={(e) => {
                          profileForm.register("companyName").onChange(e)
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department" className="text-slate-200">
                        Department
                      </Label>
                      <Select
                        value={profileForm.watch("department")}
                        onValueChange={(value) => {
                          profileForm.setValue("department", value)
                          setHasUnsavedChanges(true)
                        }}
                      >
                        <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="field-service">Field Service</SelectItem>
                          <SelectItem value="dispatch">Dispatch</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">About</h3>
                  <div>
                    <Label htmlFor="bio" className="text-slate-200">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      {...profileForm.register("bio")}
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px] bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                      onChange={(e) => {
                        profileForm.register("bio").onChange(e)
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <p className="text-slate-400 text-sm mt-1">
                      {profileForm.watch("bio")?.length || 0}/500 characters
                    </p>
                  </div>
                </div>

                {/* Timezone */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">Timezone</h3>
                  <div className="flex gap-2">
                    <Select
                      value={profileForm.watch("timezone")}
                      onValueChange={(value) => {
                        profileForm.setValue("timezone", value)
                        setHasUnsavedChanges(true)
                      }}
                    >
                      <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
                    >
                      Auto-detect
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                    onClick={() => {
                      profileForm.reset()
                      setHasUnsavedChanges(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-500 text-white hover:bg-teal-600"
                    disabled={isLoading || !hasUnsavedChanges}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>

              {/* Unsaved Changes Warning */}
              {hasUnsavedChanges && (
                <Alert className="mt-6 bg-amber-500/10 border-amber-500">
                  <AlertDescription className="text-amber-500">
                    You have unsaved changes. Don't forget to save before leaving this page.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Account Security Tab */}
          {activeTab === "security" && (
            <div className="max-w-4xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Account Security</h1>
                <p className="text-slate-400 mt-1">Manage your security settings</p>
              </div>

              {/* Password Section */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Password</h3>
                    <p className="text-slate-400 text-sm">Last changed 30 days ago</p>
                  </div>
                  {!showPasswordForm && (
                    <Button
                      variant="outline"
                      className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Change Password
                    </Button>
                  )}
                </div>

                {showPasswordForm && (
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-slate-200">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          {...passwordForm.register("currentPassword")}
                          className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showCurrentPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-red-400 text-sm mt-1">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-slate-200">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          {...passwordForm.register("newPassword")}
                          className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-slate-200">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                        onClick={() => {
                          setShowPasswordForm(false)
                          passwordForm.reset()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-teal-500 text-white hover:bg-teal-600">
                        Update Password
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-100">Two-Factor Authentication</h3>
                      <Badge
                        className={
                          mfaEnabled
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500"
                            : "bg-slate-600 text-slate-400 border-slate-500"
                        }
                      >
                        {mfaEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={mfaEnabled}
                      onCheckedChange={setMfaEnabled}
                      className="data-[state=checked]:bg-teal-500"
                    />
                    <Button
                      variant="outline"
                      className="border-teal-500 text-teal-500 hover:bg-teal-500/10 bg-transparent"
                    >
                      {mfaEnabled ? "Manage" : "Setup"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-100">Active Sessions</h3>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent">
                    Sign Out All Others
                  </Button>
                </div>
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="bg-slate-600 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-700 p-3 rounded-lg">
                          {session.device.includes("iPhone") ? (
                            <Smartphone className="size-6 text-slate-300" />
                          ) : (
                            <Monitor className="size-6 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-100 font-medium">{session.device}</p>
                            {session.isCurrent && (
                              <Badge className="bg-teal-500/10 text-teal-500 border-teal-500">Current session</Badge>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">
                            {session.location} • {session.ip}
                          </p>
                          <p className="text-slate-400 text-sm">{session.lastActive}</p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Login History */}
              <div className="bg-slate-700 rounded-lg p-6">
                <button
                  onClick={() => setShowLoginHistory(!showLoginHistory)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-slate-100">Login History</h3>
                  {showLoginHistory ? (
                    <ChevronDown className="size-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="size-5 text-slate-400" />
                  )}
                </button>
                {showLoginHistory && (
                  <div className="space-y-3">
                    {loginHistory.map((attempt, index) => (
                      <div key={index} className="bg-slate-600 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${attempt.success ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                            {attempt.success ? (
                              <Check className="size-5 text-emerald-500" />
                            ) : (
                              <X className="size-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-slate-100 font-medium">{attempt.timestamp}</p>
                            <p className="text-slate-400 text-sm">
                              {attempt.location} • {attempt.ip}
                            </p>
                            <p className="text-slate-400 text-sm">{attempt.device}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            attempt.success
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500"
                              : "bg-red-500/10 text-red-500 border-red-500"
                          }
                        >
                          {attempt.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="max-w-4xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Preferences</h1>
                <p className="text-slate-400 mt-1">Customize your experience</p>
              </div>

              {/* Language & Region */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-200">Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                    >
                      <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-200">Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                    >
                      <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-200">Time Format</Label>
                    <Select
                      value={preferences.timeFormat}
                      onValueChange={(value) => setPreferences({ ...preferences, timeFormat: value })}
                    >
                      <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-200">Number Format</Label>
                    <Select
                      value={preferences.numberFormat}
                      onValueChange={(value) => setPreferences({ ...preferences, numberFormat: value })}
                    >
                      <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">1,234.56</SelectItem>
                        <SelectItem value="de-DE">1.234,56</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Display */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Display</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-200 mb-2 block">Theme</Label>
                    <div className="flex gap-2">
                      {["dark", "light", "auto"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setPreferences({ ...preferences, theme })}
                          className={`flex-1 h-12 rounded-lg border-2 transition-colors capitalize ${
                            preferences.theme === theme
                              ? "border-teal-500 bg-teal-500/10 text-teal-500"
                              : "border-slate-500 bg-slate-600 text-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-200 mb-2 block">Sidebar Default</Label>
                    <div className="flex gap-2">
                      {["expanded", "collapsed"].map((state) => (
                        <button
                          key={state}
                          onClick={() =>
                            setPreferences({
                              ...preferences,
                              sidebarDefault: state,
                            })
                          }
                          className={`flex-1 h-12 rounded-lg border-2 transition-colors capitalize ${
                            preferences.sidebarDefault === state
                              ? "border-teal-500 bg-teal-500/10 text-teal-500"
                              : "border-slate-500 bg-slate-600 text-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-200 mb-2 block">Density</Label>
                    <div className="flex gap-2">
                      {["comfortable", "compact"].map((density) => (
                        <button
                          key={density}
                          onClick={() => setPreferences({ ...preferences, density })}
                          className={`flex-1 h-12 rounded-lg border-2 transition-colors capitalize ${
                            preferences.density === density
                              ? "border-teal-500 bg-teal-500/10 text-teal-500"
                              : "border-slate-500 bg-slate-600 text-slate-300 hover:border-slate-400"
                          }`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Dashboard</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-200">Default View on Login</Label>
                    <Select
                      value={preferences.defaultView}
                      onValueChange={(value) => setPreferences({ ...preferences, defaultView: value })}
                    >
                      <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="work-orders">Work Orders</SelectItem>
                        <SelectItem value="schedule">Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-200 mb-3 block">Widgets to Show</Label>
                    <div className="space-y-3">
                      {Object.entries(preferences.widgets).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                          <Checkbox
                            checked={value}
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                widgets: {
                                  ...preferences.widgets,
                                  [key]: checked as boolean,
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-teal-500 text-white hover:bg-teal-600"
                  onClick={() => onUpdatePreferences?.(preferences)}
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="max-w-4xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Notification Preferences</h1>
                <p className="text-slate-400 mt-1">Manage how you receive notifications</p>
              </div>

              {/* Work Orders Notifications */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Work Orders</h3>
                <div className="space-y-4">
                  {Object.entries(notifications.workOrders).map(([key, channels]) => (
                    <div key={key} className="border-b border-slate-600 pb-4">
                      <p className="text-slate-200 font-medium mb-3 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                workOrders: {
                                  ...notifications.workOrders,
                                  [key]: {
                                    ...channels,
                                    email: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                workOrders: {
                                  ...notifications.workOrders,
                                  [key]: {
                                    ...channels,
                                    push: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">Push</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.sms}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                workOrders: {
                                  ...notifications.workOrders,
                                  [key]: {
                                    ...channels,
                                    sms: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">SMS</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatch Notifications */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Dispatch</h3>
                <div className="space-y-4">
                  {Object.entries(notifications.dispatch).map(([key, channels]) => (
                    <div key={key} className="border-b border-slate-600 pb-4">
                      <p className="text-slate-200 font-medium mb-3 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                dispatch: {
                                  ...notifications.dispatch,
                                  [key]: {
                                    ...channels,
                                    email: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                dispatch: {
                                  ...notifications.dispatch,
                                  [key]: {
                                    ...channels,
                                    push: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">Push</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.sms}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                dispatch: {
                                  ...notifications.dispatch,
                                  [key]: {
                                    ...channels,
                                    sms: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">SMS</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Notifications */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">System</h3>
                <div className="space-y-4">
                  {Object.entries(notifications.system).map(([key, channels]) => (
                    <div key={key} className="border-b border-slate-600 pb-4">
                      <p className="text-slate-200 font-medium mb-3 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                system: {
                                  ...notifications.system,
                                  [key]: {
                                    ...channels,
                                    email: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={channels.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                system: {
                                  ...notifications.system,
                                  [key]: {
                                    ...channels,
                                    push: checked as boolean,
                                  },
                                },
                              })
                            }
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                          <span className="text-slate-300 text-sm">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digest */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Digest</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">Daily Summary Email</p>
                      <p className="text-slate-400 text-sm">Receive a daily summary of your work</p>
                    </div>
                    <Switch
                      checked={notifications.digest.dailySummary}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          digest: {
                            ...notifications.digest,
                            dailySummary: checked,
                          },
                        })
                      }
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>
                  {notifications.digest.dailySummary && (
                    <div>
                      <Label className="text-slate-200">Send at</Label>
                      <Input
                        type="time"
                        value={notifications.digest.dailyTime}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            digest: {
                              ...notifications.digest,
                              dailyTime: e.target.value,
                            },
                          })
                        }
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  )}
                  <Separator className="bg-slate-600" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">Weekly Report</p>
                      <p className="text-slate-400 text-sm">Receive a weekly summary of your work</p>
                    </div>
                    <Switch
                      checked={notifications.digest.weeklyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          digest: {
                            ...notifications.digest,
                            weeklyReport: checked,
                          },
                        })
                      }
                      className="data-[state=checked]:bg-teal-500"
                    />
                  </div>
                  {notifications.digest.weeklyReport && (
                    <div>
                      <Label className="text-slate-200">Send on</Label>
                      <Select
                        value={notifications.digest.weeklyDay}
                        onValueChange={(value) =>
                          setNotifications({
                            ...notifications,
                            digest: {
                              ...notifications.digest,
                              weeklyDay: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="h-12 bg-slate-600 border-slate-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Quiet Hours</h3>
                    <p className="text-slate-400 text-sm">Do not disturb during these hours</p>
                  </div>
                  <Switch
                    checked={notifications.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        quietHours: {
                          ...notifications.quietHours,
                          enabled: checked,
                        },
                      })
                    }
                    className="data-[state=checked]:bg-teal-500"
                  />
                </div>
                {notifications.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-200">Start Time</Label>
                      <Input
                        type="time"
                        value={notifications.quietHours.startTime}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            quietHours: {
                              ...notifications.quietHours,
                              startTime: e.target.value,
                            },
                          })
                        }
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-200">End Time</Label>
                      <Input
                        type="time"
                        value={notifications.quietHours.endTime}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            quietHours: {
                              ...notifications.quietHours,
                              endTime: e.target.value,
                            },
                          })
                        }
                        className="h-12 bg-slate-600 border-slate-500 text-white focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={saveNotificationPreferences}
                  disabled={isSavingPreferences || isLoadingPreferences}
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  {isSavingPreferences ? 'Saving...' : 'Save Notification Preferences'}
                </Button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="max-w-4xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Billing</h1>
                <p className="text-slate-400 mt-1">Manage your subscription and billing</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-12 text-center">
                <CreditCard className="size-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 text-lg">Billing information coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="bg-slate-700 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Unsaved Changes</DialogTitle>
            <DialogDescription className="text-slate-400">
              You have unsaved changes. Are you sure you want to leave this page?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
              onClick={() => setShowUnsavedDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                setHasUnsavedChanges(false)
                setShowUnsavedDialog(false)
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
