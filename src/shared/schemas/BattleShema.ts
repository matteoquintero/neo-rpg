import { z } from "zod";
import { SupportedJobs } from "../enums/Domains";

export const CreateBattleAPISchema = z.object({
  characterXId: z.string().uuid("characterX uuid must be a valid uuid"),
  characterXJob: z.nativeEnum(SupportedJobs, {
    errorMap: () => ({ message: `Invalid job. Supported jobs are: ${Object.values(SupportedJobs).join(', ')}` }),
  }),
  characterYId: z.string().uuid("characterY uuid must be a valid uuid"),
  characterYJob: z.nativeEnum(SupportedJobs, {
    errorMap: () => ({ message: `Invalid job. Supported jobs are: ${Object.values(SupportedJobs).join(', ')}` }),
  }),
});

export const GetBattleAPISchema = z.object({
  battleId: z.string().uuid("battle uuid must be a valid uuid"),
  characterXId: z.string().uuid("characterX uuid must be a valid uuid"),
  characterYId: z.string().uuid("characterY uuid must be a valid uuid"),
});
