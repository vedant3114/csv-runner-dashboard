"use client"
import React, { useMemo } from 'react'
import { Run } from './CsvUploader'

type Props = { runs: Run[] }

export default function Leaderboard({ runs }: Props) {
  const table = useMemo(() => {
    const byPerson: Record<string, { total: number; count: number }> = {}
    runs.forEach((r) => {
      if (!byPerson[r.person]) byPerson[r.person] = { total: 0, count: 0 }
      byPerson[r.person].total += r.miles
      byPerson[r.person].count += 1
    })
    const arr = Object.entries(byPerson).map(([person, stats]) => ({ person, total: stats.total, avg: stats.total / stats.count, count: stats.count }))
    arr.sort((a, b) => b.total - a.total)
    return arr
  }, [runs])

  const medals = ['🥇', '🥈', '🥉']

  const exportCsv = () => {
    if (table.length === 0) return
    const rows = [['person','total','avg','count'], ...table.map(r => [r.person, String(Math.round(r.total * 100) / 100), String(Math.round(r.avg * 100) / 100), String(r.count)])]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leaderboard.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Leaderboard</h2>
        <div>
          <button className="stat-card" onClick={exportCsv} style={{ padding: '0.4rem 0.6rem' }}>Export CSV</button>
        </div>
      </div>
      {table.length === 0 ? (
        <div className="text-secondary">No data</div>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {table.map((row, i) => (
            <div key={row.person} className="person-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ fontSize: '1.25rem' }}>{i < 3 ? medals[i] : i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{row.person}</div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{row.count} runs • avg {Math.round(row.avg * 100) / 100} mi</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{Math.round(row.total * 100) / 100} mi</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
