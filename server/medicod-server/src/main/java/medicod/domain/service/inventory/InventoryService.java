package medicod.domain.service.inventory;

import com.medicod.database.tables.records.MedicodInventoryRecord;
import com.medicod.database.tables.records.MedicodMedicationsRecord;
import lombok.extern.slf4j.Slf4j;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.inventory.InventoryCreateRequest;
import medicod.domain.dto.inventory.InventoryItemResponse;
import medicod.domain.dto.inventory.InventoryUpdateRequest;
import medicod.domain.repository.account.AccountRepository;
import medicod.domain.repository.inventory.InventoryRepository;
import medicod.domain.repository.medication.MedicationRepository;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.types.UInteger;
import org.jooq.types.ULong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.medicod.database.Tables.MEDICOD_INVENTORY;
import static com.medicod.database.Tables.MEDICOD_MEDICATIONS;

@Slf4j
@Service
public class InventoryService {

    @Autowired
    private DSLContext ctx;

    @Autowired
    private InventoryRepository inventoryRepo;

    @Autowired
    private MedicationRepository medicationRepo;

    /* ------------------------ Helpers ------------------------ */

    private static String normalizeLot(String lot) {
        return ObjectUtils.isEmpty(lot) ? null : lot.trim().toUpperCase();
    }

    private static InventoryItemResponse toResponse(
            MedicodInventoryRecord r,
            String medName,
            String medDescription,
            LocalDateTime medCreatedAt
    ) {

        long id = r.getId() != null ? r.getId().longValue() : -1L;
        long medId = r.getMedicationId() != null ? r.getMedicationId().longValue() : -1L;
        int qty = r.getQuantity() != null ? r.getQuantity().intValue() : 0;

        return InventoryItemResponse.builder()
                .id(id)
                .medicationId(medId)
                .medicationName(medName)
                .medicationDescription(medDescription)
                .quantity(qty)
                .unit(r.getUnit())
                .lotCode(r.getLotCode())
                .expires(r.getExpires())
                .createdAt(medCreatedAt)
                .build();

    }

    private ResponseEntity<BasicResponse> bad(String msg, HttpStatus s) {

        return ResponseEntity.status(s)
                .body(BasicResponse.builder().code(s.value())
                        .message(s.is2xxSuccessful() ? "SUCCESS" : (s == HttpStatus.NOT_FOUND ? "NOT_FOUND" : "ERROR"))
                        .display(msg).build());

    }

