import { APIGatewayProxyResult } from "aws-lambda";
import { successResponse } from "../../shared/utilities/ResponseHelper";
import { CharacterUseCase } from "../../application/cases/CharacterUseCase";
import { CharacterMiddleware } from "../middlewares/CharacterMiddleware";
import {
  CreateBattleInput,
  GetBattleInput,
} from "../../application/dto/BattleDto";
import { BaseRouter } from "./BaseRouter";
import { BattleMiddleware } from "../middlewares/BattleMiddleware";
import { BattleUseCase } from "../../application/cases/BattleUseCase";

export class BattleRouter extends BaseRouter {
  private validationMiddleware: BattleMiddleware;

  constructor(private readonly useCase: BattleUseCase) {
    super();
    this.validationMiddleware = new BattleMiddleware();
  }

  validateRequest(
    method: string,
    path: string,
    input: Record<string, any>
  ): APIGatewayProxyResult | null {
    return this.validationMiddleware.validate(method, path, input);
  }

  getRouteHandler(
    method: string,
    path: string,
    input: Record<string, any>
  ): (() => Promise<APIGatewayProxyResult>) | undefined {
    const routes = new Map<string, () => Promise<APIGatewayProxyResult>>([
      [
        "POST /battle",
        async () => {
          const battle = await this.useCase.createBattle(
            input as CreateBattleInput
          );
          return successResponse(201, {
            battle,
            message: "Battle created successfully",
          });
        },
      ],
      [
        "GET /battle",
        async () => {
          const battle = await this.useCase.getBattle(
            input as GetBattleInput
          );
          return successResponse(200, { battle });
        },
      ],
      [
        "GET /battles",
        async () => {
          const battles = await this.useCase.getBattles();
          return successResponse(200, { battles });
        },
      ]
    ]);

    return routes.get(`${method} ${path}`);
  }
}
