import { CharacterHandler } from "../../infrastructure/config/CharacterContainer";
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { withErrorHandling } from "../middlewares/ErrorMiddleware";

export const handler = withErrorHandling(
  (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> =>
    CharacterHandler.handler(event)
);
