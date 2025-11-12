package medicod.domain.repository.medication.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import medicod.domain.repository.medication.MedicationRepository;
import org.jooq.DSLContext;
import org.jooq.types.ULong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Transactional
@Repository
public class MedicationInventoryImpl implements MedicationRepository {

    /*

    @Autowired
    private final DSLContext context;

    @Override
    public List<MedicodMedicationsRecord> getAllMedications() {
        return context.selectFrom(MEDICOD_MEDICATIONS).fetch();
    }

    @Override
    public MedicodMedicationsRecord getMedicationById(long id) {
        return context.select()
                .from(MEDICOD_MEDICATIONS)
                .where(MEDICOD_MEDICATIONS.ID.eq(ULong.valueOf(id)))
                .fetchOneInto(MedicodMedicationsRecord.class);
    }

    @Override
    public MedicodMedicationsRecord getMedicationByName(String name) {
        return context.select()
                .from(MEDICOD_MEDICATIONS)
                .where(MEDICOD_MEDICATIONS.NAME.eq(name))
                .fetchOneInto(MedicodMedicationsRecord.class);
    }

    @Override
    public void save(MedicodMedicationsRecord medication) {
        context.insertInto(MEDICOD_MEDICATIONS)
                .set(MEDICOD_MEDICATIONS.NAME, medication.getName())
                .set(MEDICOD_MEDICATIONS.DESCRIPTION, medication.getDescription())
                .set(MEDICOD_MEDICATIONS.EXPIRATION_DATE, medication.getExpirationDate())
                .set(MEDICOD_MEDICATIONS.CREATED_AT, medication.getCreatedAt())
                .execute();
    }

    @Override
    public void updateMedication(long id, MedicodMedicationsRecord medication) {
        context.update(MEDICOD_MEDICATIONS)
                .set(MEDICOD_MEDICATIONS.NAME, medication.getName())
                .set(MEDICOD_MEDICATIONS.DESCRIPTION, medication.getDescription())
                .set(MEDICOD_MEDICATIONS.EXPIRATION_DATE, medication.getExpirationDate())
                .where(MEDICOD_MEDICATIONS.ID.eq(ULong.valueOf(id)))
                .execute();
    }

    @Override
    public void deleteMedication(long id) {
        context.deleteFrom(MEDICOD_MEDICATIONS)
                .where(MEDICOD_MEDICATIONS.ID.eq(ULong.valueOf(id)))
                .execute();
    }

    @Override
    public boolean medicationExists(long id) {
        return context.fetchExists(
                context.selectOne()
                        .from(MEDICOD_MEDICATIONS)
                        .where(MEDICOD_MEDICATIONS.ID.eq(ULong.valueOf(id)))
        );
    }


     */
}
