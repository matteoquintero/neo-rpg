import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../../infrastructure/logger/Logger";
import { ErrorHandler } from "../../shared/utilities/ErrorHandler";

export const withErrorHandling =
  (
    handler: (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResult>
  ) =>
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    try {
      return await handler(event);
    } catch (error) {
      Logger.error("Unhandled Error", error);
      return ErrorHandler.handleError(error);
    }
  };
