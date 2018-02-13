import * as React from 'react';
import styled from 'styled-components';
import Planner from './planner/Planner';
import { observer } from 'mobx-react';
import TrackerStore from '../tracker/stores/TrackerStore';
import PlannerHeader from '../widgets/PlannerHeader';
import MultiSelect from '../widgets/TypeAheadInput';
import Notification from '../widgets/Notification';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

const formatAttributes = (objArray: object[], key: string) => objArray.map((object: object) => object[key]).join(' / ');

@observer
export class Roster extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.className}>
        <table>
          <caption>Roster</caption>
          <thead>
          <tr>
            <th className="name">
              <div>NAME</div>
            </th>
            <th className="qualification">
              <div>QUALIFICATION</div>
              {this.renderQualificationFilter()}
            </th>
            <th className="certification">
              <div>CERTIFICATION</div>
              {this.renderCertificationFilter()}
            </th>
            <PlannerHeader plannerStore={this.props.trackerStore.plannerStore} />
          </tr>
          </thead>
          <tbody>
          {this.renderAirmen()}
          </tbody>
        </table>
        {
          this.props.trackerStore.airmen.length === 0 &&
          <Notification>No members at this location match your search.</Notification>
        }
      </div>
    );
  }

  private renderAirmen() {
    const selectedAirmanId = this.props.trackerStore.selectedAirman.id;
    return this.props.trackerStore.airmen.map((airman, index) => {
      const className = airman.id === selectedAirmanId ? 'selected' : '';
      return (
        <tr
          key={index}
          className={className}
          onClick={() => {
            this.props.trackerStore.setSelectedAirman(airman);
          }}
        >
          <td>{airman.lastName}, {airman.firstName}</td>
          <td>{formatAttributes(airman.qualifications, 'acronym')}</td>
          <td className="certification-row">{formatAttributes(airman.certifications, 'title')}</td>

          <Planner events={airman.events} week={this.props.trackerStore.plannerStore.plannerWeek}/>
        </tr>
      );
    });
  }

  private renderQualificationFilter() {
    return (
      <MultiSelect
        multiple={true}
        onChange={this.props.trackerStore.setQualificationIds}
        options={this.props.trackerStore.qualificationOptions}
        placeholder="Filter Qualifications"
        className="qualifications-multiselect"
      />
    );
  }

  private renderCertificationFilter() {
    return (
      <MultiSelect
        multiple={true}
        onChange={this.props.trackerStore.setCertificationIds}
        options={this.props.trackerStore.certificationOptions}
        placeholder="Filter Certifications"
        className="certifications-multiselect"
      />
    );
  }
}

export default styled(Roster)`
  border: 1px solid ${props => props.theme.graySteel};
  
  table { 
    border-collapse: collapse;
    background-color: ${props => props.theme.dark};
    width: 100%;
  }
  
  caption {
    display: none;
  }
  
  thead {
    background-color: ${props => props.theme.lighter};
    text-align: left;
    vertical-align: top;
    
    th {
      font-size: 0.875rem;
      font-weight: 500;
      font-weight: normal;
    }
  }
   
  tbody tr:hover {
    background-color: ${props => props.theme.darker}
  }
  
  tbody tr {
    cursor: pointer;
  }
  
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
    
    &:hover {
      background-color: ${props => props.theme.darker};
    }
  }
  
  td, 
  th {
    padding: 0.75rem;
  }
  
  .selected {
    box-shadow: inset 0.5rem 0px 0px ${props => props.theme.yellow};
  }
  
  .name{
    width: 16%;
  }
  
  .qualification{
    width: 14%;
  }
  
  .certification{
    width: 24%;
  }
  
  .planner-row {
    display: flex;
    justify-content: space-between;
  }

  .certification-row {
    border-right: 1px solid ${props => props.theme.graySteel};
  }
`;
