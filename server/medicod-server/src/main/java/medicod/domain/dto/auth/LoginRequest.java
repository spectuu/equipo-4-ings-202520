package medicod.domain.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @Email(message = "The email should be valid")
    @Schema(example = "spectu@gmail.com", description = "An unique email", required = true)
    @NotBlank(message = "The email is mandatory")
    private String email;

    @Size(min = 6, max = 100, message = "The password must have at least 6 characters")
    @Schema(example = "123abc", description = "A password with at least 6 characters", required = true)
    @NotBlank(message = "The password is mandatory")
    private String password;


}
