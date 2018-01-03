package mil.af.us.narwhal.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, String> {
  List<Mission> findBySiteId(Long siteId);
}