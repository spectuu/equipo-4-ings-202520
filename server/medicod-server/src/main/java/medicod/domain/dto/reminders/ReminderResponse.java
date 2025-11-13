package medicod.domain.dto.reminders;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReminderResponse {

    private Long id;
    private Long inventoryId;
    private String remindTime;
    private String frequency;
    private boolean active;
    private String confirmedAt;
    private String lastSentAt;

}
