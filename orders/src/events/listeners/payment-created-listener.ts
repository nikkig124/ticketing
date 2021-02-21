import {
    Subjects,
    PaymentCreatedEvent,
    Listener,
    OrderStatus,
} from '@ng-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { orderId } = data;

        const order = Order.findById(orderId);

        if (!order) {
            throw new Error('order not found');
        }

        order.set({
            status: OrderStatus.Complete,
        });

        await order.save();

        msg.ack();
    }
}