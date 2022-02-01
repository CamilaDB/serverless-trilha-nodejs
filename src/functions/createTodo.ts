import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbTodo";
import { v4 } from 'uuid';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, deadline } = JSON.parse(event.body);
  const { user_id } = event.pathParameters;
  const id = v4();

  const todo = {
    id,
    user_id,
    title,
    done: false,
    deadline: new Date(deadline).toUTCString(),
  }

  await document.put({
    TableName: "user-todo",
    Item: todo,
  }).promise();

  const res = await document.query({
    TableName: "user-todo",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  if (!res) {
    return {
      statusCode: 400,
      body: JSON.stringify({messge: "Could not create toDo"})
    }
  }

  return {
    statusCode: 201,
    body: JSON.stringify(res.Items[0])
  }

}