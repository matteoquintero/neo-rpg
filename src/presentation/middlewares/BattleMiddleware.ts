import { BaseValidationMiddleware } from "./BaseValidationMiddleware";
import {
  CreateBattleAPISchema,
  GetBattleAPISchema,
} from "../../shared/schemas/BattleShema";

export class BattleMiddleware extends BaseValidationMiddleware {
  protected readonly schemas = {
    "POST /battle": CreateBattleAPISchema,
    "GET /battle": GetBattleAPISchema,
  };
}
