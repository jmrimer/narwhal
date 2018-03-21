import * as React from 'react';
import styled from 'styled-components';
import { SiteModel } from '../site/models/SiteModel';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { observer } from 'mobx-react';

interface Props {
  profileStore: ProfileSitePickerStore;
  className?: string;
}

interface State {
  sites: SiteModel[];
}

@observer
export class ProfileSitePicker extends React.Component<Props, State> {
  handleChange = async (event: any) => {
    await this.props.profileStore.saveSiteId(Number(event.target.value));
  }

  render() {
    return (
      <div className={this.props.className}>
        <div>SELECT YOUR HOME SITE</div>
        <button
          value={this.props.profileStore.getSiteByName('DMS-GA').id}
          onClick={(event) => this.handleChange(event)}
          className="dms-ga"
        >
          <span>Fort Gordon</span><span>Georgia</span>
        </button>
        <button
          value={this.props.profileStore.getSiteByName('DMS-MD').id}
          onClick={(event) => this.handleChange(event)}
          className="dms-md"
        >
          <span>FORT MEADE</span><span>Maryland</span>
        </button>
      </div>
    );
  }
}

export const StyledProfileSitePicker = styled(ProfileSitePicker)`
  max-width: 50%;
  margin: 0 auto;
  text-align: center;
  font-size: 1.5rem;
  
  div {
    margin-bottom: 1.5rem;
  }
  
  button {
    display: flex;
    padding: 1rem;
    margin: 1rem 0;
    width: 100%; 
    font-size: 1rem;
    justify-content: space-between;
    color: ${props => props.theme.fontColor};
    background: ${props => props.theme.blueSteel};
    border: none;
    text-transform: uppercase;
    
    &:hover {
      background: ${props => props.theme.graySteel};
    }
  }
`;