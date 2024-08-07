import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

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

export const lambdaHandler = async (event: { body: string }): Promise<APIGatewayProxyResult> => {
    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const requestJSON = JSON.parse(event.body);
        console.log(event.body);
        console.log(requestJSON);
        body = await dynamo.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                    bookId: '02e05ed1-e02f-4f79-a4ec-1e63e1f67488',
                    title: requestJSON.title,
                    author: requestJSON.author,
                    publicationYear: requestJSON.publicationYear,
                },
            }),
        );
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                message: 'success',
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