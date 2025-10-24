import { DispatchBoard } from '@/components/dispatch/dispatch-board'

export default function Dispatch() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dispatch & Scheduling</h1>
        <p className="text-slate-400 text-sm sm:text-base">Deploy techs. Hit targets. No delays.</p>
      </div>
      
      <DispatchBoard />
    </div>
  )
}
