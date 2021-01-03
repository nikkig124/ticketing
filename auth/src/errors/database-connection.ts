import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'error connecting to DB';

    constructor() {
        super('error connecting to DB');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    seralizeErrors() {
        return [{ message: this.reason }];
    }
}
