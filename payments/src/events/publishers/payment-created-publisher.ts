import { Subjects, PaymentCreatedEvent, Publisher } from "@ng-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
