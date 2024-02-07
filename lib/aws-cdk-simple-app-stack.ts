import { Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import {
  Bucket,
  BlockPublicAccess,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export class AwsCdkSimpleAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Bucket S3 utilizado por la app para subir archivos
    const s3 = new Bucket(this, "Bucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Funcion lambda: que será utilizada cada que un archivo sea agregado al bucket
    const lambdaFunction = new NodejsFunction(this, "LambdaFunction", {
      entry: "lambda/handler.ts",
      handler: "handler",
      timeout: Duration.seconds(10),
      memorySize: 128,
    });

    // Permisos para que la funcion lambda pueda subir archivos al bucket.
    lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${s3.bucketArn}/*`],
      })
    );

    // Asociacion entre el bucket y la funcion lambda: cuando un archivo se agregue al bucket, se ejecuta la funcion lambda.
    s3.addObjectCreatedNotification(new LambdaDestination(lambdaFunction));

    if (props?.env?.region === "us-west-1") {
      new StringParameter(this, "BucketNameParameter", {
        parameterName: "BucketNameParam",
        stringValue: s3.bucketName,
        description: "Nombre del bucket creado",
      });
    }
  }
}
