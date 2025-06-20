import React from 'react';

/**
 * Props for LeaderboardTable
 * @template T Row type
 */
interface LeaderboardTableProps<T extends Record<string, unknown>> {
  columns: { key: keyof T; label: string; hideOnMobile?: boolean }[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  sortKey?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  floatingUserRow?: React.ReactNode;
  mobileColumns?: (keyof T)[]; // Only show these columns on mobile if provided
  onRetry?: () => void; // Retry callback for error state
}

/**
 * LeaderboardTable renders a responsive leaderboard table with optional floating user row.
 * - On desktop: full table with sortable columns
 * - On mobile: only columns with hideOnMobile !== true are shown
 */
export default function LeaderboardTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading,
  error,
  sortKey,
  sortOrder,
  onSort,
  floatingUserRow,
  mobileColumns,
  onRetry,
}: LeaderboardTableProps<T>) {
  // Responsive: detect mobile
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Filter columns for mobile if mobileColumns is provided
  const visibleColumns = isMobile && mobileColumns
    ? columns.filter(col => mobileColumns.includes(col.key))
    : columns;

  if (loading) {
    return <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }} aria-live="polite">Loading…</div>;
  }
  if (error) {
    return (
      <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }} role="alert" aria-live="assertive">
        Error: {error}
        {onRetry && (
          <button
            onClick={onRetry}
            style={{ marginLeft: 16, background: '#d77400', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontFamily: 'VT323', fontSize: 18, cursor: 'pointer' }}
            aria-label="Retry loading leaderboard"
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  if (!loading && rows.length === 0) {
    return <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }} aria-live="polite">No results found.</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      {floatingUserRow && (
        <div style={{ marginBottom: 16 }}>{floatingUserRow}</div>
      )}
      {!isMobile ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'VT323', color: '#ffd5a6', background: 'var(--color-bg)' }} aria-label="Leaderboard table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  style={{
                    padding: '12px 8px',
                    borderBottom: '2px solid #d77400',
                    cursor: onSort ? 'pointer' : 'default',
                    background: '#000',
                    fontSize: 20,
                  }}
                  onClick={onSort ? () => onSort(col.key) : undefined}
                  tabIndex={onSort ? 0 : undefined}
                  aria-label={col.label + (onSort ? ' (sortable)' : '')}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span style={{ marginLeft: 4 }}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#181818' : '#222', fontSize: 18 }}>
                {columns.map(col => (
                  <td key={String(col.key)} style={{ 
                    padding: '10px 8px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid #333',
                    wordBreak: 'break-word' as const,
                    maxWidth: col.key === 'username' ? '200px' : undefined,
                  }}>
                    {row[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'VT323', color: '#ffd5a6', background: 'var(--color-bg)' }} aria-label="Leaderboard table (mobile)">
          <thead>
            <tr>
              {visibleColumns.map(col => (
                <th
                  key={String(col.key)}
                  style={{
                    padding: '12px 8px',
                    borderBottom: '2px solid #d77400',
                    background: '#000',
                    fontSize: 20,
                  }}
                  aria-label={col.label}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#181818' : '#222', fontSize: 18 }}>
                {visibleColumns.map(col => (
                  <td key={String(col.key)} style={{ 
                    padding: '10px 8px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid #333',
                    wordBreak: 'break-word' as const,
                    maxWidth: col.key === 'username' ? '150px' : undefined,
                  }}>
                    {row[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 