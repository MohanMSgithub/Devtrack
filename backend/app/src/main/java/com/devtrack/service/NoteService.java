package com.devtrack.service;

import com.devtrack.dto.NoteDto;
import com.devtrack.model.Note;
import com.devtrack.model.User;
import com.devtrack.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

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
}