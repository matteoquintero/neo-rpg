import { APIGatewayProxyResult } from "aws-lambda";
import { successResponse } from "../../shared/utilities/ResponseHelper";
import { CharacterUseCase } from "../../application/cases/CharacterUseCase";
import { BaseRouter } from "./BaseRouter";
import { CharacterMiddleware } from "../middlewares/CharacterMiddleware";
import {
  CreateCharacterInput,
  GetCharacterInput,
  UpdateCharacterInput,
} from "../../application/dto/CharacterDto";

export class CharacterRouter extends BaseRouter {
  private validationMiddleware: CharacterMiddleware;

  constructor(private readonly useCase: CharacterUseCase) {
    super();
    this.validationMiddleware = new CharacterMiddleware();
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
        "POST /character",
        async () => {
          const character = await this.useCase.createCharacter(
            input as CreateCharacterInput
          );
          return successResponse(201, {
            character,
            message: "character created successfully",
          });
        },
      ],
      [
        "PUT /character",
        async () => {
          const character = await this.useCase.updateCharacter(
            input as UpdateCharacterInput
          );
          return successResponse(200, {
            character,
            message: "character updated successfully",
          });
        },
      ],
      [
        "GET /characters",
        async () => {
          const characters = await this.useCase.getCharacter(
            input as GetCharacterInput
          );
          return successResponse(200, { characters });
        },
      ],
    ]);

    return routes.get(`${method} ${path}`);
  }
}
