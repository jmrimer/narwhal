package mil.af.us.narwhal.skills;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
  @Id
  @GeneratedValue
  private Long id;

  private String title;

  public Certification(String title) {
    this.title = title;
  }
}