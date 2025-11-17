package medicod.domain.service.reminder;

import com.medicod.database.enums.MedicodRemindersFrequency;
import lombok.RequiredArgsConstructor;
import medicod.configuration.mapper.UserMapper;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.reminders.ReminderCreateRequest;
import medicod.domain.dto.reminders.ReminderUpdateRequest;
import medicod.domain.repository.reminder.ReminderRepository;
import org.jooq.types.ULong;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository repository;

    private ULong getUserId() {
        UserMapper u = (UserMapper) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getId();
    }

    public BasicResponse listMine() {

        System.out.println("Getting reminders for user: " + getUserId());

        var userId = getUserId();
        var list = repository.findByUser(userId);

        System.out.println("Found " + list.size() + " reminders for user: " + userId);

        return BasicResponse.builder()
                .message("Ok")
                .data(list)
                .build();
    }

    public BasicResponse create(ReminderCreateRequest req) {
        var userId = getUserId();

        if (!repository.inventoryBelongsToUser(userId, req.getInventoryId())) {
            return BasicResponse.builder()
                    .message("Inventory does not belong to user")
                    .build();
        }

        var r = repository.create(
                userId,
                req.getInventoryId(),
                LocalTime.parse(req.getRemindTime()),
                MedicodRemindersFrequency.valueOf(req.getFrequency())
        );

        return BasicResponse.builder()
                .message("Reminder created")
                .data(r)
                .build();
    }

    public BasicResponse update(Integer id, ReminderUpdateRequest req) {
        var userId = getUserId();

        var existing = repository.findById(ULong.valueOf(id));
        if (existing == null) {
            return BasicResponse.builder()
                    .message("Error : Reminder not found")
                    .build();
        }

        var updated = repository.update(
                ULong.valueOf(id),
                LocalTime.parse(req.getRemindTime()),
                MedicodRemindersFrequency.valueOf(req.getFrequency()),
                req.getActive()
        );

        return BasicResponse.builder()
                .message("Reminder updated")
                .data(updated)
                .build();
    }

    public BasicResponse delete(Integer id) {
        repository.delete(ULong.valueOf(id));
        return BasicResponse.builder()
                .message("Reminder deleted")
                .build();
    }
}
