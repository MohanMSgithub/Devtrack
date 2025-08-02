import React from "react";

function KanbanColumn({ columnTitle, cards }) {
  return (
    <div className="kanban-column">
      <h4>{columnTitle}</h4>
      {cards.map((card, idx) => (
        <div key={idx} className="kanban-card">
          <h5>{card.title}</h5>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
}

export default KanbanColumn;