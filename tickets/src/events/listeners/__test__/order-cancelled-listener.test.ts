import { OrderCancelledEvent, OrderStatus } from '@ng-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });

    const orderId = new mongoose.Types.ObjectId().toHexString();

    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, ticket, orderId };
};

it('updates ticket, pub event and acks msg', async () => {
    const { msg, listener, data, ticket, orderId } = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket.orderId).not.toBeDefined();

    expect(msg.ack).toHaveBeenCalled();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
