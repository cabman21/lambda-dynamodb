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

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let body;
    let statusCode = 200;

    try {
        const { title } = event.queryStringParameters;
        console.log(title);

        body = await dynamo.send(
            new ScanCommand({
                ProjectionExpression: 'bookId, title, author, publicationYear',
                // FilterExpression: 'contains(#t, :t)',
                FilterExpression: 'begins_with(#t, :t)',
                ExpressionAttributeNames: { '#t': 'title' },
                ExpressionAttributeValues: { ':t': title },
                TableName: tableName,
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
