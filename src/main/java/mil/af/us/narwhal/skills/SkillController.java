package mil.af.us.narwhal.skills;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static java.util.Arrays.asList;

@RestController
  @RequestMapping(SkillController.URI)
public class SkillController {
  public static final String URI = "/api/skills";

  @Autowired private QualificationRepository qualificationRepository;
  @Autowired private CertificationRepository certificationRepository;

  @GetMapping
  public List<String> indexSkills() {
    return asList("Qualification", "Certification");
  }

  @GetMapping(path = "/qualifications")
  public List<Qualification> indexQualifications() {
    return qualificationRepository.findAll();
  }

  @GetMapping(path = "/certifications")
  public List<Certification> indexCertifications() {
    return certificationRepository.findAll();
  }
}
