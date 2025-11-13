package medicod.notifications;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.types.ULong;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static com.medicod.database.tables.MedicodMedications.MEDICOD_MEDICATIONS;
import static com.medicod.database.tables.MedicodReminders.MEDICOD_REMINDERS;
import static com.medicod.database.tables.MedicodInventory.MEDICOD_INVENTORY;
import static com.medicod.database.tables.MedicodUsers.MEDICOD_USERS;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final DSLContext ctx;
    private final EmailService emailService;

    @Scheduled(cron = "0 * * * * *")
    public void processReminders() {

        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        var records = ctx.select()
                .from(MEDICOD_REMINDERS)
                .join(MEDICOD_INVENTORY)
                .on(MEDICOD_REMINDERS.INVENTORY_ID.eq(MEDICOD_INVENTORY.ID))
                .join(MEDICOD_USERS)
                .on(MEDICOD_INVENTORY.USER_ID.eq(MEDICOD_USERS.ID))
                .where(MEDICOD_REMINDERS.ACTIVE.eq((byte) 1))
                .fetch();

        for (Record r : records) {

            LocalTime remindTime = r.get(MEDICOD_REMINDERS.REMIND_TIME);
            String frequency = String.valueOf(r.get(MEDICOD_REMINDERS.FREQUENCY));
            LocalDateTime lastSent = r.get(MEDICOD_REMINDERS.LAST_SENT_AT);
            String email = r.get(MEDICOD_USERS.EMAIL);
            String username = r.get(MEDICOD_USERS.NAME);
            String medName = r.get(MEDICOD_MEDICATIONS.NAME);
            ULong reminderId = r.get(MEDICOD_REMINDERS.ID);

            if (!now.equals(remindTime)) continue;

            if (lastSent != null) {
                if (frequency.equals("daily") &&
                        lastSent.toLocalDate().isEqual(LocalDateTime.now().toLocalDate())) {
                    continue;
                }

                if (frequency.equals("weekly") &&
                        lastSent.toLocalDate().isAfter(LocalDateTime.now().minusDays(7).toLocalDate())) {
                    continue;
                }

                if (frequency.equals("once")) {
                    continue;
                }
            }

            emailService.send(
                    email,
                    "Recordatorio de Medicación",
                    EmailTemplates.reminderEmail(username, medName, remindTime.toString())
            );

            ctx.update(MEDICOD_REMINDERS)
                    .set(MEDICOD_REMINDERS.LAST_SENT_AT, LocalDateTime.now())
                    .where(MEDICOD_REMINDERS.ID.eq(reminderId))
                    .execute();

            if (frequency.equals("once")) {
                ctx.update(MEDICOD_REMINDERS)
                        .set(MEDICOD_REMINDERS.ACTIVE, (byte) 0)
                        .where(MEDICOD_REMINDERS.ID.eq(reminderId))
                        .execute();
            }

        }
    }
}
