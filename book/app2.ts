import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamo = new AWS.DynamoDB.DocumentClient();

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
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const requestJSON = JSON.parse(event.body);
        console.log(event.body);
        console.log(requestJSON);
        await dynamo
            .put({
                TableName: 'book',
                Item: {
                    bookId: uuid(),
                    title: requestJSON.title,
                    author: requestJSON.author,
                    publicationYear: requestJSON.publicationYear,
                },
            })
            .promise();
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
