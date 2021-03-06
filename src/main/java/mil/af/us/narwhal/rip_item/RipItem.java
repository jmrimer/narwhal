package mil.af.us.narwhal.rip_item;

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
public class RipItem {
  @Id
  @GeneratedValue
  private Long id;

  private String title;

  public RipItem(String title) {
    this.title = title;
  }
}
