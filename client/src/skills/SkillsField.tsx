import * as React from 'react';
import { SkillsFieldStore } from './stores/SkillsFieldStore';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { SkillModel } from '../airman/models/SkillModel';
import * as classNames from 'classnames';
import { Moment } from 'moment';

interface Props {
  skillsFieldStore?: SkillsFieldStore;
  currencyDate?: Moment;
  items: SkillModel[];
  className?: string;
}

@observer
export class SkillsField extends React.Component<Props> {
  render() {
    return (
      <div className={classNames(this.props.className, 'skills-display')}>
        {this.props.items.map(
          (item, index) => {
            return (
              <span className="skill" key={index}>
                <span
                  className={classNames({
                    closeExpiration: this.props.skillsFieldStore!.isCloseToExpiration(
                      item.periodicDue,
                      this.props.currencyDate) ||
                    this.props.skillsFieldStore!.isCloseToExpiration(
                      item.currencyExpiration,
                      this.props.currencyDate)
                    ,
                    expired: this.props.skillsFieldStore!.isExpired(
                      item.periodicDue,
                      this.props.currencyDate
                    ) ||
                     this.props.skillsFieldStore!.isExpired(
                    item.currencyExpiration,
                    this.props.currencyDate
                    )
                  })}
                >
                  {item.displayText}
                </span>
                {
                  !(index === this.props.items.length - 1) && <span> / </span>
                }
              </span>
            );
          })
        }
      </div>);
  }
}

export const StyledSkillsField = inject('skillsFieldStore')(styled(SkillsField)`  
  .closeExpiration {
    border-bottom: 2px solid ${props => props.theme.yellow};
    padding: 0.05rem 0.05rem 0 0.05rem;
  }
  
  .expired {
    position: relative;
    display: inline-block;
  }
  
  .expired:after {
     content: '';
     border-bottom: 3px solid ${props => props.theme.red};
     width: 100%;
     position: absolute;
     right: 0;
     top: 50%;
  }
`);