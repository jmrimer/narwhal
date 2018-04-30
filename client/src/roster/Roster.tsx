import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { TabType } from '../tracker/stores/SidePanelStore';
import { StyledAirmanDatum } from '../tracker/AirmanDatum';
import { StyledPlanner } from './Planner';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import * as classNames from 'classnames';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { BorderedNotification } from '../widgets/Notification';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { RosterHeaderStore } from './stores/RosterHeaderStore';
import { RosterActions } from './RosterActions';

const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

interface Props {
  trackerStore?: TrackerStore;
  locationFilterStore?: LocationFilterStore;
  rosterHeaderStore?: RosterHeaderStore;
  className?: string;
}

@observer
export class Roster extends React.Component<Props> {
  airmen = () => {
    const airmen = this.props.locationFilterStore!.filterAirmen(this.props.trackerStore!.airmen);
    return this.props.rosterHeaderStore!.filterAirmen(airmen);
  }

  render() {
    const {className} = this.props;
    const airmen = this.airmen();
    cache.clearAll();
    return (
      <List
        className={className}
        height={855}
        rowHeight={(props) => cache.rowHeight(props)! || 60}
        rowCount={airmen.length}
        width={1400}
        overscanRowCount={15}
        deferredMeasurementCache={cache}
        noRowsRenderer={() => {
          return (
            <BorderedNotification>
              No members at this location match your search.
            </BorderedNotification>
          );
        }}
        rowRenderer={(props: ListRowProps) => {
          const airman = airmen[props.index];
          return (
            <StyledRow
              {...props}
              key={airman.id}
              airman={airman}
              style={props.style}
            />
          );
        }}
      />
    );
  }
}

export const StyledRoster = inject('trackerStore', 'locationFilterStore', 'rosterHeaderStore')(styled(Roster)`
  border-top: none;
  outline: none;
`);

interface RowProps {
  airman: AirmanModel;
  trackerStore?: TrackerStore;
  style: object;
  index: number;
  parent: any;
  key: any;
  className?: string;
}

const Row = observer(
  (props: RowProps) => {
    const {airman, trackerStore, className} = props;
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        rowIndex={props.index}
        key={props.key}
        parent={props.parent}
      >
        <div
          className={classNames(className, {selected: airman.id === trackerStore!.selectedAirman.id})}
          style={Object.assign({}, props.style, {width: '1400px'})}
        >
          <div
            className="left"
            onClick={async () => await RosterActions.openSidePanel(airman, TabType.CURRENCY)}
          >
            <StyledShiftDropdown
              airman={airman}
              className="shift"
            />
            <StyledAirmanDatum
              airman={airman}
              tab={TabType.AVAILABILITY}
              className="airman-name"
            >
              <span>{airman.lastName}, {airman.firstName}</span>
            </StyledAirmanDatum>
            <StyledAirmanDatum
              airman={airman}
              tab={TabType.CURRENCY}
              className="airman-qual"
            >
              {airman.qualifications.map(
                (qual, index) => {
                  return (
                    <React.Fragment key={index}>
                    <span
                      className={classNames({expired: qual.isExpired})}
                    >
                      {qual.acronym}
                    </span>
                      {!(index === airman.qualifications.length - 1) && <span> / </span>}
                    </React.Fragment>
                  );
                })}
            </StyledAirmanDatum>
            <StyledAirmanDatum
              airman={airman}
              tab={TabType.CURRENCY}
              className="airman-cert"
            >
              {airman.certifications.map((certification, index) => {
                return (
                  <React.Fragment key={index}>
                    <span className={classNames({expired: certification.isExpired})}>{certification.title}</span>
                    {!(index === airman.certifications.length - 1) && <span key={index}> / </span>}
                  </React.Fragment>
                );
              })}
            </StyledAirmanDatum>
          </div>
          <div
            className="right"
            onClick={async () => RosterActions.openSidePanel(airman, TabType.AVAILABILITY)}
          >
            <StyledPlanner airman={airman}/>
          </div>
        </div>
      </CellMeasurer>
    );
  }
);

export const StyledRow = inject('trackerStore')(styled(Row)`
  display: flex;
  border: 1px solid ${props => props.theme.graySteel};
  border-top: none;
  
  &:nth-child(even) {
    background-color: ${props => props.theme.light};
  } 
  
  &:nth-child(odd) {
    background-color: ${props => props.theme.dark};
  }
  
  &:hover {
    background: ${props => props.theme.darkest};
  }
  
  & > div > span {
    width: 23%;
  }
  
  .left {
    width: 868px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.graySteel};
  }
  
  .right { 
    display: flex;
    flex-grow: 2;
    align-items: center;
    padding: 0.75rem;
    cursor: pointer;
    width: 530px;
  }
  
  .shift {
    width: 5rem;
  }
  
  &.selected {
    box-shadow: inset 0.5rem 0px 0px ${props => props.theme.yellow};
  }
`);
