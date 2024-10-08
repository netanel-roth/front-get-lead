import React, { useState } from 'react';

// קבועים המייצגים קודי HTTP בתור enum ב-Typescript
enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,

  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Redirection
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  // Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,

  // Server Error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// ממשק למידע של request
interface RequestData {
  method: string;
  body?: any;
  format?: string;
}

// ממשק למידע של response
interface ResponseData {
  format?: string;
  lang?: string;
  statusCode: HttpStatus;
  body?: any;
}

const RestController: React.FC = () => {
  // סטייטים לניהול הבקשות והתשובות
  const [request, setRequest] = useState<RequestData | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);

  // פונקציה שמדמה בקשת HTTP
  const makeRequest = (method: string, body?: any, format?: string) => {
    setRequest({ method, body, format });

    // סימולציה של תגובה לפי קוד HTTP
    let statusCode: HttpStatus = HttpStatus.OK;
    if (method === 'POST') {
      statusCode = HttpStatus.CREATED;
    } else if (method === 'GET') {
      statusCode = HttpStatus.OK;
    } else {
      statusCode = HttpStatus.BAD_REQUEST;
    }

    setResponse({
      format: 'json',
      lang: 'en',
      statusCode,
      body: { message: 'Response from server' },
    });
  };

  return (
    <div>
      <h1>REST Controller Simulation</h1>
      <button onClick={() => makeRequest('GET')}>Send GET Request</button>
      <button onClick={() => makeRequest('POST', { data: 'Sample Data' })}>
        Send POST Request
      </button>
      <button onClick={() => makeRequest('DELETE')}>Send DELETE Request</button>

      <h2>Request</h2>
      {request && (
        <div>
          <p>Method: {request.method}</p>
          {request.body && <p>Body: {JSON.stringify(request.body)}</p>}
          <p>Format: {request.format}</p>
        </div>
      )}

      <h2>Response</h2>
      {response && (
        <div>
          <p>Status Code: {response.statusCode}</p>
          <p>Response Body: {JSON.stringify(response.body)}</p>
        </div>
      )}
    </div>
  );
};

export default RestController;
