import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// interface that describes a user
interface TicketAttrs {
    title: string;
    price: number;
}

//interface that desctibes the props that a Ticket Doc has
//single collection
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

//interface that desctibes props that a model has
//entire collction
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    },
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });

    //if null, flipped to true, then flipped to false
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
