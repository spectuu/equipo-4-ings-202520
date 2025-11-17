package medicod.controller.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.auth.LoginRequest;
import medicod.domain.dto.auth.RegisterRequest;
import medicod.domain.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Schema(name = "AuthController", description = "REST Controller for authentication")
@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<BasicResponse> register(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true)
            @Valid
            RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<BasicResponse> login(
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true)
            @Valid
            LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

}
