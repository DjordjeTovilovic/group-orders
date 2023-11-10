export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface AppErrorArgs {
  name?: string;
  httpCode: HttpCode;
  description: string;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(description: string) {
    super({
      name: 'NOT FOUND',
      httpCode: HttpCode.NOT_FOUND,
      description,
      isOperational: true,
    });
  }
}

export class BadRequestError extends AppError {
  constructor(description: string) {
    super({
      name: 'BAD REQUEST',
      httpCode: HttpCode.BAD_REQUEST,
      description,
      isOperational: true,
    });
  }
}
