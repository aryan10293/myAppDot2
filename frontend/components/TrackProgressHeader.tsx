import React from 'react'

interface Target {
  name: string
  completed: boolean
}

interface TrackProgressHeaderProps {
  completed: number
  total: number
  goalName?: string
  targets?: Target[]
}

function TrackProgressHeader({
  completed,
  total,
  goalName = 'Goal',
  targets = [],
}: TrackProgressHeaderProps) {
  const percentage = Math.round((completed / total) * 100)

  const getStatus = () => {
    if (percentage >= 50) {
      return {
        label: 'On Track',
        color: 'from-emerald-500 to-teal-600',
        lightColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
        icon: '✓',
      }
    } else if (percentage >= 40) {
      return {
        label: 'Keep Pushing',
        color: 'from-amber-500 to-orange-600',
        lightColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        dotColor: 'bg-amber-500',
        icon: '→',
      }
    } else {
      return {
        label: 'Time to Catch Up',
        color: 'from-rose-500 to-red-600',
        lightColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        dotColor: 'bg-rose-500',
        icon: '↑',
      }
    }
  }

  const status = getStatus()
  const completedTargets = targets.filter((t) => t.completed).length

  return (
    <div className="space-y-6 mb-12 px-4 sm:px-0 md:mx-auto md:max-w-6xl lg:mx-auto">
      {/* Main Header Card */}
      <div className={`bg-gradient-to-br ${status.color} rounded-2xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden`}>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {/* Left - Goal Info */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wide mb-1 sm:mb-2">Current Goal</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{goalName}</h2>
            </div>
            <div>
              <p className="text-white/90 text-xs sm:text-sm font-semibold mb-1">{status.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">{status.icon}</span>
                <span className="text-white/80 text-xs sm:text-sm">{percentage}% complete</span>
              </div>
            </div>
          </div>

          {/* Center - Big Ratio */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3">Check-ins Completed</p>
              <div className="flex items-baseline gap-0 sm:gap-1 justify-center">
                <span className="text-4xl sm:text-6xl font-black text-white">{completed}</span>
                <span className="text-2xl sm:text-3xl text-white/60">/</span>
                <span className="text-3xl sm:text-4xl font-bold text-white/90">{total}</span>
              </div>
            </div>
          </div>

          {/* Right - Progress Bar */}
          <div className="flex flex-col justify-center">
            <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">Progress</p>
            <div className="space-y-2">
              <div className="bg-white/20 rounded-full h-3 sm:h-4 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-white/70 text-xs text-right font-medium">{percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Targets Section */}
      {targets.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Milestones</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {completedTargets} of {targets.length} completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{completedTargets}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Achieved</div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {targets.map((target, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all ${
                  target.completed
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div
                  className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    target.completed ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  {target.completed && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span
                  className={`flex-grow font-medium text-sm sm:text-base ${
                    target.completed ? 'text-emerald-700 line-through opacity-75' : 'text-gray-700'
                  }`}
                >
                  {target.name}
                </span>
                {target.completed && (
                  <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wide">Complete</span>
                )}
              </div>
            ))}
          </div>

          {/* Targets Progress Bar */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-700">Milestone Progress</p>
              <p className="text-xs sm:text-sm text-gray-600">
                {Math.round((completedTargets / targets.length) * 100)}%
              </p>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700"
                style={{ width: `${(completedTargets / targets.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackProgressHeader
