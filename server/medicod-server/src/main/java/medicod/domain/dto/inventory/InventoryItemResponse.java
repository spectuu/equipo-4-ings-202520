package medicod.domain.dto.inventory;

import lombok.Builder;
import lombok.Data;
import org.jooq.types.UInteger;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class InventoryItemResponse {

    private long id;
    private long medicationId;
    private String medicationName;
    private String medicationDescription;
    private int quantity;
    private String unit;
    private String lotCode;
    private LocalDate expires;
    private LocalDateTime createdAt;

}
