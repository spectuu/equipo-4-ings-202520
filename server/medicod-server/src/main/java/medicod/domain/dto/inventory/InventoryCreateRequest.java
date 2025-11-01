package medicod.domain.dto.inventory;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.types.UInteger;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryCreateRequest {

    @NotBlank @Size(max = 120)
    private String medicationName;

    @Min(0)
    private int quantity;

    @Size(max = 16)
    private String unit;

    @Size(max = 64)
    private String lotCode;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expires;

    @Size(max = 2000)
    private String medicationDescription;

}
