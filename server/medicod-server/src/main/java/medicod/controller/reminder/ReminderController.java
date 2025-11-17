package medicod.controller.reminder;

import lombok.RequiredArgsConstructor;
import medicod.domain.dto.BasicResponse;
import medicod.domain.dto.reminders.ReminderCreateRequest;
import medicod.domain.dto.reminders.ReminderUpdateRequest;
import medicod.domain.service.reminder.ReminderService;
import org.jooq.types.ULong;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService service;

    @GetMapping("/mine")
    public BasicResponse listMine() {
        return service.listMine();
    }

    @PostMapping
    public BasicResponse create(@RequestBody ReminderCreateRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public BasicResponse update(@PathVariable("id") Integer id,
                                @RequestBody ReminderUpdateRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public BasicResponse delete(@PathVariable("id") Integer id) {
        return service.delete(id);
    }

}
