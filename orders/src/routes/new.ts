import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@ng-tickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
// import { Orders } from '../models/order';
// import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ticketId must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        res.send({});
    },
);

export { router as createOrderRouter };
