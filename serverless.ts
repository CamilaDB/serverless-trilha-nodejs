import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-trilha-nodejs',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', "serverless-dynamodb-local", 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    createTodo: {
      handler: "src/functions/createTodo.handler",
      events: [{
        http: {
          path: "todos/{user_id}",
          method: "POST",

          cors: true
        }
      }]
    },
    getTodo: {
      handler: "src/functions/getTodo.handler",
      events: [{
        http: {
          path: "todos/{user_id}",
          method: "GET",

          cors: true
        }
      }]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      }
    }
  },
  resources: {
    Resources: {
      dbTodoUsers: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "user-todo",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
           {
              AttributeName: "id",
              AttributeType: "S"
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            },
          ],
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
