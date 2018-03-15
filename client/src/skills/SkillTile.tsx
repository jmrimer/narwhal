import * as React from 'react';
import styled from 'styled-components';
import { ExpirationAlert } from '../icons/ExpirationAlert';
import { Skill } from './models/Skill';
import { AirmanQualificationModel } from '../airman/models/AirmanQualificationModel';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { SkillType } from './models/SkillType';
import { Moment } from 'moment';
import * as moment from 'moment';

interface Props {
  skill: AirmanQualificationModel | AirmanCertificationModel;
  onClick: (skill: Skill) => void;
  className?: string;
}

const convertToSkill = (skill: AirmanQualificationModel | AirmanCertificationModel): Skill => {
  if (skill instanceof AirmanQualificationModel) {
    return {
      id: skill.id,
      type: SkillType.Qualification,
      airmanId: skill.airmanId,
      skillId: skill.qualification.id,
      earnDate: skill.earnDate,
      expirationDate: skill.expirationDate
    };
  } else {
    return {
      id: skill.id,
      type: SkillType.Certification,
      airmanId: skill.airmanId,
      skillId: skill.certification.id,
      earnDate: skill.earnDate,
      expirationDate: skill.expirationDate
    };
  }
};

export const timeToExpire = (expirationDate: Moment) => {
  const result = expirationDate.diff(moment(), 'days');
  if (result > 0) {
    return result;
  } else {
    return 0;
  }
};

export const SkillTile = (props: Props) => {
  const {skill} = props;
  return (
    <div
      className={props.className}
      onClick={() => props.onClick(convertToSkill(skill))}
    >
      <div className="currency-title">
        <span>{skill.title}</span>
        {skill.isExpired && <ExpirationAlert/>}
      </div>
      <div className="currency-description"> {timeToExpire(skill.expirationDate)} days until expiration.</div>
    </div>
  );
};

export const StyledSkillTile = styled(SkillTile)`
  background: ${props => props.theme.blueSteel};
  border-radius: 0.25rem 0.25rem 0 0;
  margin: 0.5rem 0;
  padding: 1px;
  
  .currency-title {
    height: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:hover {
      background-color: ${props => props.theme.hoverBlueSteel};
      border-radius: 0.25rem 0.25rem 0 0;
      cursor: pointer;
    }
    
    span {
      padding-left: 0.375rem;
    }
  }

  .currency-description {
    border-top: solid ${props => props.theme.blueSteel} 1px;
    background: ${props => props.theme.lighter};
    font-size: 0.75rem;
    padding: 0.375rem;
  }
`;