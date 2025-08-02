package com.devtrack.repository;

import com.devtrack.model.KanbanCard;
import com.devtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KanbanRepository extends JpaRepository<KanbanCard, Long> {
    List<KanbanCard> findByUser(User user);
}
