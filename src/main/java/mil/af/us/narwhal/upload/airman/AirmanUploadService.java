package mil.af.us.narwhal.upload.airman;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanCertification;
import mil.af.us.narwhal.airman.AirmanQualification;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.rank.Rank;
import mil.af.us.narwhal.rank.RankRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skill.Certification;
import mil.af.us.narwhal.skill.CertificationRepository;
import mil.af.us.narwhal.skill.Qualification;
import mil.af.us.narwhal.skill.QualificationRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.upload.ImportException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AirmanUploadService {
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM/dd/yyyy");

  private AirmanRepository airmanRepository;
  private SiteRepository siteRepository;
  private FlightRepository flightRepository;
  private CertificationRepository certificationRepository;
  private QualificationRepository qualificationRepository;
  private RankRepository rankRepository;


  public AirmanUploadService(AirmanRepository airmanRepository, SiteRepository siteRepository, FlightRepository flightRepository, CertificationRepository certificationRepository, QualificationRepository qualificationRepository, RankRepository rankRepository) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.flightRepository = flightRepository;
    this.certificationRepository = certificationRepository;
    this.qualificationRepository = qualificationRepository;
    this.rankRepository = rankRepository;
  }

  @Transactional
  public void importToDatabase(List<AirmanUploadCSVRow> rows) throws ImportException {
    List<Integer> failedRows = new ArrayList<>();
    final Rank rank = rankRepository.findRankByAbbreviation("No Rank");

    for (int i = 0; i < rows.size(); i++) {
      final AirmanUploadCSVRow row = rows.get(i);

      Site site = siteRepository.findOneByName(row.getSite());
      if (site == null) {
        failedRows.add(i + 1);
        continue;
      }

      Squadron squadron = getSquadron(row, site);
      if (squadron == null) {
        failedRows.add(i + 1);
        continue;
      }

      Flight flight = getFlight(row, squadron);

      final Airman airman = new Airman(flight, row.getFirstName(), row.getLastName(), rank);
      airmanRepository.save(airman);
    }

    if (failedRows.size() > 0) {
      throw new ImportException(failedRows);
    }
  }

  @Transactional
  public void attachCertifications(List<AttachCertificationCSVRow> rows, ZoneId zoneId) throws ImportException {
    Instant earnDate;
    Instant periodicDue;
    Instant currencyExpiration;
    Instant lastSat;
    List<Integer> failedRows = new ArrayList<>();

    for (int i = 0; i < rows.size(); i++) {
      final AttachCertificationCSVRow row = rows.get(i);
      final Airman airman = airmanRepository.findOneByFirstNameAndLastName(
        row.getFirstName(),
        row.getLastName()
      );

      if (airman == null) {
        failedRows.add(i + 1);
        continue;
      }

      final Certification certification = certificationRepository.findOneByTitleAndSiteId(
        row.getCertificationName(),
        airman.getSiteId()
      );

      if (certification == null) {
        failedRows.add(i + 1);
        continue;
      }

      try {
        earnDate = instantFromDateString(row.getEarnDate(), zoneId);
        periodicDue = instantFromDateString(row.getPeriodicDue(), zoneId);
        currencyExpiration = instantFromDateString(row.getCurrencyExpiration(), zoneId);
        lastSat = instantFromDateString(row.getLastSat(), zoneId);
      } catch (DateTimeParseException e) {
        failedRows.add(i + 1);
        continue;
      }

      airman.addCertification(new AirmanCertification(
        certification,
        earnDate,
        periodicDue,
        currencyExpiration,
        lastSat
      ));

      airmanRepository.save(airman);
    }

    if (failedRows.size() > 0) {
      throw new ImportException(failedRows);
    }
  }

  @Transactional
  public void attachQualifications(List<AttachQualificationCSVRow> rows, ZoneId zoneId) {
    Instant earnDate;
    Instant periodicDue;
    Instant lastSat;
    Instant currencyExpiration;
    List<Integer> failedRows = new ArrayList<>();

    for (int i = 0; i < rows.size(); i++) {
      final AttachQualificationCSVRow row = rows.get(i);
      final Airman airman = airmanRepository.findOneByFirstNameAndLastName(
        row.getFirstName(),
        row.getLastName()
      );

      if (airman == null) {
        failedRows.add(i + 1);
        continue;
      }

      final Qualification qualification = qualificationRepository.findOneByTitle(row.getQualificationName());

      if (qualification == null) {
        failedRows.add(i + 1);
        continue;
      }

      try {
        earnDate = instantFromDateString(row.getEarnDate(), zoneId);
        periodicDue = instantFromDateString(row.getPeriodicDue(), zoneId);
        lastSat = instantFromDateString(row.getLastSat(), zoneId);
        currencyExpiration = instantFromDateString(row.getCurrencyExpiration(), zoneId);
      } catch (DateTimeParseException e) {
        failedRows.add(i + 1);
        continue;
      }

      airman.addQualification(new AirmanQualification(
        qualification,
        earnDate,
        periodicDue,
        lastSat,
        currencyExpiration
      ));

      airmanRepository.save(airman);
    }

    if (failedRows.size() > 0) {
      throw new ImportException(failedRows);
    }
  }

  private Instant instantFromDateString(String dateString, ZoneId zoneId) {
    LocalDate date = LocalDate.parse(dateString, FORMATTER);
    ZonedDateTime dateTime = ZonedDateTime.of(date.getYear(), date.getMonth().getValue(), date.getDayOfMonth(), 0, 0, 0, 0, zoneId);
    return Instant.from(dateTime);
  }

  private Squadron getSquadron(AirmanUploadCSVRow row, Site site) {
    return site.getSquadrons()
      .stream()
      .filter(s -> s.getName().equals(row.getSquadron()))
      .findFirst()
      .orElse(null);
  }

  private Flight getFlight(AirmanUploadCSVRow row, Squadron squadron) {
    return squadron.getFlights()
      .stream()
      .filter(f -> f.getName().equals(row.getFlight()))
      .findFirst()
      .orElseGet(() -> {
        Flight flight = new Flight(row.getFlight());
        squadron.addFlight(flight);
        return flightRepository.save(flight);
      });
  }
}
