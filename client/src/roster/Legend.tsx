import * as React from 'react';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { AvailableIcon } from '../icons/AvailableIcon';
import styled from 'styled-components';
import { TDYDeploymentIcon } from '../icons/TDYDeploymentIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { OffDayIcon } from '../icons/OffDayIcon';

interface Props {
  className?: string;
}

export const Legend = (props: Props) => {
  return (
    <div className={props.className}>
      <div>
        <MissionIcon title="XYZ" viewBox="0 0 36 25"/>
        <span>MISSION</span>
      </div>
      <div>
        <TDYDeploymentIcon/>
        <span>TDY/DEPLOYMENT</span>
      </div>
      <div>
        <AppointmentIcon/>
        <span>APPOINTMENT</span>
      </div>
      <div>
        <LeaveIcon/>
        <span>LEAVE</span>
      </div>
      <div>
        <AvailableIcon/>
        <span>AVAILABLE</span>
      </div>
      <div>
        <OffDayIcon/>
        <span className="off-day">OFF DAY</span>
      </div>
    </div>
  );
};

export const StyledLegend = styled(Legend)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: ${props => props.theme.blueSteel};
  margin-top: 2rem;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.graySteel};

  & > div {
    display: flex;
    margin: 0 0.6rem;
    align-items: center;
    span {
    font-size: 0.875rem;
      margin: 0 0 0 0.5rem;
    }
  }
  
  .off-day {
    margin: 0 0 0 0.375rem;
  }
`;
