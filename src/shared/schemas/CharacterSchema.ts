import { z } from "zod";
import { SupportedJobs, SupportedStates } from "../enums/Domains";

export const CreateCharacterAPISchema = z.object({
  name: z.string()
    .min(4, "Name must be at least 4 characters long")
    .max(15, "Name must be at most 15 characters long")
    .regex(/^[a-zA-Z_]+$/, "Name can only contain letters and underscores"),
  job: z.nativeEnum(SupportedJobs, {
    errorMap: () => ({ message: "Invalid job" }),
  }),
});


export const UpdateCharacterAPISchema = z.object({
  characterId: z.string().uuid("character uuid must be a valid uuid"),
  updates: z
    .object({
      name: z.string()
        .min(4, "Name must be at least 4 characters long")
        .max(15, "Name must be at most 15 characters long")
        .regex(/^[a-zA-Z_]+$/, "Name can only contain letters and underscores"),
      job: z.nativeEnum(SupportedJobs, {
        errorMap: () => ({ message: "Invalid job" }),
      }),

    })
    .strict()
    .refine((obj: any) => Object.keys(obj).length > 0, {
      message: "At least one update field is required",
    }),
});


export const GetCharactersAPISchema = z.object({
  status: z.nativeEnum(SupportedStates, {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  job: z.nativeEnum(SupportedJobs, {
    errorMap: () => ({ message: "Invalid job" }),
  }),
  limit: z.coerce.number().int().positive().optional(),
  descending: z.coerce.boolean().optional(),
});
