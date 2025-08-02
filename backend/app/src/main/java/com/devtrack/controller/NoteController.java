package com.devtrack.controller;

import com.devtrack.dto.NoteDto;
import com.devtrack.model.Note;
import com.devtrack.service.NoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/{username}")
    public List<Note> getNotes(@PathVariable String username) {
        return noteService.getNotesByUser(username);
    }

    @PostMapping("/{username}")
    public Note addNote(@PathVariable String username, @RequestBody NoteDto noteDto) {
        return noteService.addNote(username, noteDto);
    }
}
