import { useState, useRef, useEffect } from 'react';

function parseSortableItem(item) {
  const raw = typeof item === 'string' ? item : String(item ?? '');
  const separatorIndex = raw.indexOf(':');
  if (separatorIndex === -1) {
    return { id: '', text: raw };
  }

  return {
    id: raw.slice(0, separatorIndex).trim(),
    text: raw.slice(separatorIndex + 1).trim(),
  };
}

function areOrdersEqual(a = [], b = []) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (String(a[i]) !== String(b[i])) return false;
  }
  return true;
}

function shuffleOrder(items = []) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  // Avoid presenting the original order by default when possible.
  if (next.length > 1 && areOrdersEqual(next, items)) {
    const first = next.shift();
    next.push(first);
  }

  return next;
}

export default function DragSortComponent({ items = [], onChange, disabled }) {
  const [order, setOrder] = useState(items.slice());
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragIndex = useRef(null);

  useEffect(() => {
    const shuffled = shuffleOrder(items);
    setOrder(shuffled);
    setDraggingIndex(null);
    setDragOverIndex(null);
    dragIndex.current = null;

    // Let parent know the visible starting order.
    emitOrder(shuffled, { isInitial: true });
  }, [items]);

  function emitOrder(currentOrder, meta = {}) {
    if (!onChange) return;

    const ids = currentOrder.map((it) => {
      if (typeof it === 'string' && it.includes(':')) return it.split(':')[0].trim();
      return String(it);
    });
    const formatted = `order: [${ids.join(',')}]`;
    onChange(formatted, currentOrder, meta);
  }

  function handleDragStart(e, idx) {
    if (disabled) return;
    dragIndex.current = idx;
    setDraggingIndex(idx);
    setDragOverIndex(idx);
    try {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(idx));
    } catch (err) {
      // some environments may restrict dataTransfer; fallback to ref
    }
  }

  function handleDragOver(e, idx) {
    e.preventDefault();
    if (disabled) return;
    const from = dragIndex.current;
    const to = idx;
    if (from === null || from === to) return;

    const next = order.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    dragIndex.current = to;
    setDragOverIndex(to);
    setOrder(next);
  }

  function handleDrop(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (disabled) return;
    emitOrder(order);
    dragIndex.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    if (disabled) return;
    emitOrder(order);
    dragIndex.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
  }

  function handleKeyReorder(e, idx) {
    if (disabled) return;
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    e.preventDefault();
    const target = e.key === 'ArrowUp' ? idx - 1 : idx + 1;
    if (target < 0 || target >= order.length) return;

    const next = order.slice();
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setOrder(next);
    emitOrder(next);
  }

  return (
    <div className="drag-sort">
      <div className="drag-sort__header">
        <p className="drag-sort__label">Arrange the steps in the correct order</p>
        <span className="drag-sort__count">{order.length} items</span>
      </div>
      <p className="drag-sort__helper">Tip: Drag cards to reorder, or focus a card and use Arrow Up/Down.</p>
      <div className="drag-sort__list">
        {order.map((it, idx) => {
          const parsed = parseSortableItem(it);

          return (
            <div
              key={typeof it === 'string' ? `${it}-${idx}` : `${idx}-${String(it)}`}
              className={[
                'drag-sort__item',
                draggingIndex === idx ? 'drag-sort__item--dragging' : '',
                dragOverIndex === idx && draggingIndex !== idx ? 'drag-sort__item--over' : '',
                disabled ? 'drag-sort__item--disabled' : '',
              ].filter(Boolean).join(' ')}
              draggable={!disabled}
              tabIndex={disabled ? -1 : 0}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e)}
              onDragEnd={handleDragEnd}
              onKeyDown={(e) => handleKeyReorder(e, idx)}
            >
              <span className="drag-sort__rank">{idx + 1}</span>
              <div className="drag-sort__content">
                <span className="drag-sort__text">{parsed.text || String(it)}</span>
              </div>
              <span className="drag-sort__handle" aria-hidden="true">⋮⋮</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
