import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { CharacterRouter } from "../router/CharacterRouter";

export class CharacterHandler {
  constructor(private readonly router: CharacterRouter) { }

  async handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    return this.router.route(event);
  }
}
