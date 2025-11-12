"use client"
import React from 'react'
import { Run } from './CsvUploader'

type Props = { runs: Run[] }

function format(n: number) {
  return Math.round(n * 100) / 100
}

export default function Summary({ runs }: Props) {
  const total = runs.reduce((s, r) => s + r.miles, 0)
  const avg = total / runs.length
  const min = Math.min(...runs.map((r) => r.miles))
  const max = Math.max(...runs.map((r) => r.miles))

  // Per person
  const byPerson: Record<string, { total: number; count: number; min: number; max: number }> = {}
  runs.forEach((r) => {
    const p = r.person
    if (!byPerson[p]) byPerson[p] = { total: 0, count: 0, min: r.miles, max: r.miles }
    byPerson[p].total += r.miles
    byPerson[p].count += 1
    byPerson[p].min = Math.min(byPerson[p].min, r.miles)
    byPerson[p].max = Math.max(byPerson[p].max, r.miles)
  })

  return (
    <div className="card">
      <h2>Summary Metrics</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="stat-card">
          <div className="stat-label">Average Distance</div>
          <div className="stat-value">{format(avg)} mi</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Shortest Run</div>
          <div className="stat-value">{format(min)} mi</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Longest Run</div>
          <div className="stat-value">{format(max)} mi</div>
        </div>
      </div>

      <h2>Runner Stats</h2>
      <div className="person-stats">
        {Object.entries(byPerson).map(([person, stats]) => (
          <div key={person} className="person-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="person-name">{person}</div>
              <div className="text-secondary">{stats.count} runs</div>
            </div>
            <div className="person-metrics">
              Average: {format(stats.total / stats.count)} mi • 
              Range: {format(stats.min)} – {format(stats.max)} mi
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
