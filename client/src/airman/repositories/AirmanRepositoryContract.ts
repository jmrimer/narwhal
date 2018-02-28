import { AirmanRepository } from './AirmanRepository';
import { AirmanModel } from '../models/AirmanModel';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import * as assert from 'assert';

export function airmanRepositoryContract(subject: AirmanRepository) {
  let airmen: AirmanModel[];

  beforeEach(async () => {
    airmen = await subject.findAll();
    expect(airmen).toBeDefined();
  });

  describe('findAll', () => {
    it('returns airmen', () => {
      expect(airmen.length).toBeGreaterThan(0);

      const uniqueIds = airmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(airmen.length);

      airmen.forEach(({qualifications}) => {
        expect(Array.isArray(qualifications)).toBeTruthy();
      });

      airmen.forEach(({certifications}) => {
        expect(Array.isArray(certifications)).toBeTruthy();
      });

      airmen.forEach(({events}) => {
        expect(Array.isArray(events)).toBeTruthy();
      });
    });
  });

  describe('findBySquadron', () => {
    it('returns airmen filtered by squadron', async () => {
      const filteredAirmen = await subject.findBySquadron(1);
      expect(filteredAirmen).toBeDefined();

      const uniqueIds = filteredAirmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(filteredAirmen.length);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);
    });
  });

  describe('findByFlight', () => {
    it('returns airmen filtered by flight', async () => {
      const filteredAirmen = await subject.findByFlight(1);

      const uniqueIds = filteredAirmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(filteredAirmen.length);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);

      filteredAirmen.forEach(airman => {
        expect(airman.flightId).toEqual(1);
      });
    });
  });

  describe('save', () => {
    it('saves a certification with a unique id', async () => {
      const certId = 3;
      const airman = await subject.saveSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: certId,
        earnDate: moment(),
        expirationDate: moment()
      });
      expect(airman.certifications.find(c => c.certification.id === certId)!.id).toBeDefined();
    });

    it('updates expiration date of the certification', async () => {
      const certId = 3;
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: certId,
        earnDate: moment(),
        expirationDate: moment()
      });

      const savedCert = airman.certifications.find(c => c.certification.id === certId)!;
      const newExpirationDate = savedCert.expirationDate.add(1, 'year');

      airman = await subject.saveSkill({
        id: savedCert.id,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: certId,
        earnDate: savedCert.earnDate,
        expirationDate: newExpirationDate
      });

      expect(airman.certifications
        .find(c => c.certification.id === certId)!
        .expirationDate.isSame(newExpirationDate))
        .toBeTruthy();
    });

    it('saves a qualification with a unique id', async () => {
      const qualId = 3;
      const airman = await subject.saveSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: qualId,
        earnDate: moment(),
        expirationDate: moment()
      });
      expect(airman.qualifications.find(q => q.qualification.id === qualId)!.id).toBeDefined();
    });

    it('updates expiration date of the qualification', async () => {
      const qualId = 4;
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: qualId,
        earnDate: moment(),
        expirationDate: moment()
      });

      const savedQual = airman.qualifications.find(q => q.qualification.id === qualId)!;
      const newExpirationDate = savedQual.expirationDate.add(1, 'year');

      airman = await subject.saveSkill({
        id: savedQual.id,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: qualId,
        earnDate: savedQual.earnDate,
        expirationDate: newExpirationDate
      });

      expect(airman.qualifications
        .find(q => q.qualification.id === qualId)!
        .expirationDate.isSame(newExpirationDate))
        .toBeTruthy();
    });

    describe('validation', () => {
      it('correctly handles validations from the server', async () => {
        const qualId = 5;
        const errors = [{earnDate: 'Field is required'}, {expirationDate: 'Field is required'}];

        try {
          await subject.saveSkill({
            id: null,
            type: SkillType.Qualification,
            airmanId: airmen[0].id,
            skillId: qualId,
            earnDate: moment.invalid(),
            expirationDate: moment.invalid()
          });
        } catch (e) {
          /*tslint:disable:no-any*/
          errors.forEach((item: any) => expect(e).toContainEqual(item));
          return;
        }
        assert.fail('saveSkill should have returned validation errors');
      });
    });
  });

  describe('delete', () => {
    it('deletes the selected qualification from the airman', async () => {
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: 1,
        earnDate: moment(),
        expirationDate: moment()
      });
      const savedSkill = airman.qualifications.find(q => q.skillId === 1)!;

      const updatedAirman = await subject.deleteSkill({
        id: savedSkill.id,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: 1,
        earnDate: savedSkill.earnDate,
        expirationDate: savedSkill.expirationDate
      });
      expect(updatedAirman.qualifications.find(q => q.id === savedSkill.id)).toBeUndefined();
    });

    it('deletes the selected certification from the airman', async () => {
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: 1,
        earnDate: moment(),
        expirationDate: moment()
      });
      const savedSkill = airman.certifications.find(c => c.skillId === 1)!;

      const updatedAirman = await subject.deleteSkill({
        id: savedSkill.id,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: 1,
        earnDate: savedSkill.earnDate,
        expirationDate: savedSkill.expirationDate
      });
      expect(updatedAirman.certifications.find(c => c.id === savedSkill.id)).toBeUndefined();
    });
  });
}
