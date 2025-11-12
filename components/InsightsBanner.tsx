"use client"
import React, { useMemo } from 'react'
import { Run } from './CsvUploader'

type Props = { runs: Run[] }

// Simple insight: compare totals for last 7 days vs previous 7 days
export default function InsightsBanner({ runs }: Props) {
  const insight = useMemo(() => {
    if (runs.length === 0) return null
    const now = new Date()
    const end = new Date(now)
    end.setHours(23,59,59,999)
    const weekStart = new Date(end)
    weekStart.setDate(end.getDate() - 6)
    weekStart.setHours(0,0,0,0)
    const prevStart = new Date(weekStart)
    prevStart.setDate(weekStart.getDate() - 7)
    prevStart.setHours(0,0,0,0)
    const prevEnd = new Date(weekStart)
    prevEnd.setHours(0,0,0,0)
    prevEnd.setMilliseconds(-1)

    const totalsThis: Record<string, number> = {}
    const totalsPrev: Record<string, number> = {}

    runs.forEach(r => {
      if (r.date >= weekStart && r.date <= end) totalsThis[r.person] = (totalsThis[r.person] || 0) + r.miles
      if (r.date >= prevStart && r.date < weekStart) totalsPrev[r.person] = (totalsPrev[r.person] || 0) + r.miles
    })

    const persons = Array.from(new Set([...Object.keys(totalsThis), ...Object.keys(totalsPrev)]))
    if (persons.length === 0) return null

    const changes = persons.map(p => {
      const a = totalsThis[p] || 0
      const b = totalsPrev[p] || 0
      const pct = b === 0 ? (a === 0 ? 0 : 100) : ((a - b) / b) * 100
      return { person: p, thisWeek: a, prevWeek: b, pct }
    })

    changes.sort((x,y) => Math.abs(y.pct) - Math.abs(x.pct))
    const top = changes[0]
    if (!top) return null

    if (Math.abs(top.pct) < 5) return null

    const verb = top.pct > 0 ? 'more' : 'less'
    const pctText = Math.round(Math.abs(top.pct))
    return `${top.person} ran ${pctText}% ${verb} this week (${Math.round(top.thisWeek*100)/100} mi) vs last week (${Math.round(top.prevWeek*100)/100} mi)`
  }, [runs])

  if (!insight) return null

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <strong>Insight:</strong> <span style={{ marginLeft: '0.5rem' }}>{insight}</span>
    </div>
  )
}
