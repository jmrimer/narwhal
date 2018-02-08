import EventRepository from '../EventRepository';
import EventModel from '../../models/EventModel';
import EventSerializer from '../../serializers/EventSerializer';
import * as Cookie from 'js-cookie';

export default class WebEventRepository implements EventRepository {
  private serializer: EventSerializer = new EventSerializer();
  private csrfToken: string;

  constructor(private baseUrl: string = '') {
    this.csrfToken = Cookie.get('XSRF-TOKEN') || '';
  }

  async save(event: EventModel): Promise<EventModel> {
    const resp = event.id ? await this.updateEvent(event) : await this.createEvent(event);
    let json = await resp.json();

    if (json.status === 400) {
      json = this.handleError(json, event);
    }
    return Promise.resolve(this.serializer.deserialize(json));
  }

  async delete(event: EventModel): Promise<void> {
    const resp = await fetch(
      `${this.baseUrl}/api/events/${event.id}`,
      {
        method: 'DELETE',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include'
      }
    );

    if (resp.status < 200 || resp.status >= 300) {
      throw new Error(`Unable to delete event with ID: ${event.id}`);
    }
  }

  handleError(response: { errors: object[] }, event: EventModel): EventModel {
    const errors = response.errors.map((error: { field: string }) => {
      return {[error.field]: 'Field is required'};
    });
    event.errors = errors;

    return event;
  }

  private createEvent(event: EventModel) {
    return fetch(
      `${this.baseUrl}/api/events`,
      {
        method: 'POST',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: this.serializer.serialize(event),
        credentials: 'include'
      }
    );
  }

  private updateEvent(event: EventModel) {
    return fetch(
      `${this.baseUrl}/api/events/${event.id}`,
      {
        method: 'PUT',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: this.serializer.serialize(event),
        credentials: 'include'
      }
    );
  }
}
