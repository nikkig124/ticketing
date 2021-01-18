import {Publisher, Subjects, TicketCreatedEvent} from '@ng-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;

}