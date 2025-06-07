export class ErrorHandler extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, ErrorHandler);
  }

  static handleError(error: unknown): { statusCode: number; body: string } {
    if (error instanceof ErrorHandler) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    if (error instanceof ValidationError) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof UnauthorizedError) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof ForbiddenError) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: error.message }),
      };
    }

    console.error("Unhandled error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}

export class ValidationError extends ErrorHandler {
  constructor(message = "Validation error") {
    super(message, 422);
  }
}

export class UnauthorizedError extends ErrorHandler {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends ErrorHandler {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends ErrorHandler {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}
