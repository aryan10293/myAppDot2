function convertUtcToTimeZone(
  utcTime: string | number | Date,
  timeZone: string
) {
  // Normalize input into a Date that represents a UTC instant
  let date: Date;

  if (utcTime instanceof Date) {
    date = utcTime;
  } else if (typeof utcTime === "number") {
    date = new Date(utcTime); // epoch ms
  } else if (typeof utcTime === "string") {
    // If it's missing a timezone, treat it as UTC by appending "Z"
    // e.g. "2025-12-23T02:09:01.605" -> "2025-12-23T02:09:01.605Z"
    // also supports "2025-12-23 02:09:01.605" -> "2025-12-23T02:09:01.605Z"
    const trimmed = utcTime.trim();
    const hasZone =
      /[zZ]$/.test(trimmed) || /[+\-]\d{2}:\d{2}$/.test(trimmed);

    const isoLike = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
    const normalized = hasZone ? isoLike : `${isoLike}Z`;

    date = new Date(normalized);
  } else {
    throw new TypeError("utcTime must be a string, number (ms), or Date");
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(
      `Invalid utcTime input. Received: ${String(utcTime)}`
    );
  }

  // Validate timezone
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(date);
  } catch {
    throw new RangeError(
      `Invalid timeZone "${timeZone}". Use an IANA zone like "America/Los_Angeles".`
    );
  }

  // Extract parts in the target timezone
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = dtf.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;

  const outParts = {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };

  // Useful formatted strings
  const isoLocal =
    `${outParts.year}-${String(outParts.month).padStart(2, "0")}-${String(
      outParts.day
    ).padStart(2, "0")}T${String(outParts.hour).padStart(2, "0")}:${String(
      outParts.minute
    ).padStart(2, "0")}:${String(outParts.second).padStart(2, "0")}`;

  const dateOnly =
    `${outParts.year}-${String(outParts.month).padStart(2, "0")}-${String(
      outParts.day
    ).padStart(2, "0")}`;

  const timeOnly =
    `${String(outParts.hour).padStart(2, "0")}:${String(
      outParts.minute
    ).padStart(2, "0")}:${String(outParts.second).padStart(2, "0")}`;

  return {
    inputUtcISO: date.toISOString(), // the true UTC instant
    timeZone,
    parts: outParts, // numeric parts in target zone
    isoLocal, // "YYYY-MM-DDTHH:mm:ss" in target zone (no offset)
    dateOnly, // "YYYY-MM-DD" in target zone
    timeOnly, // "HH:mm:ss" in target zone
  };
}

export default convertUtcToTimeZone;   