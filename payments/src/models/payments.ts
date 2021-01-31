import mongoose from 'mongoose';
import { OrderStatus } from '@ng-tickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };
// interface that describes a user
interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

//interface that desctibes the props that a Payment Doc has
//single collection
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

//interface that desctibes props that a model has
//entire collction
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            require: true,
        },
        stripeId: {
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };