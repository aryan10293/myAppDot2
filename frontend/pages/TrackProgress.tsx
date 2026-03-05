import React from 'react'
import TrackProgressHeader from '../components/TrackProgressHeader'
import TrackProgressStats from '../components/TrackProgressStats'
import TrackProgressProductivity from '../components/TrackProgressProductivity'
function TrackProgress() {
  return (
    <div>
      <TrackProgressHeader completed={5} total={5} goalName="Project Alpha" />
      <TrackProgressStats />
      <TrackProgressProductivity />
    </div>
  )
}

export default TrackProgress
