package medicod.domain.service.inventory;

import com.medicod.database.tables.records.MedicodInventoryRecord;
import com.medicod.database.tables.records.MedicodMedicationsRecord;
import lombok.extern.slf4j.Slf4j;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.inventory.InventoryCreateRequest;
import medicod.domain.dto.inventory.InventoryItemResponse;
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

    private static InventoryItemResponse toResponse(MedicodInventoryRecord r, String medName) {
        return InventoryItemResponse.builder()
                .id(r.getId().longValue())
                .medicationId(r.getMedicationId().longValue())
                .medicationName(medName)
                .quantity(r.getQuantity().intValue())
                .unit(r.getUnit())
                .lotCode(r.getLotCode())
                .expires(r.getExpires())
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
                            .data(toResponse(saved, medName))
                            .build());

        } catch (DataAccessException e) {
            log.error("Insert inventory error", e);
            return bad("Could not save inventory item.", HttpStatus.BAD_REQUEST);
        }

    }




}
