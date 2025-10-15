package medicod.domain.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterMedicineRequest {

    private String name;
    private String description;
    private int quantity;
    private String unit;
    private String

}
