function getCurrentWeekRange() {
  const now = new Date();

  // Use UTC day (0 = Sunday)
  const dayOfWeek = now.getUTCDay();

  // Start of week (Sunday UTC)
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() - dayOfWeek);
  start.setUTCHours(0, 0, 0, 0);

  // End of week (Saturday UTC)
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}
export default getCurrentWeekRange;