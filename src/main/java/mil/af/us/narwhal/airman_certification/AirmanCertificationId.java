package mil.af.us.narwhal.airman_certification;

import java.io.Serializable;
import java.util.Objects;

public class AirmanCertificationId implements Serializable {
  private long airmanId;
  private long certificationId;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    AirmanCertificationId that = (AirmanCertificationId) o;
    return airmanId == that.airmanId &&
      certificationId == that.certificationId;
  }

  @Override
  public int hashCode() {
    return Objects.hash(airmanId, certificationId);
  }
}
