/**
 * Parses a date string into a Date object
 * Handles both date-only (YYYY-MM-DD) and datetime strings
 * 
 * @param dateStr - Date string to parse (can be null or undefined)
 * @returns Parsed Date object or null if invalid/empty
 */
export function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== "string" || dateStr.trim() === "") {
    return null;
  }
  
  const trimmed = dateStr.trim();
  
  // If it's just a date (YYYY-MM-DD), add time to make it a valid datetime
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed + "T00:00:00");
  }
  
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Validates that start date is not after end date
 * 
 * @param startDate - Start date to validate
 * @param endDate - End date to validate
 * @returns Error message if invalid, null if valid
 */
export function validateDateRange(
  startDate: Date | null,
  endDate: Date | null
): string | null {
  if (startDate && endDate && startDate > endDate) {
    return "Start date cannot be after end date";
  }
  return null;
}



