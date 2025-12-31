import { DateTime } from "luxon";   
function diffBetweenDays(a: string, b: string): number {
  const d1 = DateTime.fromFormat(a, "yyyy-MM-dd");
  const d2 = DateTime.fromFormat(b, "yyyy-MM-dd");

  return Math.round(d2.diff(d1, "days").days);
}

export default diffBetweenDays;