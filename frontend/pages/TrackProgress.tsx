import React from 'react'
import { useParams } from "react-router-dom";
import useOneGoal from '../customHook/getOneGoal';
import useTrackWeekData from '../customHook/useTrackWeekData';
import useWeeklyProgress from '../customHook/useWeeklyProgress';
function TrackProgress() {
  const { goalname } = useParams<{ goalname: string }>();
  const { data: goal, isLoading } = useOneGoal(goalname || '');
  //const { data: weekData, isLoading: isWeekDataLoading } = useTrackWeekData(goalname || '');
  
  const { data: weeklyProgress, isLoading: isWeeklyProgressLoading } = useWeeklyProgress({ goalname: goalname || ' ' });

if(isWeeklyProgressLoading) {
    return <div>Loading weekly progress...</div>;
}
  
  console.log("Goal Name:", goalname);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(goal);
  return (
    <div>
      hey does this work
    </div>
  )
}

export default TrackProgress
