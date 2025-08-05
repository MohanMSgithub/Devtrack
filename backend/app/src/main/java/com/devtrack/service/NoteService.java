package com.devtrack.service;

import com.devtrack.dto.NoteDto;
import com.devtrack.model.Note;
import com.devtrack.model.User;
import com.devtrack.repository.NoteRepository;
import com.devtrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    @Autowired
//    private NoteRepository noteRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<Note> getNotesByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findByUser(user);
    }

    public Note saveNote(NoteDto noteDto, User user) {
        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setContent(noteDto.getContent());
        note.setUser(user);
        return noteRepository.save(note);
    }

    public List<Note> getNotes(User user) {
        return noteRepository.findByUser(user);
    }
    public Note addNote(String username, NoteDto noteDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = new Note();
        note.setTitle(noteDto.getTitle());
        note.setContent(noteDto.getContent());
        note.setUser(user);

        return noteRepository.save(note);
    }
}