package mil.af.us.narwhal.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.profile.Profile;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Event {
  private static final String emptyFieldMessage = "This field is required.";

  @Id
  @GeneratedValue
  private Long id;

  @NotEmpty(message = emptyFieldMessage)
  private String title;

  private String description;

  @NotNull(message = emptyFieldMessage)
  private Instant startTime;

  @NotNull(message = emptyFieldMessage)
  private Instant endTime;

  @NotNull(message = emptyFieldMessage)
  @Enumerated(EnumType.STRING)
  private EventType type;

  @Enumerated(EnumType.STRING)
  private EventStatus status;

  @NotNull(message = emptyFieldMessage)
  @ManyToOne
  @JoinColumn(name = "airman_id", referencedColumnName = "id", nullable = false)
  @JsonIgnore
  private Airman airman;

  private String createdBy;

  private Instant createdOn;

  @ManyToOne
  @JoinColumn(name = "supervisor_profile_id", referencedColumnName = "id")
  @JsonIgnore
  private Profile supervisor;

  @Enumerated(EnumType.STRING)
  private EventApproval supervisorApproval;

  private Instant supervisorApprovalTime;

  @ManyToOne
  @JoinColumn(name = "scheduler_profile_id", referencedColumnName = "id")
  @JsonIgnore
  private Profile scheduler;

  @Enumerated(EnumType.STRING)
  private EventApproval schedulerApproval;

  private Instant schedulerApprovalTime;

  public static Event fromJSON(EventJSON json, Airman airman) {
    return new Event(
      json.getId(),
      json.getTitle(),
      json.getDescription(),
      json.getStartTime(),
      json.getEndTime(),
      json.getType(),
      json.getStatus(),
      airman,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  public Event update(EventJSON json) {
    this.setTitle(json.getTitle());
    this.setDescription(json.getDescription());
    this.setStartTime(json.getStartTime());
    this.setEndTime(json.getEndTime());
    return this;
  }

  public Event(
    String title,
    String description,
    Instant startTime,
    Instant endTime,
    EventType eventType,
    EventStatus eventStatus,
    Airman airman
  ) {
    this(
      null,
      title,
      description,
      startTime,
      endTime,
      eventType,
      eventStatus,
      airman,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  @JsonProperty
  public Long airmanId() {
    return this.airman.getId();
  }

  @JsonProperty
  public String supervisorUsername() {
    if (supervisor != null) {
      return this.supervisor.getUsername();
    }
    return null;
  }

  @JsonProperty
  public String schedulerUsername() {
    if (scheduler != null) {
      return this.scheduler.getUsername();
    }
    return null;
  }

  @AssertTrue(message = "End Date cannot be before Start Date.")
  public boolean isValidDateRange() {
    if (this.endTime != null && this.startTime != null) {
      return this.endTime.compareTo(this.startTime) >= 0;
    } else {
      return true;
    }
  }
}
