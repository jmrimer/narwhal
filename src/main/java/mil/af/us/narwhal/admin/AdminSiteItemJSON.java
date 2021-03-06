package mil.af.us.narwhal.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminSiteItemJSON {
  private Long siteId;
  private String siteName;
}
