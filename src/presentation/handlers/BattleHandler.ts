import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { BattleRouter } from "../../presentation/router/BattleRouter";

export class BattleHandler {
  constructor(private readonly router: BattleRouter) { }

  async handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    return this.router.route(event);
  }
}
