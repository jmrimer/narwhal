package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.certification.Certification;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "join_airman_certification")
@IdClass(AirmanCertificationId.class)
public class AirmanCertification {
  @Id
  @JsonIgnore
  @Column(name="airman_id")
  private long airmanId;

  @Id
  @JsonIgnore
  @Column(name="certification_id")
  private long certificationId;

  @Column(name = "expiration_date")
  private Date expirationDate;

  @ManyToOne
  @JoinColumn(name = "certification_id", updatable = false, insertable = false, referencedColumnName = "id")
  @JsonUnwrapped
  private Certification certification;
}