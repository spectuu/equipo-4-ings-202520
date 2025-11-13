package medicod.domain.repository.reminder.impl;

import com.medicod.database.enums.MedicodRemindersFrequency;
import lombok.RequiredArgsConstructor;
import medicod.domain.dto.reminders.ReminderResponse;
import medicod.domain.repository.reminder.ReminderRepository;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.types.ULong;
import org.springframework.stereotype.Repository;

import static com.medicod.database.tables.MedicodReminders.MEDICOD_REMINDERS;
import static com.medicod.database.tables.MedicodInventory.MEDICOD_INVENTORY;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReminderRepositoryImpl implements ReminderRepository {

    private final DSLContext ctx;

    private ReminderResponse map(Record r) {
        if (r == null) return null;
        return ReminderResponse.builder()
                .id(r.get(MEDICOD_REMINDERS.ID).longValue())
                .inventoryId(r.get(MEDICOD_REMINDERS.INVENTORY_ID).longValue())
                .remindTime(r.get(MEDICOD_REMINDERS.REMIND_TIME).toString())
                .frequency(String.valueOf(r.get(MEDICOD_REMINDERS.FREQUENCY)))
                .active(r.get(MEDICOD_REMINDERS.ACTIVE) == 1)
                .confirmedAt(r.get(MEDICOD_REMINDERS.CONFIRMED_AT) == null ? null :
                        r.get(MEDICOD_REMINDERS.CONFIRMED_AT).toString())
                .lastSentAt(r.get(MEDICOD_REMINDERS.LAST_SENT_AT) == null ? null :
                        r.get(MEDICOD_REMINDERS.LAST_SENT_AT).toString())
                .build();
    }

    @Override
    public ReminderResponse findById(ULong id) {
        return map(ctx.select()
                .from(MEDICOD_REMINDERS)
                .where(MEDICOD_REMINDERS.ID.eq(id))
                .fetchOne());
    }

    @Override
    public List<ReminderResponse> findByUser(ULong userId) {
        return ctx.select()
                .from(MEDICOD_REMINDERS)
                .join(MEDICOD_INVENTORY)
                .on(MEDICOD_INVENTORY.ID.eq(MEDICOD_REMINDERS.INVENTORY_ID))
                .where(MEDICOD_INVENTORY.USER_ID.eq(userId))
                .fetch(record -> map(record));
    }

    @Override
    public ReminderResponse create(ULong userId, ULong inventoryId, LocalTime time, MedicodRemindersFrequency frequency) {
        Record r = ctx.insertInto(MEDICOD_REMINDERS)
                .set(MEDICOD_REMINDERS.INVENTORY_ID, inventoryId)
                .set(MEDICOD_REMINDERS.REMIND_TIME, time)
                .set(MEDICOD_REMINDERS.FREQUENCY, frequency)
                .set(MEDICOD_REMINDERS.ACTIVE, (byte) 1)
                .returning()
                .fetchOne();

        return map(r);
    }

    @Override
    public ReminderResponse update(ULong reminderId, LocalTime time, MedicodRemindersFrequency frequency, Boolean active) {
        Record r = ctx.update(MEDICOD_REMINDERS)
                .set(MEDICOD_REMINDERS.REMIND_TIME, time)
                .set(MEDICOD_REMINDERS.FREQUENCY, frequency)
                .set(MEDICOD_REMINDERS.ACTIVE, active ? (byte) 1 : (byte) 0)
                .where(MEDICOD_REMINDERS.ID.eq(reminderId))
                .returning()
                .fetchOne();

        return map(r);
    }

    @Override
    public void delete(ULong reminderId) {
        ctx.deleteFrom(MEDICOD_REMINDERS)
                .where(MEDICOD_REMINDERS.ID.eq(reminderId))
                .execute();
    }

    @Override
    public boolean inventoryBelongsToUser(ULong userId, ULong inventoryId) {
        Integer count = ctx.selectCount()
                .from(MEDICOD_INVENTORY)
                .where(MEDICOD_INVENTORY.ID.eq(inventoryId))
                .and(MEDICOD_INVENTORY.USER_ID.eq(userId))
                .fetchOne(0, Integer.class);

        return count != null && count > 0;
    }
}
