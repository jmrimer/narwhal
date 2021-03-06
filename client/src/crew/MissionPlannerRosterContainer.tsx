import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StyledMissionPlannerRoster } from './MissionPlannerRoster';
import { StyledMissionPlannerRosterHeader } from './MissionPlannerRosterHeader';

interface Props {
  className?: string;
}

@observer
export class MissionPlannerRosterContainer extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.className}>
        <div className="header-top"/>
        <div className="roster-header">
          <StyledMissionPlannerRosterHeader/>
        </div>
        <StyledMissionPlannerRoster/>
      </div>
    );
  }
}

export const StyledMissionPlannerRosterContainer = styled(MissionPlannerRosterContainer)`
  .roster-header {
    display: flex;
    border-bottom: 1px solid ${props => props.theme.graySteel};
    border-right: 1px solid ${props => props.theme.graySteel};
    
    .thead {
      background: ${props => props.theme.lighter};
    }
  }
  
 .header-top {
    height: 2rem;
    width: 100%;
    background: ${props => props.theme.blueSteel};
    border: 1px solid ${props => props.theme.graySteel};
 }
`;
