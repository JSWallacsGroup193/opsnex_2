import { LabelsGenerator } from "../components/labels/LabelsGenerator"

export default function Labels() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Page Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Labels</h1>
        <p className="text-slate-400 text-sm sm:text-base">Tag assets. Scan fast. Maintain control.</p>
      </div>
      
      <LabelsGenerator />
    </div>
  )
}
