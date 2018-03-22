package mil.af.us.narwhal.mission;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping(MissionController.URI)
public class MissionController {
  public static final String URI = "/api/missions";

  MissionRepository missionRepository;


  public MissionController(MissionRepository repository) {
    this.missionRepository = repository;
  }

  @GetMapping
  public List<Mission> index() {
    Instant time = Instant.now().minus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
    return missionRepository.findByStartDateTimeGreaterThanEqualOrderByStartDateTime(time);
  }
}