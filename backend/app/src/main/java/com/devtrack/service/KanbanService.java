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

    public KanbanCard updateCard(String username, Long cardId, CardDto cardDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        KanbanCard card = kanbanRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));

        if (!card.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Card does not belong to user");
        }

        if (cardDto.getTitle() != null && !cardDto.getTitle().trim().isEmpty()) {
            card.setTitle(cardDto.getTitle().trim());
        }

        if (cardDto.getDescription() != null) {
            card.setDescription(cardDto.getDescription().trim());
        }

        if (cardDto.getColumn() != null && !cardDto.getColumn().trim().isEmpty()) {
            card.setColumn(cardDto.getColumn().trim());
        }

        return kanbanRepository.save(card);
    }
    public void deleteCard(String username, Long cardId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        KanbanCard card = kanbanRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));

        if (!card.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to delete this card");
        }

        kanbanRepository.delete(card);
    }


}
