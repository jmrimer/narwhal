import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Upload as UploadPage } from '../upload/Upload';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { observer } from 'mobx-react/custom';
import { TrackerPage } from './pages/TrackerPage';
import { CrewPage } from './pages/CrewPage';
import { DashboardPage } from './pages/DashboardPage';
import { MissionPlannerStore } from '../crew/stores/MissionPlannerStore';

interface Props {
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
  missionPlannerStore: MissionPlannerStore;
  profileStore: ProfileSitePickerStore;
}

@observer
export class Routes extends React.Component<Props> {
  render() {
    return (
      <Switch>
        <Route exact={true} path="/" render={() => <TrackerPage {...this.props}/>}/>
        <Route path="/upload" render={() => <UploadPage/>}/>
        <Route exact={true} path="/dashboard" render={() => <DashboardPage {...this.props}/>}/>
        <Route
          path="/dashboard/crew/:id"
          render={({match}) => {
            return (
              <CrewPage
                username={this.props.profileStore.profile!.user.username}
                crewId={match.params.id}
                missionPlannerStore={this.props.missionPlannerStore}
              />
            );
          }}
        />
      </Switch>
    );
  }
}