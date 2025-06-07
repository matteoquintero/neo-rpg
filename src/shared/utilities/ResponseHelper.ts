import { APIGatewayProxyResult } from "aws-lambda";

export const successResponse = (
  statusCode: number,
  data: object
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(data),
});

export const clientErrorResponse = (
  statusCode: number,
  message: string
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({ error: message }),
});
