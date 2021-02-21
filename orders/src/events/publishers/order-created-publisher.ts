import { Publisher, OrderCreatedEvent, Subjects } from '@ng-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
