import { IncomingMessage, ServerResponse } from 'http';

// Define the exact shape of the JSON object this function returns.
interface JsonResponse {
  message: string;
  status: string;
  environment: string;
}

/**
 * Handles incoming HTTP requests and sends a JSON response.
 * @param req The incoming request object.
 * @param res The server response object.
 */
export default function handler(
  req: IncomingMessage,
  res: ServerResponse
): void {
  // Always set the content type to application/json
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200; // HTTP status 200 (OK)

  // Define the JSON data object using the interface
  const data: JsonResponse = {
    message: 'Hello World! (TypeScript Serverless Function)',
    status: 'success',
    environment: 'Vercel Serverless Function',
  };

  // Stringify the object and send the response
  res.end(JSON.stringify(data));
}
