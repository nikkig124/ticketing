import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
    statusCode = 401;
    constructor() {
        super('Not Authorized');

        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    seralizeErrors() {
        return [{message: this.message}];
    }
}