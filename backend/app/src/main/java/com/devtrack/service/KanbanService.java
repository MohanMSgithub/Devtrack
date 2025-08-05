package com.devtrack.service;

import com.devtrack.dto.CardDto;
import com.devtrack.model.KanbanCard;
import com.devtrack.model.User;
import com.devtrack.repository.KanbanRepository;
import com.devtrack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KanbanService {

    private final KanbanRepository kanbanRepository;
    private final UserRepository userRepository;

    public KanbanService(KanbanRepository kanbanRepository, UserRepository userRepository) {
        this.kanbanRepository = kanbanRepository;
        this.userRepository = userRepository;
    }

    public List<KanbanCard> getCardsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return kanbanRepository.findByUser(user);
    }

    public KanbanCard addCard(String username, CardDto cardDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        KanbanCard card = new KanbanCard();
        card.setColumn(cardDto.getColumn());
        card.setTitle(cardDto.getTitle());
        card.setDescription(cardDto.getDescription());
        card.setUser(user);

        return kanbanRepository.save(card);
    }
}
