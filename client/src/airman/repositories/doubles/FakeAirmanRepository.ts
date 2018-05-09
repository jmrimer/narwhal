import { AirmanRepository } from '../AirmanRepository';
import { AirmanModelFactory } from '../../factories/AirmanModelFactory';
import { AirmanModel, ShiftType } from '../../models/AirmanModel';
import { AirmanCertificationModelFactory as ACMF } from '../../factories/AirmanCertificationModelFactory';
import { AirmanQualificationModelFactory as AQMF } from '../../factories/AirmanQualificationModelFactory';
import { Skill } from '../../../skills/models/Skill';
import { AirmanQualificationModel } from '../../models/AirmanQualificationModel';
import { SkillType } from '../../../skills/models/SkillType';
import { QualificationModel } from '../../../skills/models/QualificationModel';
import { CertificationModel } from '../../../skills/models/CertificationModel';
import { AirmanCertificationModel } from '../../models/AirmanCertificationModel';
import { RankModel } from '../../../rank/models/RankModel';

const af = AirmanModelFactory;
const airmen = [
  af.build(1, 1, 1, 14, new RankModel(1, 'r1'), [AQMF.build(1)], [ACMF.build(4, 1)], [], ShiftType.Night),
  af.build(2, 1, 1, 14, new RankModel(1, 'r1'), [AQMF.build(2)], [ACMF.build(5, 1)]),
  af.build(3, 1, 1, 14, new RankModel(1, 'r1'), [AQMF.build(3)], [ACMF.build(4, 1)]),
  af.build(4, 2, 1, 14, new RankModel(1, 'r1'), [AQMF.build(1), AQMF.build(2)], [ACMF.build(4, 1), ACMF.build(5, 1)]),
  af.build(5, 2, 1, 14, new RankModel(1, 'r1'), [AQMF.build(2)], [ACMF.build(5, 1)]),
  af.build(6, 2, 1, 14, new RankModel(1, 'r1'), [AQMF.build(3)], [ACMF.build(4, 1)]),
  af.build(7, 3, 2, 14, new RankModel(1, 'r1'), [AQMF.build(1)], [ACMF.build(4, 1)]),
  af.build(8, 3, 2, 14, new RankModel(1, 'r1'), [AQMF.build(2)], [ACMF.build(5, 1)]),
  af.build(9, 3, 2, 14, new RankModel(1, 'r1'), [AQMF.build(3)], [ACMF.build(5, 1)]),
  af.build(10, 4, 2, 14, new RankModel(1, 'r1'), [AQMF.build(1), AQMF.build(2)], [ACMF.build(4, 1), ACMF.build(5, 1)]),
  af.build(11, 5, 2, 1, new RankModel(1, 'r1'), [AQMF.build(2)], [ACMF.build(6, 2)]),
  af.build(12, 6, 2, 1, new RankModel(1, 'r1'), [AQMF.build(3)], [ACMF.build(7, 2)])
];

export class FakeAirmanRepository implements AirmanRepository {
  findOne(airmanId: number) {
    return Promise.resolve(airmen.filter(a => a.id === airmanId)[0]);
  }

  findBySiteId(siteId: number) {
    return Promise.resolve(airmen.filter(a => a.siteId === siteId));
  }

  saveSkill(skill: Skill): Promise<AirmanModel> {
    const errors = {};
    if (skill.skillId == null) {
      const id = 'id';
      errors[id] = 'This field is required.';
    }

    if (!skill.earnDate.isValid()) {
      const earnDate = 'earnDate';
      errors[earnDate] = 'This field is required.';
    }

    if (!skill.expirationDate.isValid()) {
      const expirationDate = 'expirationDate';
      errors[expirationDate] = 'This field is required.';
    }

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    const airman = airmen.find(a => a.id === skill.airmanId)!;
    if (skill.type === SkillType.Qualification) {
      const aq = new AirmanQualificationModel(
        airman.id,
        new QualificationModel(skill.skillId, 'A', 'A'),
        skill.earnDate,
        skill.expirationDate
      );
      this.save(airman.qualifications, aq);
    } else {
      const ac = new AirmanCertificationModel(
        airman.id,
        new CertificationModel(skill.skillId, 'A', 1),
        skill.earnDate,
        skill.expirationDate
      );
      this.save(airman.certifications, ac);
    }
    return Promise.resolve(airman);
  }

  saveAirman(airman: AirmanModel): Promise<AirmanModel> {
    const index = airmen.findIndex(a => a.id === airman.id)!;
    const updatedAirman = Object.assign({}, airmen[index], {shift: airman.shift});
    airmen[index] = updatedAirman;
    return Promise.resolve(updatedAirman);
  }

  deleteSkill(skill: Skill): Promise<AirmanModel> {
    const airman = airmen.find(a => a.id === skill.airmanId)!;
    if (skill.type === SkillType.Qualification) {
      this.delete(airman.qualifications, skill.id!);
    } else {
      this.delete(airman.certifications, skill.id!);
    }
    return Promise.resolve(airman);
  }

  private save(skills: any[], skillToSave: any) {
    const existingSkill = skills.find((s: any) => s.id === skillToSave.skillId);
    if (!existingSkill) {
      skillToSave.id = Math.round(Math.random() * 0xFFFFFF);
      skills.push(skillToSave);
    }
  }

  private delete(skills: any[], skillToDeleteId: number) {
    const index = skills.map(s => s.id).indexOf(skillToDeleteId, 0);
    if (index > -1) {
      skills.splice(index, 1);
    }
  }
}