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

    const CharacterFunction = new lambdaNodeJs.NodejsFunction(
      this,
      'CharacterLambda',
      {
        runtime: Runtime.NODEJS_18_X,
        entry: 'src/presentation/lambda/CharacterLambda.ts',
        environment: {
          TABLE_NAME: 'CharactersTable',
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

    const CharacterFunctionIntegration = new HttpLambdaIntegration(
      "CharacterFunctionIntegration",
      CharacterFunction
    );

    HttpApiNeoRpg.addRoutes({
      path: "/character",
      methods: [HttpMethod.POST, HttpMethod.PUT],
      integration: CharacterFunctionIntegration,
    });

    HttpApiNeoRpg.addRoutes({
      path: "/characters",
      methods: [HttpMethod.GET],
      integration: CharacterFunctionIntegration,
    });

    HttpApiNeoRpg.addRoutes({
      path: "/character",
      methods: [HttpMethod.GET],
      integration: CharacterFunctionIntegration,
    });

    new cdk.CfnOutput(this, "NeoRpgApiUrl", {
      value: HttpApiNeoRpg.apiEndpoint,
      description: "The URL of the Neo RPG API",
    });
  }
}
