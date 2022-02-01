import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbTodo"

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  let res = [];

  const params = {
    TableName: "user-todo",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    }
  }

  await document.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      res = data.Items;
    }
  }).promise();


  if (res.length == 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "User does not have toDo" })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  }
}