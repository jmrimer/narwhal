import * as React from 'react';
import { StyledRoster } from '../roster/Roster';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { TrackerStore } from './stores/TrackerStore';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledSidePanel } from './SidePanel';
import { StyledLegend } from '../roster/Legend';
import { ProfileModel } from '../profile/models/ProfileModel';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';

interface Props {
  trackerStore: TrackerStore;
  profile: ProfileModel;
  className?: string;
}

@observer
export class Tracker extends React.Component<Props> {
  async componentDidMount() {
    await this.props.trackerStore.hydrate(this.props.profile.siteId || -1);
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="main">
          <div className="filters">
            <TopLevelFilter
              id="site-filter"
              label="SITE"
              unfilteredOptionLabel="All Sites"
              value={this.props.trackerStore.siteId}
              callback={this.props.trackerStore.setSiteId}
              options={this.props.trackerStore.siteOptions}
            />
            <TopLevelFilter
              id="squadron-filter"
              label="SQUADRON"
              unfilteredOptionLabel="All Squadrons"
              value={this.props.trackerStore.squadronId}
              callback={this.props.trackerStore.setSquadronId}
              options={this.props.trackerStore.squadronOptions}
            />
            <TopLevelFilter
              id="flight-filter"
              label="FLIGHT"
              unfilteredOptionLabel="All Flights"
              value={this.props.trackerStore.flightId}
              callback={this.props.trackerStore.setFlightId}
              options={this.props.trackerStore.flightOptions}
            />
          </div>
          <div>
            <StyledLegend/>
          </div>
          <StyledRoster trackerStore={this.props.trackerStore}/>
        </div>
        {
          !this.props.trackerStore.selectedAirman.isEmpty &&
          <StyledSidePanel
            trackerStore={this.props.trackerStore}
            sidePanelStore={this.props.trackerStore.sidePanelStore}
          />
        }
        {
          this.props.trackerStore.pendingDeleteEvent &&
          <StyledDeleteEventPopup
            event={this.props.trackerStore.pendingDeleteEvent}
            cancelPendingDeleteEvent={this.props.trackerStore.cancelPendingDelete}
            confirmPendingDeleteEvent={this.props.trackerStore.executePendingDelete}
          />
        }
      </div>
    );
  }
}

export const StyledTracker = styled(Tracker)`
  width: 80%;
  margin-left: 3rem;
  padding: 0.5rem;
  display: flex;
  color: white;
  
  .filters {
     &:after {
      content: "."; 
       visibility: hidden; 
       display: block; 
       height: 0; 
       clear: both;
     }
  }
  
  .main {
    width: 100%;
  }
 `;
