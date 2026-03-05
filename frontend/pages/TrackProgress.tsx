import React from 'react'
import TrackProgressHeader from '../components/TrackProgressHeader'
import TrackProgressStats from '../components/TrackProgressStats'
function TrackProgress() {
  return (
    <div>
      <TrackProgressHeader completed={5} total={5} goalName="Project Alpha" />
      <TrackProgressStats />
    </div>
  )
}

export default TrackProgress
