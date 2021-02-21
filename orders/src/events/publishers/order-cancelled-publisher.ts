import { Subjects, Publisher, OrderCancelledEvent } from '@ng-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
