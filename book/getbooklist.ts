import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = 'book';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let body;
    let statusCode = 200;

    try {
        // const { title } = event.queryStringParameters;
        const title = event.queryStringParameters.title;

        body = await dynamo.send(
            new ScanCommand({
                TableName: tableName,
                // FilterExpression: 'title = :title',
                // ExpressionAttributeValues: {
                //     ':title': { S: title },
                // },,
                // FilterExpression: `contains(title, ${title})`,
            }),
        );
        console.log(body);
        console.log(body.Items);
        return {
            statusCode: statusCode,
            body: JSON.stringify(body.Items),
        };
    } catch (err) {
        statusCode = 500;
        console.log(err);
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
