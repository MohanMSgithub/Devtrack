package com.devtrack.controller;

import com.devtrack.dto.NoteDto;
import com.devtrack.model.Note;
import com.devtrack.service.NoteService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = {
        "http://localhost:5173",                // Local Vite dev server
        "https://devtrack-nine.vercel.app"      // Your deployed frontend
})

public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<NoteDto> getNotes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return noteService.getNotesByUser(username).stream()
                .map(note -> new NoteDto(note.getId(), note.getTitle(), note.getContent()))
                .toList();
    }



    @PostMapping
    public Note addNote(@RequestBody NoteDto noteDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // ← extracted from JWT token
        return noteService.addNote(username, noteDto);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        noteService.deleteNoteById(id, username);
        return ResponseEntity.ok().build();
    }



}
