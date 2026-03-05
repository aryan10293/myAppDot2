import React, { useState } from 'react'

interface DayData {
  day: string
  completions: number
}

interface TrackProgressProductivityProps {
  data?: DayData[]
}

function TrackProgressProductivity({ data }: TrackProgressProductivityProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  // Default fake data if not provided
  const defaultData: DayData[] = [
    { day: 'Mon', completions: 8 },
    { day: 'Tue', completions: 12 },
    { day: 'Wed', completions: 5 },
    { day: 'Thu', completions: 20 },
    { day: 'Fri', completions: 15 },
    { day: 'Sat', completions: 3 },
    { day: 'Sun', completions: 10 },
  ]

  const displayData = data || defaultData

  // Calculate max value for responsive scaling
  const maxValue = Math.max(...displayData.map((d) => d.completions), 1)
  const roundedMax = Math.ceil(maxValue / 5) * 5

  const stats = {
    highest: Math.max(...displayData.map((d) => d.completions)),
    average: Math.round(displayData.reduce((sum, d) => sum + d.completions, 0) / displayData.length),
    total: displayData.reduce((sum, d) => sum + d.completions, 0),
  }

  return (
    <div className="px-3 sm:px-0 md:mx-auto md:max-w-6xl lg:mx-auto mb-12">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Weekly Activity</h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Your check-in patterns throughout the week</p>
        </div>

        {/* Bar Chart Container */}
        <div className="w-full mb-8">
          {/* Y-axis labels */}
          <div className="flex gap-4">
            {/* Y-axis column */}
            <div className="flex flex-col justify-between items-end w-12 pb-12">
              {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
                const value = Math.round(roundedMax * ratio)
                return (
                  <span key={`y-${ratio}`} className="text-xs text-gray-500 font-medium">
                    {value}
                  </span>
                )
              })}
            </div>

            {/* Chart area */}
            <div className="flex-1">
              {/* Grid background */}
              <div className="relative h-64 border-l border-b border-gray-300 mb-4">
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <div
                    key={`grid-${ratio}`}
                    className="absolute w-full border-t border-gray-200"
                    style={{
                      top: `${(1 - ratio) * 100}%`,
                      borderStyle: ratio === 0 ? 'solid' : 'dashed',
                    }}
                  ></div>
                ))}

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around gap-2 sm:gap-3 px-2 sm:px-4">
                {displayData.map((item, index) => {
                  const barHeight = (item.completions / roundedMax) * 100
                  const isHovered = hoveredDay === index

                  return (
                    <div key={`bar-${index}`} className="flex flex-col items-center gap-2 flex-1 min-w-0 h-full justify-end pb-0">
                      {/* Value label */}
                      <span
                        className={`text-xs sm:text-sm font-bold text-gray-900 transition-opacity absolute bottom-full mb-2 ${
                          isHovered ? 'opacity-100' : 'opacity-75'
                        }`}
                        style={{
                          bottom: `${barHeight}%`,
                        }}
                      >
                        {item.completions}
                      </span>

                      {/* Bar */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 cursor-pointer hover:shadow-lg"
                        style={{
                          height: `${barHeight}%`,
                          minHeight: item.completions > 0 ? '6px' : '0px',
                          transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                          filter: isHovered ? 'drop-shadow(0 8px 12px rgba(59, 130, 246, 0.4))' : 'none',
                          transformOrigin: 'bottom center',
                        }}
                        onMouseEnter={() => setHoveredDay(index)}
                        onMouseLeave={() => setHoveredDay(null)}
                      ></div>
                    </div>
                  )
                })}
              </div>
              </div>

              {/* Day labels */}
              <div className="flex justify-around gap-2 sm:gap-3 px-2 sm:px-4">
                {displayData.map((item, index) => (
                  <div key={`day-${index}`} className="flex-1 min-w-0 text-center">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* X-axis label */}
              <div className="text-center text-xs text-gray-500 font-medium mt-4">Days of Week</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-gray-200">
          {[
            { label: 'Peak Day', value: stats.highest, icon: '🔥', color: 'from-orange-400 to-red-500' },
            { label: 'Daily Avg', value: stats.average, icon: '📊', color: 'from-blue-400 to-blue-600' },
            { label: 'Total', value: stats.total, icon: '✓', color: 'from-emerald-400 to-teal-600' },
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-lg p-3 sm:p-4 text-white shadow-md`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg sm:text-xl">{stat.icon}</span>
                <p className="text-xs sm:text-sm font-medium opacity-90">{stat.label}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrackProgressProductivity
