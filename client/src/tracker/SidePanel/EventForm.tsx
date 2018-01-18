import * as React from 'react';
import EventModel from '../../event/EventModel';
import * as moment from 'moment';
import styled from 'styled-components';

interface Props {
  airmanId: number;
  handleSubmit: (event: EventModel) => void;
  className?: string;
}

interface State {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class EventForm extends React.Component<Props, State> {
  state = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  };

  /* tslint:disable:no-any*/
  handleChange = (event: any) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (event: any) => {
    event.preventDefault();

    const {airmanId} = this.props;
    const {title, description, startDate, startTime, endDate, endTime} = this.state;

    const startDateTime = moment.utc(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const endDateTime = moment.utc(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

    this.props.handleSubmit(new EventModel(
      title,
      description,
      startDateTime,
      endDateTime,
      airmanId
    ));
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Title" value={this.state.title} name="title" onChange={this.handleChange}/>
        <input
          type="text"
          placeholder="Description"
          value={this.state.description}
          name="description"
          onChange={this.handleChange}
        />
        <div className="date-time-row">
          <input type="date" value={this.state.startDate} name="startDate" onChange={this.handleChange}/>
          <input type="time" value={this.state.startTime} name="startTime" onChange={this.handleChange}/>
        </div>
        <div className="date-time-row">
          <input type="date" value={this.state.endDate} name="endDate" onChange={this.handleChange}/>
          <input type="time" value={this.state.endTime} name="endTime" onChange={this.handleChange}/>
        </div>
        <input type="submit" value="CONFIRM"/>
      </form>
    );
  }
}

export default styled(EventForm)`
  display: flex;
  flex-direction: column;
  
  input {
    margin: 1rem 1rem 0rem 1rem;
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  input[type="text"] {
    border-bottom: 1px solid ${props => props.theme.graySteel};
  }

  .date-time-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    input[type="date"], input[type="time"] {
      border-bottom: 1px solid ${props => props.theme.graySteel};
      
      &::-webkit-inner-spin-button {
        display: none;
      } 
    }
  }
  
  input[type="submit"] {
    margin-top: 2rem;
    width: fit-content;
    margin-left: auto;
    background: none !important;
    color: inherit;
    border: 1px solid ${props => props.theme.fontColor};
    padding: 0.5rem 1rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    outline: inherit !important;
  }
  
`;