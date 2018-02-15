import * as React from 'react';
import { MissionModel } from './models/MissionModel';
import { shallow } from 'enzyme';
import { Mission } from './Mission';
import * as moment from 'moment';

describe('Mission', () => {
  it('renders the mission atoMissionNumber', () => {
    const mission = new MissionModel(
      '123',
      'fakeMission',
      moment('2017-12-12T09:00:00Z'),
      moment('2017-12-12T15:00:00Z')
    );
    const subject = shallow(<Mission mission={mission}/>);
    expect(subject.text()).toContain(mission.atoMissionNumber);
    expect(subject.text()).toContain('MSN DATE:');
    expect(subject.text()).toContain('MSN START:');
    expect(subject.text()).toContain('MSN END:');
  });

  it('renders TBD when mission endDate not provided', () => {
    const mission = new MissionModel(
      '123',
      'fakeMission',
      moment('2017-12-12T09:00:00Z')
    );
    const subject = shallow(<Mission mission={mission}/>);
    expect(subject.text()).toContain('MSN END: TBD');
  });
});