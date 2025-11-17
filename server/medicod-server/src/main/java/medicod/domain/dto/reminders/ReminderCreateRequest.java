package medicod.domain.dto.reminders;

import lombok.Data;
import org.jooq.types.ULong;

import java.time.LocalTime;

@Data
public class ReminderCreateRequest {

    private ULong inventoryId;
    private String remindTime;
    private String frequency;
}
