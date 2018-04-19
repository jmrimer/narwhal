import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { BackArrow } from '../icons/BackArrow';
import { Theme } from '../themes/default';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { StyledCrew } from './Crew';
import { StyledMissionPlannerRosterContainer } from './MissionPlannerRosterContainer';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledPrintableMissionPlanner } from './PrintableMissionPlanner';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledForm } from '../widgets/Form';
import { StyledButton } from '../widgets/Button';
import { StyledCrewStatus } from '../widgets/CrewStatus';

interface Props {
  crewId: number;
  missionPlannerStore: MissionPlannerStore;
  className?: string;
}

@observer
export class MissionPlanner extends React.Component<Props> {
  async componentDidMount() {
    await this.props.missionPlannerStore.hydrate(this.props.crewId);
  }

  render() {
    const {missionPlannerStore} = this.props;
    const crew = missionPlannerStore.crewStore.crew;

    if (crew == null) {
      return null;
    }

    return (
      <React.Fragment>
        <div className={this.props.className}>
          {missionPlannerStore.loading && <StyledLoadingOverlay/>}
          <Link to="/">
            <BackArrow color={Theme.graySteel}/>
            <span>Back to Availability Roster</span>
          </Link>
          <div className="mission-details">
            <div className="mission-status">
              <h1>{crew.mission.atoMissionNumber}</h1>
              <StyledCrewStatus
                hasCrew={crew.crewPositions.length > 0}
              />
            </div>
            <span>MSN DATE: {crew.mission.displayDateZulu}</span>
            <span>MSN START: {crew.mission.displayStartTime}</span>
            <span>MSN END: {crew.mission.displayEndTime}</span>
            {
              crew.mission.updatedAt &&
              <div className="last-update">Last updated at {crew.mission.displayUpdatedAt}</div>
            }
          </div>
          <StyledForm
            onSubmit={async (e) => {
              e.preventDefault();
              await this.props.missionPlannerStore.crewStore.save();
            }}
            setLoading={missionPlannerStore.setLoading}
          >
            <div className="mission-header">
              <StyledSubmitButton
                text="SAVE"
              />
              <StyledButton
                text="PRINT"
                onClick={window.print}
              />
              <StyledLocationFilters
                locationFilterStore={missionPlannerStore.locationFilterStore}
              />
            </div>
            <div className="mission-planner">
              <StyledCrew
                crewStore={missionPlannerStore.crewStore}
                className="crew-list"
              />
              <StyledMissionPlannerRosterContainer
                missionPlannerStore={missionPlannerStore}
              />
            </div>
          </StyledForm>
        </div>
        <StyledPrintableMissionPlanner key="1" crew={crew}/>
      </React.Fragment>
    );
  }
}

export const StyledMissionPlanner = styled(MissionPlanner)`
  padding: 0.5rem;
  margin-left: 3rem;
  width: 1698px;
  
  @media print {
    display: none;
  }
    
  .mission-details {
    margin-bottom: 2rem;
    
    span {
      margin-right: 2rem;
    }
  }
  
  & > button {
    margin-bottom: 1.5rem;
  }
  
  a {
    text-decoration: none;
    font-size: 0.875rem;
    color: ${props => props.theme.graySteel};
    display: flex;
    justify-content: left;
    align-items: center;
    
    span {
      margin-left: 0.5rem;
    }
  } 

  .mission-planner {
    display: flex;
    flex-direction: row;
  }
  
  .crew-list {
    margin-right: 2rem;
  }
  
  .mission-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.75rem;
    
    & > button {
      margin-left: 1rem;
    }
  }
  
  .filters {
    width: 50%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-left: auto;
    
    & > * {
      margin-left: 2rem;
      margin-right: 0;
    }
  }
  
  form {
    color: ${props => props.theme.fontColor};
  }
  
  .mission-status {
    display: flex;
    flex-direction: row;
    width: 16%;
    justify-content: space-between;
  }
  
  .last-update {
    margin-top: 1rem;
    font-size: 0.75rem;
  }
`;