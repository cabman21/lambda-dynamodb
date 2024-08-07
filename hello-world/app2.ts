import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

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
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const requestJSON = JSON.parse(event.body);
        await dynamo.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                    id: requestJSON.id,
                    price: requestJSON.price,
                    name: requestJSON.name,
                },
            }),
        );
        body = `Put item ${requestJSON.id}`;
        console.log(body);
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                message: 'hello world',
            }),
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
