import React from 'react';

/**
 * Props for LeaderboardTable
 * @template T Row type
 */
interface LeaderboardTableProps<T> {
  columns: { key: keyof T; label: string; hideOnMobile?: boolean }[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  sortKey?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  floatingUserRow?: React.ReactNode;
}

/**
 * LeaderboardTable renders a responsive leaderboard table with optional floating user row.
 * - On desktop: full table with sortable columns
 * - On mobile: only columns with hideOnMobile !== true are shown
 */
export default function LeaderboardTable<T extends { [key: string]: any }>({
  columns,
  rows,
  loading,
  error,
  sortKey,
  sortOrder,
  onSort,
  floatingUserRow,
}: LeaderboardTableProps<T>) {
  // Responsive: detect mobile
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (loading) {
    return <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }}>Loading…</div>;
  }
  if (error) {
    return <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }}>Error: {error}</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      {floatingUserRow && (
        <div style={{ marginBottom: 16 }}>{floatingUserRow}</div>
      )}
      {!isMobile ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'VT323', color: '#ffd5a6', background: 'var(--color-bg)' }}>
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
                  <td key={String(col.key)} style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #333' }}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((row, i) => (
            <div key={i} style={{ background: '#181818', border: '2px solid #d77400', borderRadius: 12, padding: 16, fontSize: 18, color: '#ffd5a6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>{row[columns[0].key]}</span>
              <span>{row[columns[1].key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 