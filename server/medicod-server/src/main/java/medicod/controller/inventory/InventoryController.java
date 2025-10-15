package medicod.controller.inventory;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import medicod.configuration.mapper.UserMapper;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.inventory.InventoryCreateRequest;
import medicod.domain.service.inventory.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Inventory")
@Schema(name = "InventoryController", description = "REST Controller for user inventory")
@CrossOrigin("*")
@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    @Autowired
    private final InventoryService inventoryService;

    @PostMapping("/add")
    public ResponseEntity<BasicResponse> add(
            @AuthenticationPrincipal UserMapper user,
            @RequestBody
            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true)
            @Valid
            InventoryCreateRequest request
    ) {
        long userId = user.getId().longValue();
        return inventoryService.addMedicationToInventory(userId, request);
    }

    @GetMapping("/mine")
    public ResponseEntity<BasicResponse> listMine(
            @AuthenticationPrincipal UserMapper user
    ) {
        long userId = user.getId().longValue();
        return inventoryService.listUserInventory(userId);
    }

    @GetMapping("/search")
    public ResponseEntity<BasicResponse> search(
            @AuthenticationPrincipal UserMapper user,
            @RequestParam("name") String medicationName
    ) {
        long userId = user.getId().longValue();
        return inventoryService.searchByName(userId, medicationName);
    }

}