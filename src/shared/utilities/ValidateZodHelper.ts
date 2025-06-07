import { ZodSchema } from "zod";
import { ErrorHandler } from "../utilities/ErrorHandler";

export function validateZod<T>(input: unknown, schema: ZodSchema<T>): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join("; ");
    throw new ErrorHandler(errorMessage, 400);
  }

  return result.data;
}
