import { AirmanModel } from '../models/AirmanModel';
import { Skill } from '../../skills/models/Skill';

export interface AirmanRepository {
  findOne(airmanId: number): Promise<AirmanModel>;

  findBySiteId(siteId: number): Promise<AirmanModel[]>;

  saveSkill(skill: Skill): Promise<AirmanModel>;

  saveAirman(airman: AirmanModel): Promise<AirmanModel>;

  deleteSkill(skill: Skill): Promise<AirmanModel>;
}
