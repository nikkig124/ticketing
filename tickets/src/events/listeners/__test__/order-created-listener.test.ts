import { OrderCreatedEvent, OrderStatus } from '@ng-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'asddfdf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, ticket };
};

it('finds, update and saves a ticket', async () => {
    const { msg, listener, data, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { msg, listener, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { msg, listener, data, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdated = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdated.orderId);

});
