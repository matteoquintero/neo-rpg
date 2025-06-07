import { ZodSchema } from "zod";
import { clientErrorResponse } from "../../shared/utilities/ResponseHelper";
import { APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../../infrastructure/logger/Logger";

export abstract class BaseValidationMiddleware {
  protected abstract readonly schemas: Record<string, ZodSchema<any>>;

  validate(
    method: string,
    path: string,
    input: Record<string, any>
  ): APIGatewayProxyResult | null {
    const key = `${method} ${path}`;
    const schema = this.schemas[key];
    if (!schema) return null;

    const result = schema.safeParse(input);
    if (!result.success) {
      const issues = result.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return clientErrorResponse(400, issues.join(" | "));
    }

    return null;
  }
}
