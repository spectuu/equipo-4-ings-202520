package medicod.domain.dto.inventory;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InventoryUpdateRequest {

    @Min(0)
    private Integer quantity;

    @Size(max = 16)
    private String unit;

    @Size(max = 64)
    private String lotCode;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expires;

}
