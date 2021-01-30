import {
    Publisher,
    Subjects,
    ExpirationCompleteEvent,
} from '@ng-tickets/common';

Subjects;
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
