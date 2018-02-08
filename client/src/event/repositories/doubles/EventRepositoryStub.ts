import EventRepository from '../EventRepository';
import EventModel from '../../models/EventModel';

export default class EventRepositoryStub implements EventRepository {
  private static counter: number = 0;
  private _events: EventModel[] = [];

  save(event: EventModel): Promise<EventModel> {
    let copy = Object.assign({}, event);
    if (!event.id) {
      copy.id = ++EventRepositoryStub.counter;
      this._events.push(copy);
    }

    if (event.title.length === 0) {
      const resp = {
        errors: [
          {
            defaultMessage: 'size must be between 1 and 2147483647',
            field: 'title',
            rejectedValue: '',
            bindingFailure: false,
            code: 'Size'
          }
        ],
      };
      copy = this.handleError(resp, event);
    }

    return Promise.resolve(copy);
  }

  delete(event: EventModel): Promise<void> {
    delete this._events[this._events.findIndex(e => e.id === event.id)!];
    return Promise.resolve();
  }

  hasEvent(event: EventModel) {
    return this._events.map(e => e.id).includes(event.id);
  }

  handleError(response: {errors: object[]}, event: EventModel): EventModel {
    const errors = response.errors.map((error: {field: string}) => {
      return {[error.field]: 'Field is reqiured'};
    });
    event.errors = errors;
    return event;
  }

  get count() {
    return this._events.length;
  }
}
