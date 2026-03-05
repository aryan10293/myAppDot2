import React from 'react'

interface StatCard {
  label: string
  value: string | number
  icon: string
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple'
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface TrackProgressStatsProps {
  stats?: StatCard[]
}

function TrackProgressStats({ stats }: TrackProgressStatsProps) {
  // Default fake data if not provided
  const defaultStats: StatCard[] = [
    {
      label: 'Completion Rate',
      value: '72%',
      icon: '✓',
      color: 'emerald',
      trend: { value: 5, isPositive: true },
    },
    {
      label: 'Check-ins This Week',
      value: '5/7',
      icon: '📋',
      color: 'blue',
      trend: { value: 2, isPositive: true },
    },
    {
      label: 'This Month Progress',
      value: '68%',
      icon: '📈',
      color: 'amber',
      trend: { value: 8, isPositive: true },
    },
    {
      label: 'Streak',
      value: '4 days',
      icon: '🔥',
      color: 'rose',
      trend: { value: 1, isPositive: true },
    },
  ]

  const displayStats = stats || defaultStats

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-600' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-700', icon: 'text-rose-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="px-3 sm:px-0 md:mx-auto md:max-w-6xl lg:mx-auto mb-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {displayStats.map((stat, index) => {
          const colors = getColorClasses(stat.color)
          return (
            <div key={index} className={`${colors.bg} rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 border border-gray-200 hover:shadow-md transition-shadow`}>
              {/* Icon and Header */}
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <span className={`${colors.icon} text-xl sm:text-2xl lg:text-3xl`}>{stat.icon}</span>
                {stat.trend && (
                  <div className={`text-xs font-semibold ${stat.trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trend.isPositive ? '↑' : '↓'} {stat.trend.value}%
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="mb-1 sm:mb-2">
                <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${colors.text}`}>{stat.value}</p>
              </div>

              {/* Label */}
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrackProgressStats
