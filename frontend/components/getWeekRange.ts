function getCurrentWeekRange() {
  const today = new Date();

  // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = today.getDay();

  // Calculate start (Sunday)
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);

  // Calculate end (Saturday)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}
export default getCurrentWeekRange;