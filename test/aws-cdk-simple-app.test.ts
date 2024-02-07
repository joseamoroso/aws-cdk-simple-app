import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as AwsCdkSimpleApp from '../lib/aws-cdk-simple-app-stack';

it('S3 Buckets con acceso publico bloqueado', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new AwsCdkSimpleApp.AwsCdkSimpleAppStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,        
    }
  });
});
