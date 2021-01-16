import mongoose from 'mongoose';

// interface that describes a user
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

//interface that desctibes props that a model has
//entire collction
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

//interface that desctibes the props that a Ticket Doc has
//single collection
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    createdAt: string;
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
        },
        userId: {
            type: String,
            require: true,
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

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
