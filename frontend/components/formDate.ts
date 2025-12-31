function formDate(dateStr: string): string {
  // Force parse as local midnight so JS doesn't shift the day
  const [year, month, day] = dateStr.split("-").map(Number);

  if (!year || !month || !day) return "Invalid date";

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
export default formDate;