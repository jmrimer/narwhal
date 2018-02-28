import { SkillFormStore } from './SkillFormStore';
import { SkillActions } from './SkillActions';
import { Skill } from '../models/Skill';
import { SkillType } from '../models/SkillType';
import * as moment from 'moment';

describe('SkillFormStore', () => {
  const airmanId = 123;
  const skill: Skill = {
    id: 1,
    type: SkillType.Qualification,
    airmanId: airmanId,
    skillId: 2,
    earnDate: moment(),
    expirationDate: moment()
  };

  let skillActions: SkillActions;
  let subject: SkillFormStore;

  beforeEach(() => {
    skillActions = {
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      certificationOptions: [],
      qualificationOptions: []
    };
    subject = new SkillFormStore(skillActions);
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasItem).toBeFalsy();
      expect(subject.state.skillType).toBe(SkillType.Qualification);
      expect(subject.state.skillId).toBe('');
      expect(subject.state.earnDate).toBe('');
      expect(subject.state.expirationDate).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given skill', () => {
      subject.open(skill);
      expect(subject.hasItem).toBeTruthy();
      expect(subject.state.skillType).toBe(skill.type);
      expect(subject.state.skillId).toBe(String(skill.skillId));
      expect(subject.state.earnDate).toBe(skill.earnDate.format('YYYY-MM-DD'));
      expect(subject.state.expirationDate).toBe(skill.expirationDate.format('YYYY-MM-DD'));
      expect(subject.errors.length).toBe(0);
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(skill);
      expect(subject.hasItem).toBeTruthy();

      subject.close();
      expect(subject.state.skillType).toBe(SkillType.Qualification);
      expect(subject.state.skillId).toBe('');
      expect(subject.state.earnDate).toBe('');
      expect(subject.state.expirationDate).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasItem).toBeFalsy();
    });
  });

  it('can add an skill', () => {
    subject.setState({
      skillType: skill.type,
      skillId: String(skill.skillId),
      earnDate: skill.earnDate.format('YYYY-MM-DD'),
      expirationDate: skill.expirationDate.format('YYYY-MM-DD'),
    });

    subject.addItem(airmanId);

    const addedSkill = (skillActions.addSkill as jest.Mock).mock.calls[0][0];
    expect(addedSkill.skillId).toEqual(skill.skillId);
  });

  it('can remove an skill', () => {
    subject.open(skill);

    subject.removeItem();

    expect(skillActions.removeSkill).toHaveBeenCalledWith(skill);
  });
});
