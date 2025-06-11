import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { withErrorHandling } from "../middlewares/ErrorMiddleware";
import { CharacterHandlerObject } from "../../infrastructure/config/CharacterContainer"

export const handler = withErrorHandling(
  (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> =>
    CharacterHandlerObject.handler(event)
);
