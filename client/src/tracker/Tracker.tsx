import * as React from 'react';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import Roster from '../roster/Roster';
import Filter from './Filter';
import UnitRepository from '../unit/repositories/UnitRepository';
import UnitModel from '../unit/models/UnitModel';
import FilterOption from './models/FilterOption';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import SideBar from '../SideBar';

interface Props {
  airmanRepository: AirmanRepository;
  unitRepository: UnitRepository;
  className?: string;
}

interface State {
  airmen: AirmanModel[];
  units: UnitModel[];
  selectedUnitId: number;
  selectedAirman: AirmanModel;
}

export const DefaultFilter = {
  value: -1,
  text: 'All Units'
};

export class Tracker extends React.Component<Props, State> {
  state = {
    airmen: [],
    units: [],
    selectedUnitId: DefaultFilter.value,
    selectedAirman: AirmanModel.empty(),
  };

  async componentDidMount() {
    const airmen = await this.props.airmanRepository.findAll();
    const units = await this.props.unitRepository.findAll();

    this.setState({airmen, units});
  }

  setSelectedUnitId = async (option: FilterOption) => {
    const updatedRoster = (option.value === DefaultFilter.value) ?
      await this.props.airmanRepository.findAll() :
      await this.props.airmanRepository.findByUnit(option.value);

    this.setState({selectedUnitId: option.value, airmen: updatedRoster});
  }

  handleSelectAirman = (airman: AirmanModel) => {
    this.setState({selectedAirman: airman});
  }

  render() {
    const options = this.state.units.map((unit: UnitModel) => {
      return {value: unit.id, text: unit.name};
    });
    return (
      <div className={this.props.className}>
        <div className="main">
          <Filter callback={this.setSelectedUnitId} options={[DefaultFilter, ...options]}/>
          <Roster airmen={this.state.airmen} selectAirman={this.handleSelectAirman}/>
        </div>
        <SideBar airman={this.state.selectedAirman} />
      </div>
    );
  }
}

export default styled(Tracker)`
  width: 75%;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  
  .main {
    width: 75%;
    margin-right: 2rem;
  }
`;