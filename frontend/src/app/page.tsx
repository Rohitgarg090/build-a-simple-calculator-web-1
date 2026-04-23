'use client'

import { useState, useEffect, useCallback } from 'react';
import { Delete, Clock, X } from 'lucide-react';

const COLORS = {
  primary: '#6366f1',
  background: '#1a1a2e',
  surface: '#16213e',
  text: '#f1f5f9',
  accent: '#e94560',
  border: '#2d3748',
};

export default function Page() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveHistory = (entries) => {
    localStorage.setItem('calc_history', JSON.stringify(entries));
    setHistory(entries);
  };

  const addToHistory = (expr, result) => {
    const entry = {
      id: Date.now(),
      expression: expr,
      result,
      timestamp: new Date().toLocaleTimeString(),
    };
    const updated = [entry, ...history].slice(0, 50);
    saveHistory(updated);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
  };

  const handleHistorySelect = (entry) => {
    setDisplay(String(entry.result));
    setExpression('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustCalculated(true);
    setShowHistory(false);
  };

  const inputDigit = useCallback((digit) => {
    if (justCalculated) {
      setDisplay(String(digit));
      setExpression('');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setJustCalculated(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => (prev === '0' ? String(digit) : prev + digit));
    }
  }, [justCalculated, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (justCalculated) {
      setDisplay('0.');
      setExpression('');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setJustCalculated(false);
      return;
    }
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  }, [display, justCalculated, waitingForOperand]);

  const handleOperator = useCallback((op) => {
    const current = parseFloat(display);
    setJustCalculated(false);

    if (prevValue !== null && !waitingForOperand) {
      let result;
      switch (operator) {
        case '+': result = prevValue + current; break;
        case '-': result = prevValue - current; break;
        case '×': result = prevValue * current; break;
        case '÷': result = current !== 0 ? prevValue / current : 'Error'; break;
        default: result = current;
      }
      const resultStr = result === 'Error' ? 'Error' : parseFloat(result.toFixed(10)).toString();
      setDisplay(resultStr);
      setPrevValue(result === 'Error' ? null : result);
      setExpression(`${resultStr} ${op}`);
    } else {
      setPrevValue(current);
      setExpression(`${display} ${op}`);
    }

    setOperator(op);
    setWaitingForOperand(true);
  }, [display, operator, prevValue, waitingForOperand]);

  const calculate = useCallback(() => {
    if (prevValue === null || waitingForOperand) return;
    const current = parseFloat(display);
    let result;
    switch (operator) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '×': result = prevValue * current; break;
      case '÷': result = current !== 0 ? prevValue / current : 'Error'; break;
      default: result = current;
    }
    const resultStr = result === 'Error' ? 'Error' : parseFloat(result.toFixed(10)).toString();
    const fullExpr = `${expression} ${display}`;
    addToHistory(fullExpr, resultStr);
    setDisplay(resultStr);
    setExpression(fullExpr + ' =');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustCalculated(true);
  }, [display, expression, operator, prevValue, waitingForOperand, history]);

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustCalculated(false);
  };

  const clearEntry = () => {
    setDisplay('0');
    setJustCalculated(false);
  };

  const backspace = () => {
    if (justCalculated) { clearAll(); return; }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    setDisplay((prev) => (parseFloat(prev) * -1).toString());
    setJustCalculated(false);
  };

  const percentage = () => {
    setDisplay((prev) => (parseFloat(prev) / 100).toString());
    setJustCalculated(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(parseInt(e.key));
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('×');
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
      else if (e.key === 'Enter' || e.key === '=') calculate();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clearAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, handleOperator, calculate, backspace]);

  const btnStyle = (variant = 'default') => {
    const base = {
      border: 'none',
      borderRadius: '14px',
      fontSize: '1.25rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '70px',
      userSelect: 'none',
      outline: 'none',
    };
    if (variant === 'operator') return { ...base, background: 'rgba(99,102,241,0.2)', color: COLORS.primary, border: `1px solid rgba(99,102,241,0.3)` };
    if (variant === 'equals') return { ...base, background: `linear-gradient(135deg, ${COLORS.primary}, #818cf8)`, color: '#fff', boxShadow: `0 4px 20px rgba(99,102,241,0.4)` };
    if (variant === 'function') return { ...base, background: 'rgba(233,69,96,0.15)', color: COLORS.accent, border: `1px solid rgba(233,69,96,0.25)`, fontSize: '1rem' };
    if (variant === 'clear') return { ...base, background: 'rgba(233,69,96,0.2)', color: COLORS.accent, border: `1px solid rgba(233,69,96,0.3)` };
    return { ...base, background: 'rgba(255,255,255,0.05)', color: COLORS.text, border: `1px solid ${COLORS.border}` };
  };

  const displayFontSize = display.length > 12 ? '1.5rem' : display.length > 8 ? '2rem' : display.length > 5 ? '2.5rem' : '3rem';

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ color: COLORS.text, fontSize: '1.5rem', fontWeight: '700', margin: 0, background: `linear-gradient(135deg, ${COLORS.primary}, #818cf8)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Calculator
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{ background: showHistory ? `rgba(99,102,241,0.2)` : 'rgba(255,255,255,0.05)', border: `1px solid ${showHistory ? COLORS.primary : COLORS.border}`, borderRadius: '10px', color: showHistory ? COLORS.primary : COLORS.text, cursor: 'pointer', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }}
          >
            <Clock size={16} /> History {history.length > 0 && `(${history.length})`}
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div style={{ background: COLORS.surface, borderRadius: '20px', border: `1px solid ${COLORS.border}`, padding: '16px', marginBottom: '16px', maxHeight: '260px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: COLORS.text, fontWeight: '600', fontSize: '0.9rem' }}>Calculation History</span>
              {history.length > 0 && (
                <button onClick={clearHistory} style={{ background: 'rgba(233,69,96,0.15)', border: `1px solid rgba(233,69,96,0.3)`, borderRadius: '8px', color: COLORS.accent, cursor: 'pointer', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600' }}>
                  Clear All
                </button>
              )}
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {history.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.85rem', margin: '20px 0' }}>No calculations yet</p>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', marginBottom: '6px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
                    onClick={() => handleHistorySelect(entry)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.expression}</div>
                      <div style={{ color: COLORS.primary, fontWeight: '700', fontSize: '1rem' }}>= {entry.result}</div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{entry.timestamp}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteHistoryItem(entry.id); }}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', marginLeft: '8px', flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = COLORS.accent}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Calculator */}
        <div style={{ background: COLORS.surface, borderRadius: '24px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
          {/* Display */}
          <div style={{ padding: '28px 24px 20px', background: 'rgba(0,0,0,0.2)', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', minHeight: '20px', marginBottom: '8px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {expression || '\u00A0'}
            </div>
            <div style={{ color: COLORS.text, fontSize: displayFontSize, fontWeight: '300', letterSpacing: '-1px', lineHeight: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'font-size 0.2s' }}>
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {/* Row 1 */}
            <button style={btnStyle('clear') as React.CSSProperties} onClick={clearAll}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >AC</button>
            <button style={btnStyle('function')} onClick={toggleSign}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >+/-</button>
            <button style={btnStyle('function')} onClick={percentage}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >%</button>
            <button style={btnStyle('operator')} onClick={() => handleOperator('÷')}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >÷</button>

            {/* Row 2 */}
            {[7, 8, 9].map(n => (
              <button key={n} style={btnStyle('default')} onClick={() => inputDigit(n)}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >{n}</button>
            ))}
            <button style={btnStyle('operator')} onClick={() => handleOperator('×')}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >×</button>

            {/* Row 3 */}
            {[4, 5, 6].map(n => (
              <button key={n} style={btnStyle('default')} onClick={() => inputDigit(n)}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >{n}</button>
            ))}
            <button style={btnStyle('operator')} onClick={() => handleOperator('-')}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >−</button>

            {/* Row 4 */}
            {[1, 2, 3].map(n => (
              <button key={n} style={btnStyle('default')} onClick={() => inputDigit(n)}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >{n}</button>
            ))}
            <button style={btnStyle('operator')} onClick={() => handleOperator('+')}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >+</button>

            {/* Row 5 */}
            <button style={{ ...btnStyle('default'), gridColumn: 'span 1' }} onClick={() => inputDigit(0)}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >0</button>
            <button style={btnStyle('default')} onClick={inputDecimal}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >.</button>
            <button style={{ ...btnStyle('function'), fontSize: '0.85rem' }} onClick={backspace}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Delete size={20} />
            </button>
            <button style={btnStyle('equals')} onClick={calculate}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >=</button>
          </div>

          {/* Keyboard hint */}
          <div style={{ textAlign: 'center', paddingBottom: '16px', color: '#475569', fontSize: '0.72rem' }}>
            Keyboard shortcuts supported · Esc to clear
          </div>
        </div>
      </div>
    </div>
  );
}
