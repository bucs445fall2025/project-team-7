import { ZodError } from "zod";

/**
 * Formats Zod validation errors into a user-friendly error message
 * 
 * @param error - ZodError object from validation
 * @returns Formatted error message string
 */
export function formatValidationError(error: ZodError): string {
  const errors = error.flatten();
  return (
    errors.formErrors?.[0] ||
    Object.values(errors.fieldErrors || {}).flat()[0] ||
    "Invalid request data"
  );
}



