package medicod.notifications;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.types.UInteger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

import static com.medicod.database.tables.MedicodInventory.MEDICOD_INVENTORY;
import static com.medicod.database.tables.MedicodMedications.MEDICOD_MEDICATIONS;
import static com.medicod.database.tables.MedicodUsers.MEDICOD_USERS;

@Component
@RequiredArgsConstructor
public class InventoryScheduler {

    private final DSLContext ctx;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *")
    public void processInventoryWarnings() {

        LocalDate today = LocalDate.now();

        List<Record> items = ctx.select()
                .from(MEDICOD_INVENTORY)
                .join(MEDICOD_USERS)
                .on(MEDICOD_INVENTORY.USER_ID.eq(MEDICOD_USERS.ID))
                .fetch();

        for (Record r : items) {

            String email = r.get(MEDICOD_USERS.EMAIL);
            String username = r.get(MEDICOD_USERS.NAME);

            String medName = r.get(MEDICOD_MEDICATIONS.NAME);
            UInteger qty = r.get(MEDICOD_INVENTORY.QUANTITY);
            LocalDate expiration = (LocalDate) r.get(String.valueOf(MEDICOD_INVENTORY));

            if (expiration != null && expiration.isBefore(today)) {
                emailService.send(
                        email,
                        "Medicamento vencido",
                        EmailTemplates.expiredEmail(username, medName)
                );
                continue;
            }

            if (expiration != null && expiration.minusDays(30).isBefore(today)) {
                emailService.send(
                        email,
                        "Medicamento próximo a vencer",
                        EmailTemplates.expiringSoonEmail(username, medName, expiration.toString())
                );
            }
        }
    }
}
