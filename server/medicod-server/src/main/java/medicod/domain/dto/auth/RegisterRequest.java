package medicod.domain.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @Size(min = 4, max = 20, message = "The username should be between 4 and 20 characters")
    @Schema(example = "example", description = "An unique username", required = true)
    @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "The username must be alphanumeric and contain no spaces")
    @NotBlank(message = "The username is mandatory")
    private String username;

    @Email(message = "The email should be valid")
    @Schema(example = "example@gmail.com", description = "An unique email", required = true)
    @NotBlank(message = "The email is mandatory")
    private String email;

    @Size(min = 6, max = 100, message = "The password must have at least 6 characters")
    @Schema(example = "Abcd1234", description = "A password with at least 6 characters", required = true)
    @NotBlank(message = "The password is mandatory")
    private String password;

}
