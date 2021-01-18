import {Publisher, Subjects, TicketUpdatedEvent} from '@ng-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;

}