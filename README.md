# Lambda-DynamoDB

## SAM

### install SAM CLI
```bash
sam -version
```

### SAM init
```bash
sam init
```

### SAM build
```bash
sam build
```

### SAM deploy
```bash
sam deploy
```

### SAM local invoke
```bash
sam local invoke
sam local invoke -t build/template.yaml
sam local invoke "HelloWorldFunction" -e events/event.json
```

### SAM local start-api
```bash
sam local start-api
sam local start-api --port 3000
```

### SAM local start-lambda
```bash
sam local start-lambda
aws lambda invoke --function-name "HelloWorldFunction" --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl out.txt
```

### npm run test
```bash
cd hello-world && npm install
npm run test
```

## DynamoDB

### create table
```JSON
{
  "TableName":"book",
  "KeySchema":[
    {
      "AttributeName":"bookId",
      "KeyType":"HASH"
    }
  ],
  "AttributeDefinitions":[
    {
      "AttributeName":"bookId",
      "AttributeType":"S"
    }
  ],
  "ProvisionedThroughput":{
    "ReadCapacityUnits":5,
    "WriteCapacityUnits":5
  }
}
```
```bash
aws dynamodb create-table --cli-input-json file://table-script.json --endpoint-url https://dynamodb.ap-northeast-2.amazonaws.com
```
