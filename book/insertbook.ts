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

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let statusCode = 200;

    // Check if request body is provided
    if (!event.body) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { title, author, publicationYear } = body;
        console.log(event.body);
        const bookId = uuid();
        await dynamo.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                    bookId: bookId,
                    title: title,
                    author: author,
                    publicationYear: publicationYear,
                },
            }),
        );
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                message: 'success',
                bookId: bookId,
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
