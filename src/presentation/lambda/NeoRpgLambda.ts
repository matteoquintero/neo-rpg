import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { withErrorHandling } from "../middlewares/ErrorMiddleware";
import { CharacterHandlerObject, BattleHandlerObject } from "../../infrastructure/config/NeoRpgContainer";
import { Logger } from "../../infrastructure/logger/Logger";

const ROUTES = {
  CHARACTER: {
    paths: ['/character', '/characters'],
    handler: CharacterHandlerObject.handler.bind(CharacterHandlerObject)
  },
  BATTLE: {
    paths: ['/battle', '/battles'],
    handler: BattleHandlerObject.handler.bind(BattleHandlerObject)
  }
} as const;

const routeToHandler = (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  const path = event.rawPath;
  Logger.info(`Path: ${path}`);

  if (ROUTES.CHARACTER.paths.some(route => path.startsWith(route))) {
    Logger.info(`Character handler`);
    return ROUTES.CHARACTER.handler(event);
  }

  if (ROUTES.BATTLE.paths.some(route => path.startsWith(route))) {
    Logger.info(`Battle handler`);
    return ROUTES.BATTLE.handler(event);
  }

  throw new Error(`No handler found for path: ${path}`);
};

export const handler = withErrorHandling(routeToHandler);
