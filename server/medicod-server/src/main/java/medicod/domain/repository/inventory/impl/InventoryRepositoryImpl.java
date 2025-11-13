package medicod.domain.repository.inventory.impl;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import medicod.domain.repository.inventory.InventoryRepository;
import medicod.domain.repository.medication.MedicationRepository;
import org.jooq.DSLContext;
import org.jooq.types.ULong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Transactional
@Repository
public class InventoryRepositoryImpl implements InventoryRepository {

    /*

    @Autowired
    private final DSLContext context;

    @Autowired
    private final MedicationRepository medicationRepository;

    @Override
    public List<MedicodInventoryRecord> getUserMedicines(long userId) {
        return context.selectFrom(MEDICOD_INVENTORY)
                .where(MEDICOD_INVENTORY.USER_ID.eq(ULong.valueOf(userId)))
                .fetch();
    }

    @Override
    public MedicodInventoryRecord getMedicineById(long id) {
        return context.select()
                .from(MEDICOD_INVENTORY)
                .where(MEDICOD_INVENTORY.ID.eq(ULong.valueOf(id)))
                .fetchOneInto(MedicodInventoryRecord.class);
    }

    @Override
    public MedicodInventoryRecord getMedicineByNameAndUserId(String name, long userId) {

        MedicodMedicationsRecord medicationByName = medicationRepository.getMedicationByName(name);

        if (medicationByName == null) {
            return null;
        }

        return context.select()
                .from(MEDICOD_INVENTORY)
                .where(MEDICOD_INVENTORY.MEDICATION_ID.eq(medicationByName.getId()))
                .and(MEDICOD_INVENTORY.USER_ID.eq(ULong.valueOf(userId)))
                .fetchOneInto(MedicodInventoryRecord.class);
    }

    @Override
    public MedicodInventoryRecord save(MedicodInventoryRecord medicine) {
        return context.insertInto(MEDICOD_INVENTORY)
                .set(MEDICOD_INVENTORY.USER_ID, medicine.getUserId())
                .set(MEDICOD_INVENTORY.MEDICATION_ID, medicine.getMedicationId())
                .set(MEDICOD_INVENTORY.QUANTITY, medicine.getQuantity())
                .set(MEDICOD_INVENTORY.UNIT, medicine.getUnit())
                .set(MEDICOD_INVENTORY.LOT_CODE, medicine.getLotCode())
                .set(MEDICOD_INVENTORY.EXPIRES, medicine.getExpires())
                .returning()
                .fetchOneInto(MedicodInventoryRecord.class);
    }

    @Override
    public MedicodInventoryRecord update(MedicodInventoryRecord medicine) {
        int rows = context.update(MEDICOD_INVENTORY)
                .set(MEDICOD_INVENTORY.QUANTITY, medicine.getQuantity())
                .set(MEDICOD_INVENTORY.UNIT, medicine.getUnit())
                .set(MEDICOD_INVENTORY.LOT_CODE, medicine.getLotCode())
                .set(MEDICOD_INVENTORY.EXPIRES, medicine.getExpires())
                .where(MEDICOD_INVENTORY.ID.eq(medicine.getId()))
                .execute();

        if (rows == 0) {
            return null;
        }

        return context.selectFrom(MEDICOD_INVENTORY)
                .where(MEDICOD_INVENTORY.ID.eq(medicine.getId()))
                .fetchOneInto(MedicodInventoryRecord.class);
    }

    @Override
    public void delete(long id) {
        context.deleteFrom(MEDICOD_INVENTORY)
                .where(MEDICOD_INVENTORY.ID.eq(ULong.valueOf(id)))
                .execute();
    }

    @Override
    public boolean fetchIfMedicineExists(ULong medicineId, long userId, String lot) {
        return context.fetchExists(
                context.selectOne().from(MEDICOD_INVENTORY)
                        .where(MEDICOD_INVENTORY.USER_ID.eq(ULong.valueOf(userId)))
                        .and(MEDICOD_INVENTORY.MEDICATION_ID.eq(medicineId))
                        .and(lot == null ? MEDICOD_INVENTORY.LOT_CODE.isNull() : MEDICOD_INVENTORY.LOT_CODE.eq(lot))
        );
    }
     */
}
