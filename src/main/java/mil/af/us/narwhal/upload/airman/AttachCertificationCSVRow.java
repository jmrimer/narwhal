package mil.af.us.narwhal.upload.airman;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachCertificationCSVRow {
  @CsvBindByName(required = true) private String firstName;
  @CsvBindByName(required = true) private String lastName;
  @CsvBindByName(required = true) private String certificationName;
  @CsvBindByName(required = true) private String earnDate;
  @CsvBindByName(required = true) private String periodicDue;
  @CsvBindByName(required = true) private String lastSat;
  @CsvBindByName(required = true) private String currencyExpiration;
}
