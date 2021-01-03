import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
    statusCode = 400;

    constructor() {
        super('route not found');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    seralizeErrors() {
        return [{ message: 'Not Found' }];
    }
}
