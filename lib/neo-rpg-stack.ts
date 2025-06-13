import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class NeoRpgStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'NeoRpgTable';

    const NeoRpgFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'NeoRpgLambda',
      {
        runtime: Runtime.NODEJS_18_X,
        entry: 'src/presentation/lambda/NeoRpgLambda.ts',
        environment: {
          NEO_RPG_TABLE_NAME: tableName,
        },
      }
    );

    const HttpApiNeoRpg = new HttpApi(this, 'NeoRpgApi', {
      apiName: 'Neo RPG API',
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
        ],
        allowHeaders: ["Authorization", "Content-Type"],
      },
    });

    const NeoRpgFunctionIntegration = new HttpLambdaIntegration(
      "NeoRpgFunctionIntegration",
      NeoRpgFunction
    );

    // Rutas de personajes
    HttpApiNeoRpg.addRoutes({
      path: "/character",
      methods: [HttpMethod.POST, HttpMethod.PUT],
      integration: NeoRpgFunctionIntegration,
    });

    HttpApiNeoRpg.addRoutes({
      path: "/characters",
      methods: [HttpMethod.GET],
      integration: NeoRpgFunctionIntegration,
    });

    HttpApiNeoRpg.addRoutes({
      path: "/character",
      methods: [HttpMethod.GET],
      integration: NeoRpgFunctionIntegration,
    });

    // Rutas de batallas
    HttpApiNeoRpg.addRoutes({
      path: "/battle",
      methods: [HttpMethod.POST, HttpMethod.PUT],
      integration: NeoRpgFunctionIntegration,
    });

    HttpApiNeoRpg.addRoutes({
      path: "/battle",
      methods: [HttpMethod.GET],
      integration: NeoRpgFunctionIntegration,
    });

    HttpApiNeoRpg.addRoutes({
      path: "/battles",
      methods: [HttpMethod.GET],
      integration: NeoRpgFunctionIntegration,
    });

    new cdk.CfnOutput(this, "NeoRpgApiUrl", {
      value: HttpApiNeoRpg.apiEndpoint,
      description: "The URL of the Neo RPG API",
    });
  }
}
