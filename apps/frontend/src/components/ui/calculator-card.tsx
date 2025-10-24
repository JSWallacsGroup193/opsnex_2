interface CalculatorCardProps {
  icon: string
  name: string
  description: string
  onClick: () => void
}

export function CalculatorCard({ icon, name, description, onClick }: CalculatorCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-slate-700 border border-slate-600 rounded-lg p-4 md:p-6 min-h-[140px] w-full transition-all duration-200 hover:bg-slate-600 hover:scale-[1.02] active:scale-[0.98] text-left"
    >
      {/* Icon */}
      <div className="flex justify-center mb-3">
        <span className="text-5xl" role="img" aria-label={name}>
          {icon}
        </span>
      </div>

      {/* Calculator Name */}
      <h3 className="text-slate-100 text-base font-bold text-center mb-2">{name}</h3>

      {/* Description */}
      <p className="text-slate-400 text-sm text-center">{description}</p>
    </button>
  )
}
