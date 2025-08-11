package com.devtrack.controller;

import com.devtrack.dto.CardDto;
import com.devtrack.model.KanbanCard;
import com.devtrack.service.KanbanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kanban")
@CrossOrigin(origins = {
        "http://localhost:5173",                // Local Vite dev server
        "https://devtrack-nine.vercel.app"      // Your deployed frontend
})

public class KanbanController {

    private final KanbanService kanbanService;

    public KanbanController(KanbanService kanbanService) {
        this.kanbanService = kanbanService;
    }

    @GetMapping("/{username}")
    public List<KanbanCard> getCards(@PathVariable String username) {
        return kanbanService.getCardsByUser(username);
    }

    @PostMapping("/{username}")
    public KanbanCard addCard(@PathVariable String username, @RequestBody CardDto cardDto) {
        return kanbanService.addCard(username, cardDto);
    }
}
