export const tokens = {
  primary: '#6366f1',
  primaryFg: '#ffffff',
  background: '#1a1a2e',
  surface: '#16213e',
  surfaceAlt: '#0f3460',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  accent: '#e94560',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  border: '#2d3748',
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  borderRadius: '12px',
  borderRadiusSm: '4px',
  borderRadiusLg: '16px',
} as const;

export type Tokens = typeof tokens;
}