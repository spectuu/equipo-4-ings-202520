package medicod.domain.repository.reminder;

import com.medicod.database.enums.MedicodRemindersFrequency;
import medicod.domain.dto.reminders.ReminderResponse;
import org.jooq.types.ULong;

import java.time.LocalTime;
import java.util.List;

public interface ReminderRepository {

    ReminderResponse findById(ULong id);

    List<ReminderResponse> findByUser(ULong userId);

    ReminderResponse create(ULong userId, ULong inventoryId, LocalTime time, MedicodRemindersFrequency frequency);

    ReminderResponse update(ULong reminderId, LocalTime time, MedicodRemindersFrequency frequency, Boolean active);

    void delete(ULong reminderId);

    boolean inventoryBelongsToUser(ULong userId, ULong inventoryId);
}
