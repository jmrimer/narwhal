import * as React from 'react';
import { Moment } from 'moment';
import styled from 'styled-components';
import EventModel from '../event/models/EventModel';
import AvailabilityTile from './AvailabilityTile';
import EventForm from '../event/EventForm';
import { observer } from 'mobx-react';
import TrackerStore from '../tracker/stores/TrackerStore';
import NextIcon from '../icons/NextIcon';
import { doesDayHaveEvent } from '../utils/eventUtil';
import BackIcon from '../icons/BackIcon';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  showEventForm: boolean;
}

@observer
export class Availability extends React.Component<Props, State> {
  state: State = {showEventForm: false};

  componentWillReceiveProps() {
    if (this.props.trackerStore.selectedEvent == null) {
      this.setState({showEventForm: false});
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.showEventForm ? this.renderEventForm() : this.renderAvailability()}
      </div>
    );
  }

  private renderEventForm = () => {
    return (
      <EventForm
        airmanId={this.props.trackerStore.selectedAirman.id}
        hideEventForm={this.closeEventForm}
        handleSubmit={this.submitAndCloseEventForm}
        event={this.props.trackerStore.selectedEvent}
        missions={this.props.trackerStore.missions}
        missionOptions={this.props.trackerStore.missionOptions}
      />
    );
  }

  private submitAndCloseEventForm = async (event: EventModel) => {
    const response = await this.props.trackerStore.addEvent(event);
    if (!response.errors) {
      this.closeEventForm();
    }
  }

  private closeEventForm = () => {
    this.props.trackerStore.clearSelectedEvent();
    this.setState({showEventForm: false});
  }

  private renderAvailability = () => {
    const {trackerStore} = this.props;
    const week = trackerStore.sidePanelWeek;
    return (
      <div>
        <div className="event-control-row">
          <button className="add-event" onClick={this.openEventFormForCreate}>
            + Add Event
          </button>
        </div>
        <div className="nav-row">
          <button className="last-week" onClick={trackerStore.decrementSidePanelWeek}>
            <BackIcon width={12} height={12}/>
          </button>
          <h3>
            {week[0].format('DD MMM').toUpperCase()} - {week[6].format('DD MMM').toUpperCase()}
          </h3>
          <button className="next-week" onClick={trackerStore.incrementSidePanelWeek}>
            <NextIcon width={12} height={12}/>
          </button>
        </div>
        <div className="availability">
          {
            trackerStore.sidePanelWeek.map((day, index) => {
              return (
                <div id={`day-${index}`} key={index}>
                  <div className="event-date">{day.format('ddd, DD MMM YY').toUpperCase()}</div>
                  {this.scheduledEventsForDate(day.utc(), trackerStore.selectedAirman.events)}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  private scheduledEventsForDate = (day: Moment, events: EventModel[]) => {
    const eventsForDay = events.filter(event => doesDayHaveEvent(day, event));
    return eventsForDay.length === 0
      ? <div className="event-name">No Events Scheduled</div>
      : eventsForDay.map((event, index) => {
        return (
          <AvailabilityTile
            key={index}
            event={event}
            deleteEvent={this.props.trackerStore.setPendingDeleteEvent}
            editEvent={this.openEventFormForEdit}
          />
        );
      });
  }

  private openEventFormForCreate = () => {
    this.props.trackerStore.clearSelectedEvent();
    this.setState({showEventForm: true});
  }

  private openEventFormForEdit = (event: EventModel) => {
    this.props.trackerStore.setSelectedEvent(event);
    this.setState({showEventForm: true});
  }
}

export default styled(Availability)`
  width: 100%;
  text-align: center;

  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }

  .event-control-row {
    display: flex;
    justify-content: flex-end;

    .add-event {
      font-size: 12px;
      margin: 0.5rem 1rem;
      color: ${props => props.theme.fontColor};
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
     
      :hover{
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
      }
     }
  }

  .event-date {
    text-align: left;
    font-size: 0.75rem;
    margin-top: 1.5rem;
  }

  .event-name {
    color: ${props => props.theme.graySteel};
    border-bottom: ${props => props.theme.graySteel} 1px solid;
    margin: 1.5rem 20%;
  }
  
  .nav-row {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
   
    button {
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
    }
  }
  `;