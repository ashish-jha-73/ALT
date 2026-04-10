import { useEffect, useMemo, useState } from 'react';

export default function DragDropComponent({ items = [], categories = [], onResult, disabled }) {
  const [assignments, setAssignments] = useState({});
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const itemsSignature = useMemo(() => JSON.stringify(items), [items]);
  const categoriesSignature = useMemo(() => JSON.stringify(categories), [categories]);

  useEffect(() => {
    setAssignments({});
    setDragging(null);
    setDragOver(null);
  }, [itemsSignature, categoriesSignature]);

  const assignedItems = Object.values(assignments).flat();
  const unassigned = items.filter((item) => !assignedItems.includes(item));

  const handleDragStart = (item) => {
    if (disabled) return;
    setDragging(item);
  };

  const handleDrop = (category) => {
    if (!dragging || disabled) return;

    const next = { ...assignments };
    Object.keys(next).forEach((cat) => {
      next[cat] = (next[cat] || []).filter((i) => i !== dragging);
    });
    next[category] = [...(next[category] || []), dragging];
    setAssignments(next);
    setDragging(null);
    setDragOver(null);

    if (onResult) onResult(next);
  };

  const removeFromCategory = (category, item) => {
    if (disabled) return;
    const next = { ...assignments };
    next[category] = (next[category] || []).filter((i) => i !== item);
    setAssignments(next);
    if (onResult) onResult(next);
  };

  return (
    <div className="drag-drop">
      <div className="drag-drop__source">
        <p className="drag-drop__source-label">Drag items to the correct category:</p>
        <div className="drag-drop__items">
          {unassigned.map((item) => (
            <div
              key={item}
              className="drag-drop__item"
              draggable={!disabled}
              onDragStart={() => handleDragStart(item)}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
            >
              {item}
            </div>
          ))}
          {unassigned.length === 0 && (
            <p className="drag-drop__empty">All items placed!</p>
          )}
        </div>
      </div>

      <div className="drag-drop__targets">
        {categories.map((cat) => (
          <div
            key={cat}
            className={`drag-drop__zone ${dragOver === cat ? 'drag-drop__zone--over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(cat); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); handleDrop(cat); }}
          >
            <span className="drag-drop__zone-label">{cat}</span>
            <div className="drag-drop__zone-items">
              {(assignments[cat] || []).map((item) => (
                <div
                  key={item}
                  className="drag-drop__item drag-drop__item--placed"
                  onClick={() => removeFromCategory(cat, item)}
                >
                  {item}
                  <span className="drag-drop__item-remove">&times;</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
