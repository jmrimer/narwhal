package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.crew.CrewPosition;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.mission.Mission;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Data
@NoArgsConstructor
public class Airman {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "flight_id")
  private Long flightId;

  private String firstName;

  private String lastName;

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<AirmanQualification> qualifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<AirmanCertification> certifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId")
  @JsonIgnore
  private List<Event> events = new ArrayList<>();

  @OneToMany(mappedBy = "airman")
  @JsonBackReference
  private List<CrewPosition> crewPositions = new ArrayList<>();

  public Airman(Long flightId, String firstName, String lastName) {
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @JsonProperty("events")
  public List<Event> getEvents() {
    return Stream.concat(
      this.crewPositions.stream()
        .map(CrewPosition::getCrew)
        .map(crew -> {
          final Mission mission = crew.getMission();
          return mission.toEvent(crew.getId(), this.getId());
        }),
      this.events.stream()
    ).collect(Collectors.toList());
  }

  public boolean addQualification(AirmanQualification airmanQualification) {
    for (AirmanQualification qual : qualifications) {
      if (qual.getQualification().getId().equals(airmanQualification.getQualification().getId())) {
        return false;
      }
    }
    airmanQualification.setAirmanId(this.id);
    qualifications.add(airmanQualification);
    return true;
  }

  public boolean addCertification(AirmanCertification airmanCertification) {
    for (AirmanCertification cert : certifications) {
      if (cert.getCertification().getId().equals(airmanCertification.getCertification().getId())) {
        return false;
      }
    }
    airmanCertification.setAirmanId(this.id);
    certifications.add(airmanCertification);
    return true;
  }

  public void updateCertification(AirmanCertification certification) {
    certifications.stream()
      .filter(cert -> cert.getId().equals(certification.getId()))
      .findFirst()
      .ifPresent(cert -> cert.setExpirationDate(certification.getExpirationDate()));
  }

  public void updateQualification(AirmanQualification qualification) {
    qualifications.stream()
      .filter(qual -> qual.getId().equals(qualification.getId()))
      .findFirst()
      .ifPresent(qual -> qual.setExpirationDate(qualification.getExpirationDate()));
  }

  public void deleteQualification(Long id) {
    qualifications.removeIf(qualification -> qualification.getId().equals(id));
  }

  public void deleteCertification(Long id) {
    certifications.removeIf(certification -> certification.getId().equals(id));
  }
}
