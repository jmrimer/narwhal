package mil.af.us.narwhal.upload.certification;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.CertificationRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CertificationUploadService {
  private CertificationRepository certificationRepository;
  private SiteRepository siteRepository;

  public CertificationUploadService(CertificationRepository certificationRepository, SiteRepository siteRepository) {
    this.certificationRepository = certificationRepository;
    this.siteRepository = siteRepository;
  }

  public void importToDatabase(List<CertificationUploadCSVRow> rows) {
    Set<Certification> certifications = new HashSet<>();

    for (CertificationUploadCSVRow row : rows) {
     final Certification existingCert = certificationRepository.findOneByTitleAndSiteName(row.getTitle(), row.getSite());
      if (existingCert == null) {
        final Site site = siteRepository.findOneByName(row.getSite());
        if (site != null) {
          certifications.add(new Certification(row.getTitle(), site));
        }
      }
    }

    certificationRepository.save(certifications);
  }
}
