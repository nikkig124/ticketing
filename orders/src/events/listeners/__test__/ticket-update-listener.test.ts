import { TicketUpdatedEvent } from '@ng-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-update-listener';

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const oldTicket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await oldTicket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: oldTicket.id,
        title: 'new concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: oldTicket.version + 1,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, oldTicket };
};

it('finds, update and saves a ticket', async () => {
    const { msg, listener, data, oldTicket } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(oldTicket.id);

    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(data.title);
    expect(ticket.price).toEqual(data.price);
    expect(ticket.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { msg, listener, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if version number is wrong', async () => {
    const { msg, listener, data } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
