import { DateTime } from "luxon";

function getCurrentWeekRange(zone = "America/Los_Angeles") {
  const now = DateTime.now().setZone(zone);

  // Luxon: weekday = 1 (Mon) ... 7 (Sun)
  const daysSinceSunday = now.weekday % 7;

  const start = now
    .minus({ days: daysSinceSunday })
    .startOf("day");

  const end = start
    .plus({ days: 6 })
    .endOf("day");

  return { start, end }; // DateTime objects
}

export default getCurrentWeekRange;