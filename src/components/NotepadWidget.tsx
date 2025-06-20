'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function NotepadWidget() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    // Load from sessionStorage or use default
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('notepad-todos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to default if parsing fails
        }
      }
    }
    return [
      { id: '1', text: 'Complete case study', completed: false },
      { id: '2', text: 'Review notes', completed: false },
      { id: '3', text: 'Practice scenarios', completed: false },
    ];
  });

  const [newTodoText, setNewTodoText] = useState('');

  // Save todos to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('notepad-todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = useCallback(() => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      };
      setTodos(prev => [...prev, newTodo]);
      setNewTodoText('');
    }
  }, [newTodoText]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  }, [addTodo]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-card)',
    borderRadius: '24px 24px 12px 12px',
    fontFamily: 'VT323, monospace',
    color: 'var(--color-text)',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px 20px 12px 20px',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--color-accent)',
    margin: '0 0 8px 0',
    fontFamily: 'VT323, monospace',
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: 'var(--color-text)',
    fontFamily: 'VT323, monospace',
    fontSize: '14px',
  };

  const addButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontFamily: 'VT323, monospace',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    whiteSpace: 'nowrap',
  };

  const todoListStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const todoItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: 'var(--color-accent)',
  };

  const todoTextStyle = (completed: boolean): React.CSSProperties => ({
    flex: 1,
    fontSize: '14px',
    textDecoration: completed ? 'line-through' : 'none',
    color: completed ? 'rgba(255, 255, 255, 0.5)' : 'var(--color-text)',
    fontFamily: 'VT323, monospace',
    wordBreak: 'break-word',
  });

  const deleteButtonStyle: React.CSSProperties = {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#ff6b6b',
    fontFamily: 'VT323, monospace',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontStyle: 'italic',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>📝 Quick Notes</h3>
        <div style={inputContainerStyle}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a task..."
            style={inputStyle}
          />
          <button onClick={addTodo} style={addButtonStyle}>
            Add
          </button>
        </div>
      </div>
      
      <div style={todoListStyle}>
        {todos.length === 0 ? (
          <div style={emptyStateStyle}>
            No tasks yet. Add your first one above!
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} style={todoItemStyle}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={checkboxStyle}
              />
              <span style={todoTextStyle(todo.completed)}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={deleteButtonStyle}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 