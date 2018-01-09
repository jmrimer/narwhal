import * as React from 'react';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import Roster from '../roster/Roster';
import { TopLevelFilter } from '../widgets/Filter';
import SquadronRepository from '../squadron/repositories/SquadronRepository';
import SquadronModel from '../squadron/models/SquadronModel';
import FilterOption from '../widgets/models/FilterOptionModel';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import SideBar from './SidePanel/SidePanel';
import PlannerService from './services/PlannerService';
import TopBar from '../widgets/TopBar';
import createDefaultOption, { DefaultValue } from '../utils/createDefaultOption';

interface Props {
  airmanRepository: AirmanRepository;
  squadronRepository: SquadronRepository;
  plannerService: PlannerService;
  username: string;
  className?: string;
}

interface State {
  airmen: AirmanModel[];
  squadrons: SquadronModel[];
  selectedAirman: AirmanModel;
  selectedSquadronId: number;
  showSidePanel: boolean;
}

export class Tracker extends React.Component<Props, State> {
  readonly defaultSquadronOption: DefaultValue = createDefaultOption('All Squadrons');
  readonly defaultFlightOption: DefaultValue = createDefaultOption('All Flights');

  constructor(props: Props) {
    super(props);
    this.state = {
      airmen: [],
      squadrons: [],
      selectedAirman: AirmanModel.empty(),
      selectedSquadronId: -1,
      showSidePanel: false,
    };
  }

  async componentDidMount() {
    const airmen = await this.props.airmanRepository.findAll();
    const squadrons = await this.props.squadronRepository.findAll();
    this.setState({airmen, squadrons});
  }

  setSelectedSquadronId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.defaultSquadronOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findBySquadron(option.value);
    this.setState({airmen: updatedRoster, selectedSquadronId: option.value});
  }

  setSelectedFlightId = async (option: FilterOption) => {
    const updatedRoster = (option.value === this.defaultFlightOption.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByFlight(option.value);
    this.setState({airmen: updatedRoster});
  }

  setSelectedAirman = (airman: AirmanModel) => {
    this.setState({selectedAirman: airman, showSidePanel: true});
  }

  closeSidePanel = () => {
    this.setState({selectedAirman: AirmanModel.empty(), showSidePanel: false});
  }

  render() {
    const squadronOptions = this.state.squadrons.map((squadron: SquadronModel) => {
      return {value: squadron.id, text: squadron.name};
    });

    const [selectedSquadron] = this.state.squadrons.filter(squadron => squadron.id === this.state.selectedSquadronId);

    const flightOptions = selectedSquadron ? selectedSquadron.flights.map((flight) => {
      return {value: flight.id, text: flight.name};
    }) : null;

    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="AVAILABILITY ROSTER"/>,
        (
          <div key="1" className={this.props.className}>
            <div className="main">
              <TopLevelFilter
                id="squadron-filter"
                defaultOption={this.defaultSquadronOption}
                options={squadronOptions}
                callback={this.setSelectedSquadronId}
                label="SQUADRON"
              />
              <TopLevelFilter
                id="flight-filter"
                defaultOption={flightOptions ? this.defaultFlightOption : createDefaultOption('Select Squadron')}
                options={flightOptions}
                callback={this.setSelectedFlightId}
                label="FLIGHT"
              />
              <div style={{display: 'flex'}}>
                <span style={{marginLeft: 'auto', fontSize: '0.75rem'}}>White = Uncommitted, Blue = Committed</span>
              </div>
              <div style={{display: 'flex'}}>
                <Roster
                  airmen={this.state.airmen}
                  week={this.props.plannerService.getCurrentWeek()}
                  selectedAirmanId={this.state.selectedAirman.id}
                  selectAirman={this.setSelectedAirman}
                />
              </div>
            </div>
            {
              this.state.showSidePanel
                ? <SideBar
                  airman={this.state.selectedAirman}
                  closeCallback={this.closeSidePanel}
                  week={this.props.plannerService.getCurrentWeek()}
                />
                : null
            }
          </div>
        )
      ]
    );
  }
}

export default styled(Tracker)`
  width: 75%;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  
  .main {
    width: 100%;
  }
  `;