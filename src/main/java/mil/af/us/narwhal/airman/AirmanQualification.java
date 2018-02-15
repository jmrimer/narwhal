package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.skills.Qualification;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
  name = "join_airman_qualification",
  uniqueConstraints = {@UniqueConstraint(columnNames = {"airman_id", "qualification_id"})}
)
public class AirmanQualification {
  @Id
  @GeneratedValue
  private Long Id;

  @Column(name = "airman_id", nullable = false)
  private Long airmanId;

  @ManyToOne
  @JoinColumn(name = "qualification_id", referencedColumnName = "id", nullable = false)
  private Qualification qualification;

  @NotNull
  @Column(name = "earn_date")
  private Instant earnDate;

  @NotNull
  @Column(name = "expiration_date")
  private Instant expirationDate;

  public AirmanQualification(Long airmanId, Qualification qualification, Instant earnDate, Instant expirationDate) {
    this.airmanId = airmanId;
    this.qualification = qualification;
    this.earnDate = earnDate;
    this.expirationDate = expirationDate;
  }

  public AirmanQualification(Qualification qualification, Instant earnDate, Instant expirationDate) {
    this.qualification = qualification;
    this.earnDate = earnDate;
    this.expirationDate = expirationDate;
  }
}
