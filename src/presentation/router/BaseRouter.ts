import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../../infrastructure/logger/Logger";
import { clientErrorResponse } from "../../shared/utilities/ResponseHelper";
import { RequestParserMiddleware } from "../middlewares/RequestParserMiddleware";

export abstract class BaseRouter {

  constructor() {
  }

  abstract validateRequest(
    method: string,
    path: string,
    input: Record<string, any>
  ): APIGatewayProxyResult | null;

  abstract getRouteHandler(
    method: string,
    path: string,
    input: Record<string, any>
  ): (() => Promise<APIGatewayProxyResult>) | undefined;

  async route(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    Logger.info("Received event", event);

    const { mergedInput, error } = RequestParserMiddleware.parse(event);
    if (error) return error;

    const { method, path } = event.requestContext.http;

    const validationError = this.validateRequest(method, path, mergedInput);
    if (validationError) return validationError;

    const routeHandler = this.getRouteHandler(method, path, mergedInput);

    if (!routeHandler) return clientErrorResponse(405, "Method Not Allowed");

    return routeHandler();
  }
}
