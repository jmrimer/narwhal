import { CurrencyChild, CurrencyStore } from './CurrencyStore';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import { AirmanCertificationModelFactory } from '../../airman/factories/AirmanCertificationModelFactory';
import { Repositories } from '../../utils/Repositories';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';
import { RipItemRepositoryStub } from '../../airman/repositories/doubles/AirmanRipItemRepositoryStub';

describe('CurrencyStore', () => {
  const skill = {
    id: 1,
    airmanId: 2,
    skillId: 3,
    type: SkillType.Certification,
    earnDate: moment(),
    periodicDue: moment(),
    currencyExpiration: moment(),
    lastSat: moment()
  };
  let subject: CurrencyStore;
  let repos: Partial<Repositories>;
  let airmanRipItemRepositoryStub: RipItemRepository;

  beforeEach(() => {
    airmanRipItemRepositoryStub = new RipItemRepositoryStub();
    repos = {
      airmanRepository: {
        findBySiteId: jest.fn(),
        saveSkill: jest.fn(),
        saveAirman: jest.fn(),
        delete: jest.fn(),
        deleteSkill: jest.fn(),
        findOne: jest.fn(),
        updateShiftByFlightId: jest.fn(),
        updateScheduleByFlightId: jest.fn(),
      },

      ripItemRepository: {
        findBySelectedAirman: airmanRipItemRepositoryStub.findBySelectedAirman,
        updateAirmanRipItems: jest.fn()
      }
    };

    subject = new CurrencyStore(repos);
  });

  it('should only show expired', async () => {
    await subject.setRipItemsForAirman(2);
    expect(subject.expiredItemCount).toBe(1);
  });

  it('should open an skill form for create', () => {
    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);

    subject.openCreateSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillForm);
  });

  it('should open an skill form for edit', () => {
    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);

    subject.openEditSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillForm);
  });

  it('should close the skill form', () => {
    subject.openEditSkillForm();
    subject.closeSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);
  });

  it('should toggle pending setPendingDelete', () => {
    const cert = AirmanCertificationModelFactory.build(1, 1);
    expect(subject.pendingDeleteSkill).toBeNull();

    subject.removeSkill(cert);
    expect(subject.pendingDeleteSkill).toBe(cert);

    subject.cancelPendingDelete();
    expect(subject.pendingDeleteSkill).toBeNull();
  });

  it('should open the RipItems form', () => {
    subject.openAirmanRipItemForm();
    expect(subject.currencyChild).toBe(CurrencyChild.RipItemForm);
  });

  describe('skill', () => {
    it('should save a skill', async () => {
      await subject.addSkill(skill);
      expect(repos.airmanRepository!.saveSkill).toHaveBeenCalledWith(skill);
    });

    it('should setPendingDelete a skill', async () => {
      subject.removeSkill(skill);
      await subject.executePendingDelete();
      expect(repos.airmanRepository!.deleteSkill).toHaveBeenCalledWith(skill);
    });
  });

  describe('rip items', () => {
    it('should set rip items for an airman', async () => {
      repos.ripItemRepository!.findBySelectedAirman = jest.fn();
      await subject.setRipItemsForAirman(123);
      expect(repos.ripItemRepository!.findBySelectedAirman).toHaveBeenCalledWith(123);
    });
  });
});
