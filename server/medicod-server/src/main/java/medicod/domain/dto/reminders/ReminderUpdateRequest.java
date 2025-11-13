package medicod.domain.dto.reminders;

import lombok.Data;

import java.time.LocalTime;

@Data
public class ReminderUpdateRequest {
    private String remindTime;
    private String frequency;
    private Boolean active;
}
