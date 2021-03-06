package mil.af.us.narwhal.mission;

import generated.Results;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MissionService {
  private MissionRepository missionRepository;
  private MissionClient client;
  private SiteRepository siteRepository;

  public MissionService(MissionRepository repository, MissionClient client, SiteRepository siteRepository) {
    this.missionRepository = repository;
    this.client = client;
    this.siteRepository = siteRepository;
  }

  public void refreshMissions() {
    List<Results.MissionMetaData> missionMetaData = client.getMissionMetaData();

    List<Mission> missions = missionMetaData
      .stream()
      .map(MissionService.this::mapMetaDataToMission)
      .collect(Collectors.toList());

    missionRepository.save(missions);
  }

  private Mission mapMetaDataToMission(Results.MissionMetaData metaData) {
    final Site site = siteRepository.findOneByName(metaData.getPrimaryorg());

    Mission foundMission = missionRepository.findOneByMissionId(metaData.getMissionid());
    if (foundMission != null) {
      foundMission.setAtoMissionNumber(metaData.getAtomissionnumber());
      foundMission.setPlatform(metaData.getPlatform());
      foundMission.setSite(site);
      foundMission.setUpdatedAt(Instant.now());
      foundMission.setStartDateTime(metaData.getStartdttime().toGregorianCalendar().getTime().toInstant());
      if (metaData.getEnddttime() != null) {
        foundMission.setEndDateTime(metaData.getEnddttime().toGregorianCalendar().getTime().toInstant());
      }
      return foundMission;
    } else {
      Mission.MissionBuilder builder = new Mission.MissionBuilder()
        .missionId(metaData.getMissionid())
        .atoMissionNumber(metaData.getAtomissionnumber())
        .startDateTime(metaData.getStartdttime().toGregorianCalendar().getTime().toInstant())
        .platform(metaData.getPlatform())
        .updatedAt(Instant.now())
        .site(site);
      if (metaData.getEnddttime() != null) {
        builder.endDateTime(metaData.getEnddttime().toGregorianCalendar().getTime().toInstant());
      }
      return builder.build();
    }
  }
}
