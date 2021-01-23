import mongoose, { Mongoose } from 'mongoose';

// interface that describes a user
interface OrderAttrs {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDoc;
}

//interface that desctibes props that a model has
//entire collction
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

//interface that desctibes the props that a Order Doc has
//single collection
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            require: true,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };