package medicod.domain.service.auth;

import lombok.extern.slf4j.Slf4j;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.auth.AuthResponse;
import medicod.domain.dto.auth.LoginRequest;
import medicod.domain.dto.auth.RegisterRequest;
import medicod.domain.repository.account.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;

@Slf4j
@Service
public class AuthService {

    /*

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity<BasicResponse> login(LoginRequest loginRequest) {

        MedicodUsersRecord accountByEmail = accountRepository.getAccountByEmail(loginRequest.getEmail());

        if (ObjectUtils.isEmpty(accountByEmail)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(BasicResponse.builder()
                            .code(404)
                            .message("NOT_FOUND")
                            .display("Account not found")
                            .build());

        }

        if(!passwordEncoder.matches(loginRequest.getPassword(), accountByEmail.getPasswordHash())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(BasicResponse.builder()
                            .code(401)
                            .message("UNAUTHORIZED")
                            .display("Invalid credentials")
                            .build());
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(accountByEmail.getName(), loginRequest.getPassword()));

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(BasicResponse.builder()
                        .code(200)
                        .message("SUCCESS")
                        .display("Login successful")
                        .data(AuthResponse.builder()
                                .token(jwtService.getToken(accountByEmail))
                                .build())
                        .build());

    }

    public ResponseEntity<BasicResponse> register(RegisterRequest request) {

        MedicodUsersRecord account = accountRepository.getAccountByEmailOrUsername(request.getEmail(), request.getUsername());

        if(request.getUsername().length() > 100)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(BasicResponse.builder()
                            .code(400)
                            .message("ERROR")
                            .display("Username must be at least 100 characters long")
                            .build());

        if(request.getPassword().length() > 50)
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(BasicResponse.builder()
                            .code(400)
                            .message("ERROR")
                            .display("Password must be at least 50 characters long")
                            .build());

        if(!ObjectUtils.isEmpty(account)) {

            if (account.getEmail().equals(request.getEmail())) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(BasicResponse.builder()
                                .code(409)
                                .message("ERROR")
                                .display("The email already exists")
                                .build());
            }

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(BasicResponse.builder()
                            .code(409)
                            .message("ERROR")
                            .display("The username already exists")
                            .build());

        }

        MedicodUsersRecord record = new MedicodUsersRecord();

        record.setName(request.getUsername());
        record.setEmail(request.getEmail());
        record.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        record.setCreatedAt(LocalDateTime.now());
        record.setRole(MedicodUsersRole.USER);

        accountRepository.save(record);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BasicResponse.builder()
                        .code(200)
                        .message("SUCCESS")
                        .display("Account created successfully")
                        .data(AuthResponse.builder()
                                .token(jwtService.getToken(record))
                                .build())
                        .build());

    }

     */

}
