import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Logger } from "../../infrastructure/logger/Logger";
import { clientErrorResponse } from "../../shared/utilities/ResponseHelper";

export class RequestParserMiddleware {
  static parse(event: APIGatewayProxyEventV2) {
    let body: Record<string, any> = {};

    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (error) {
        Logger.error("Invalid JSON body", error);
        return {
          error: clientErrorResponse(400, "Invalid request body format"),
        };
      }
    }

    const queryParams: Record<string, string> = Object.fromEntries(
      Object.entries(event.queryStringParameters ?? {}).map(([key, value]) => [
        key,
        value ?? "",
      ])
    );

    const mergedInput = { ...body, ...queryParams };

    return { mergedInput };
  }
}
