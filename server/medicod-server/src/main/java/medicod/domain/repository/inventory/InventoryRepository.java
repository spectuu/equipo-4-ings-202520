package medicod.domain.repository.inventory;

import com.medicod.database.tables.records.MedicodInventoryRecord;
import org.jooq.types.ULong;

import java.util.List;

public interface InventoryRepository {

    List<MedicodInventoryRecord> getUserMedicines(long userId);

    MedicodInventoryRecord getMedicineById(long id);

    MedicodInventoryRecord getMedicineByNameAndUserId(String name, long userId);

    MedicodInventoryRecord save(MedicodInventoryRecord medicine);

    MedicodInventoryRecord update(MedicodInventoryRecord medicine);

    void delete(long id);

    boolean fetchIfMedicineExists(ULong medicineId, long userId, String lot);

}
