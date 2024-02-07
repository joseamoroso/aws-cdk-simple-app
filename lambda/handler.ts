export const handler = async (event: any) => {
  console.log(`Archivo ${event.Records[0].s3.object.key} subido correctamente a ${event.Records[0].s3.bucket.name}`)
  console.log('## EVENT: ' + JSON.stringify(event))
    return {
    statusCode: 200,
  };
} 