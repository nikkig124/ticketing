import { Subjects, Publisher, OrderCancelledEvent } from '@ng-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