    /* ------------------------ Services ------------------------ */
    public ResponseEntity<BasicResponse> addMedicationToInventory(long userId, InventoryCreateRequest req) {

        if (req.getQuantity() < 0) return bad("Quantity must be >= 0", HttpStatus.BAD_REQUEST);

        final String medName = req.getMedicationName().trim();
        final String lot = normalizeLot(req.getLotCode());

        MedicodMedicationsRecord med = medicationRepo.getMedicationByName(medName);
        if (med == null) {
            med = new MedicodMedicationsRecord();
            med.setName(medName);
            med.setDescription(req.getMedicationDescription());
            med.setCreatedAt(LocalDateTime.now());
            medicationRepo.save(med);
            med = medicationRepo.getMedicationByName(medName);
        }

        if (inventoryRepo.fetchIfMedicineExists(med.getId(), userId, lot)) return bad("This medication + lot already exists in your inventory.", HttpStatus.CONFLICT);

        try {

            MedicodInventoryRecord rec = new MedicodInventoryRecord();
            rec.setUserId(ULong.valueOf(userId));
            rec.setMedicationId(med.getId());
            rec.setQuantity(UInteger.valueOf(req.getQuantity()));
            rec.setUnit(req.getUnit());
            rec.setLotCode(lot);
            rec.setExpires(req.getExpires());

            MedicodInventoryRecord saved = inventoryRepo.save(rec);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    BasicResponse.builder()
                            .code(201).message("SUCCESS").display("Medication added to inventory")
                            .data(toResponse(saved, med.getName(), med.getDescription(), med.getCreatedAt()))
                            .build());

        } catch (DataAccessException e) {
            log.error("Insert inventory error", e);
            return bad("Could not save inventory item.", HttpStatus.BAD_REQUEST);
        }

    }

    public ResponseEntity<BasicResponse> listUserInventory(long userId) {

        var rows = ctx.select(MEDICOD_INVENTORY.ID,
                        MEDICOD_INVENTORY.MEDICATION_ID,
                        MEDICOD_INVENTORY.QUANTITY,
                        MEDICOD_INVENTORY.UNIT,
                        MEDICOD_INVENTORY.LOT_CODE,
                        MEDICOD_INVENTORY.EXPIRES,
                        MEDICOD_MEDICATIONS.NAME.as("med_name"),
                        MEDICOD_MEDICATIONS.DESCRIPTION.as("med_desc"),
                        MEDICOD_MEDICATIONS.CREATED_AT.as("med_created_at"))
                .from(MEDICOD_INVENTORY)
                .join(MEDICOD_MEDICATIONS)
                .on(MEDICOD_MEDICATIONS.ID.eq(MEDICOD_INVENTORY.MEDICATION_ID))
                .where(MEDICOD_INVENTORY.USER_ID.eq(ULong.valueOf(userId)))
                .orderBy(MEDICOD_MEDICATIONS.NAME.asc(), MEDICOD_INVENTORY.EXPIRES.asc().nullsLast())
                .fetch(record -> {

                    var inv = new MedicodInventoryRecord();
                    inv.setId(record.get(MEDICOD_INVENTORY.ID));
                    inv.setMedicationId(record.get(MEDICOD_INVENTORY.MEDICATION_ID));
                    inv.setQuantity(record.get(MEDICOD_INVENTORY.QUANTITY));
                    inv.setUnit(record.get(MEDICOD_INVENTORY.UNIT));
                    inv.setLotCode(record.get(MEDICOD_INVENTORY.LOT_CODE));
                    inv.setExpires(record.get(MEDICOD_INVENTORY.EXPIRES));

                    String medName = record.get("med_name", String.class);
                    String medDesc = record.get("med_desc", String.class);
                    LocalDateTime medCreatedAt = record.get("med_created_at", LocalDateTime.class);

                    return toResponse(inv, medName, medDesc, medCreatedAt);

                });

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .code(200).message("SUCCESS")
                        .display(rows.isEmpty() ? "No inventory items found." : "Inventory found")
                        .data(rows)
                        .build()
        );
    }

    public ResponseEntity<BasicResponse> updateInventoryItem(long userId, long inventoryId, InventoryUpdateRequest req) {

        MedicodInventoryRecord rec = inventoryRepo.getMedicineById(inventoryId);

        if (rec == null) return bad("Inventory item not found.", HttpStatus.NOT_FOUND);

        if (!rec.getUserId().equals(ULong.valueOf(userId)))
            return bad("You are not the owner of this item.", HttpStatus.FORBIDDEN);
        if (req.getQuantity() != null && req.getQuantity() < 0)
            return bad("Quantity must be >= 0", HttpStatus.BAD_REQUEST);

        String newLot = req.getLotCode() != null ? normalizeLot(req.getLotCode()) : rec.getLotCode();

        if (req.getQuantity() != null) rec.setQuantity(UInteger.valueOf(req.getQuantity()));

        if (req.getUnit() != null) rec.setUnit(req.getUnit());

        if (req.getLotCode() != null) rec.setLotCode(newLot);

        if (req.getExpires() != null) rec.setExpires(req.getExpires());

        if (req.getLotCode() != null) {

            boolean exists = inventoryRepo.fetchIfMedicineExists(rec.getMedicationId(), userId, newLot);

            if (exists) {

                var maybeSame = ctx.selectFrom(MEDICOD_INVENTORY)
                        .where(MEDICOD_INVENTORY.USER_ID.eq(rec.getUserId()))
                        .and(MEDICOD_INVENTORY.MEDICATION_ID.eq(rec.getMedicationId()))
                        .and(newLot == null ? MEDICOD_INVENTORY.LOT_CODE.isNull() : MEDICOD_INVENTORY.LOT_CODE.eq(newLot))
                        .fetchOne();
                if (maybeSame == null || !maybeSame.getId().equals(rec.getId())) {
                    return bad("Another item with the same lot already exists.", HttpStatus.CONFLICT);
                }
            }
        }

        MedicodInventoryRecord updated = inventoryRepo.update(rec);
        if (updated == null) {
            // o 404 si esperabas que existiera
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    BasicResponse.builder()
                            .code(400).message("ERROR")
                            .display("Could not update inventory item (not found or unchanged).")
                            .build()
            );
        }

        var medId = updated.getMedicationId() != null ? updated.getMedicationId() : rec.getMedicationId();

        var medRow = ctx.select(
                        MEDICOD_MEDICATIONS.NAME,
                        MEDICOD_MEDICATIONS.DESCRIPTION,
                        MEDICOD_MEDICATIONS.CREATED_AT
                )
                .from(MEDICOD_MEDICATIONS)
                .where(MEDICOD_MEDICATIONS.ID.eq(medId))
                .fetchOne();

        String medName = medRow.get(MEDICOD_MEDICATIONS.NAME);
        String medDesc = medRow.get(MEDICOD_MEDICATIONS.DESCRIPTION);
        LocalDateTime medCreatedAt = medRow.get(MEDICOD_MEDICATIONS.CREATED_AT);

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .code(200).message("SUCCESS").display("Inventory item updated")
                        .data(toResponse(updated, medName, medDesc, medCreatedAt))
                        .build()
        );
    }

    public ResponseEntity<BasicResponse> searchByName(long userId, String medicationName) {

        if (medicationName == null || medicationName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    BasicResponse.builder().code(400).message("ERROR")
                            .display("Medication name is required").build()
            );

        }

        String name = medicationName.trim();

        MedicodMedicationsRecord med = medicationRepo.getMedicationByName(name);

        if (med == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    BasicResponse.builder().code(404).message("NOT_FOUND")
                            .display("Medication not found").build()
            );
        }

        List<MedicodInventoryRecord> items = inventoryRepo.getUserMedicines(userId).stream()
                .filter(r -> med.getId().equals(r.getMedicationId()))
                .toList();

        List<InventoryItemResponse> list = items.stream()
                .map(r -> toResponse(r, med.getName(), med.getDescription(), med.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(
                BasicResponse.builder()
                        .code(200).message("SUCCESS")
                        .display(list.isEmpty() ? "No inventory entries for this medication." : "Inventory found")
                        .data(list)
                        .build()
        );

    }

}
