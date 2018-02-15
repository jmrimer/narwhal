import { EventRepository } from './EventRepository';
import * as moment from 'moment';
import { EventModel, EventType } from '../models/EventModel';

export function EventRepositoryContract(subject: EventRepository) {
  describe('save', () => {
    let savedEvent1: EventModel;
    const dateTime = moment().subtract(1, 'year');

    beforeEach(async () => {
      const event1 = new EventModel('title1', 'description1', dateTime, dateTime, 1, EventType.Leave);
      savedEvent1 = await subject.save(event1);
    });

    it('returns an event with a unique id', async () => {
      expect(savedEvent1.id).toBeDefined();

      const event2 = new EventModel('title2', 'description2', dateTime, dateTime, 1, EventType.Mission);
      const savedEvent2 = await subject.save(event2);
      expect(savedEvent2.id).toBeDefined();

      expect(savedEvent1.id).not.toBe(savedEvent2.id);
    });

    it('updates an event that has an existing id', async () => {
      savedEvent1.title = 'Updated Title';
      const updatedEvent1 = await subject.save(savedEvent1);
      expect(savedEvent1.id).toBe(updatedEvent1.id);
      expect(updatedEvent1.title).toBe('Updated Title');
    });

    describe('validation', () => {
      it('correctly handles validations from the server', async () => {
        const event = new EventModel('', 'description1', moment(), moment(), 1, EventType.Leave);
        try {
          await subject.save(event);
        } catch (errors) {
          expect(errors).toEqual([{title: 'Field is required'}]);
        }
      });

      it('correctly handles blank submissions from the server', async () => {
        const event = new EventModel('', 'description1', moment(), moment(), 1);
        try {
          await subject.save(event);
        } catch (errors) {
          expect(errors).toEqual([{title: 'Field is required'}]);
        }
      });
    });
  });

  describe('delete', () => {
    it('deletes an event without exception', async () => {
      const event = new EventModel('title1', 'description1', moment(), moment(), 1, EventType.Leave);
      const savedEvent = await subject.save(event);
      await subject.delete(savedEvent);
    });

    it('does not delete event with an exception', async () => {
      try {
        const event = new EventModel(
          'title1',
          'description1',
          moment(),
          moment(),
          1,
          EventType.Appointment,
          -1
        );
        await subject.delete(event);
      } catch (e) {
        expect(e).toBeDefined();
        return;
      }
      throw new Error('Should have failed to delete the event');
    });
  });

}
