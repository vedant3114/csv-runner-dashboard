"use client"
import React, { useMemo } from 'react'
import { Run } from './CsvUploader'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

type Aggregation = 'daily' | 'weekly' | 'monthly'
type Props = { runs: Run[]; aggregation?: Aggregation }

const COLORS = ['#2563eb', '#a855f7', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6b7280']

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function ChartView({ runs, aggregation = 'daily' }: Props) {
  // Build a date x person pivot table with aggregation option
  const { data, persons } = useMemo(() => {
    const personsSet = new Set<string>()
    const byKey: Record<string, Record<string, number>> = {}

    function getWeekKey(d: Date) {
      // ISO week number algorithm
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      const dayNum = date.getUTCDay() || 7
      date.setUTCDate(date.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
      return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
    }

    function getKey(d: Date) {
      if (aggregation === 'monthly') {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      }
      if (aggregation === 'weekly') return getWeekKey(d)
      return isoDate(d)
    }

    runs.forEach((r) => {
      const k = getKey(r.date)
      personsSet.add(r.person)
      byKey[k] = byKey[k] || {}
      byKey[k][r.person] = (byKey[k][r.person] || 0) + r.miles
    })

    const keys = Object.keys(byKey).sort()
    const dataArr = keys.map((k) => ({ date: k, ...byKey[k] }))
    return { data: dataArr, persons: Array.from(personsSet) }
  }, [runs, aggregation])

  return (
    <div className="chart-container">
      <h2>Distance Over Time</h2>
      <div style={{ width: '100%', height: 400, marginTop: '1rem' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'var(--text-secondary)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--text-secondary)' }}
              tickLine={{ stroke: 'var(--border)' }}
              label={{ value: 'Distance (miles)', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '1rem',
                color: 'var(--text-secondary)'
              }}
            />
            {persons.map((p, i) => (
              <Line 
                key={p} 
                type="monotone" 
                dataKey={p} 
                stroke={COLORS[i % COLORS.length]} 
                strokeWidth={2.5}
                dot={{ fill: COLORS[i % COLORS.length], strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
