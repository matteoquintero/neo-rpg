import { BaseValidationMiddleware } from "./BaseValidationMiddleware";
import {
  CreateCharacterAPISchema,
  GetCharacterAPISchema,
  UpdateCharacterAPISchema,
} from "../../shared/schemas/CharacterSchema";

export class CharacterMiddleware extends BaseValidationMiddleware {
  protected readonly schemas = {
    "POST /character": CreateCharacterAPISchema,
    "PUT /character": UpdateCharacterAPISchema,
    "GET /character": GetCharacterAPISchema,
  };
}
