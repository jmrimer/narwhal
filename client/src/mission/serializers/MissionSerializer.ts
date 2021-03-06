import { Serializer } from '../../utils/serializer';
import { MissionModel } from '../models/MissionModel';
import * as moment from 'moment';

export class MissionSerializer implements Serializer<MissionModel> {
  serialize(item: MissionModel): {} {
    throw new Error('Not implemented');
  }

  deserialize(item: any): MissionModel {
    return new MissionModel(
      item.id,
      item.missionId,
      item.atoMissionNumber,
      moment(item.startDateTime),
      item.endDateTime ? moment(item.endDateTime) : null,
      item.platform,
      item.updatedAt ? moment(item.updatedAt) : null,
      item.hasCrew,
      item.site
    );
  }
}