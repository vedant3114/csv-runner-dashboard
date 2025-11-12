"use client"
import React, { useEffect, useMemo, useState } from 'react'
import CsvUploader, { Run } from '../components/CsvUploader'
import Summary from '../components/Summary'
import ChartView from '../components/ChartView'
import Leaderboard from '../components/Leaderboard'
import InsightsBanner from '../components/InsightsBanner'
import DatePicker from 'react-datepicker'
import Select from 'react-select'

type Aggregation = 'daily' | 'weekly' | 'monthly'

const STORAGE_KEY = 'csv-runs-v1'

export default function Page() {
  const [runs, setRuns] = useState<Run[]>([])
  const [error, setError] = useState<string | null>(null)

  // Filters / controls
  const [selectedPersons, setSelectedPersons] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [aggregation, setAggregation] = useState<Aggregation>('daily')

  // Load saved runs from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{ date: string; person: string; miles: number }>
        const restored: Run[] = parsed.map((r) => ({ date: new Date(r.date), person: r.person, miles: r.miles }))
        setRuns(restored)
      }
    } catch (err) {
      // ignore
    }
  }, [])

  // Persist runs whenever they change
  useEffect(() => {
    try {
      const serial = runs.map((r) => ({ date: r.date.toISOString(), person: r.person, miles: r.miles }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serial))
    } catch (err) {
      // ignore
    }
  }, [runs])

  // Unique persons derived from runs
  const persons = useMemo(() => Array.from(new Set(runs.map((r) => r.person))).sort(), [runs])

  // When available persons change and no selection, select all
  useEffect(() => {
    if (persons.length > 0 && selectedPersons.length === 0) {
      setSelectedPersons(persons)
    }
  }, [persons])

  const handleData = (data: Run[]) => {
    setRuns(data)
    setError(null)
    // set default dates
    if (data.length > 0) {
      const dates = data.map((d) => d.date.getTime()).sort((a, b) => a - b)
      setStartDate(new Date(dates[0]))
      setEndDate(new Date(dates[dates.length - 1]))
    }
  }

  const clearData = () => {
    setRuns([])
    setSelectedPersons([])
    setStartDate(null)
    setEndDate(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Filter runs by selected persons and date range
  const filteredRuns = useMemo(() => {
    return runs.filter((r) => {
      if (selectedPersons.length > 0 && !selectedPersons.includes(r.person)) return false
      if (startDate) {
        const s = new Date(startDate)
        s.setHours(0,0,0,0)
        if (r.date < s) return false
      }
      if (endDate) {
        const e = new Date(endDate)
        e.setHours(23,59,59,999)
        if (r.date > e) return false
      }
      return true
    })
  }, [runs, selectedPersons, startDate, endDate])

  return (
    <div>
      <CsvUploader onData={handleData} onError={(e) => setError(e)} />
      {error && <div className="error-message">{error}</div>}

      {runs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          {/* Controls */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h2>Filters & Controls</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ minWidth: 220 }}>
                <div className="stat-label">Date range</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <DatePicker selected={startDate} onChange={(d: Date | null) => setStartDate(d)} dateFormat="yyyy-MM-dd" placeholderText="Start" />
                  <span className="text-secondary">to</span>
                  <DatePicker selected={endDate} onChange={(d: Date | null) => setEndDate(d)} dateFormat="yyyy-MM-dd" placeholderText="End" />
                </div>
              </div>

              <div style={{ minWidth: 220 }}>
                <div className="stat-label">Runners</div>
                <div style={{ minWidth: 220 }}>
                  <Select
                    isMulti
                    options={persons.map((p) => ({ value: p, label: p }))}
                    value={persons
                      .map((p) => ({ value: p, label: p }))
                      .filter((o) => selectedPersons.includes(o.value))}
                    onChange={(v: any) => setSelectedPersons((v || []).map((x: any) => x.value))}
                  />
                </div>
              </div>

              <div>
                <div className="stat-label">Aggregation</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="stat-card" onClick={() => setAggregation('daily')} style={{ padding: '0.5rem 0.75rem' }}>
                    Daily
                  </button>
                  <button className="stat-card" onClick={() => setAggregation('weekly')} style={{ padding: '0.5rem 0.75rem' }}>
                    Weekly
                  </button>
                  <button className="stat-card" onClick={() => setAggregation('monthly')} style={{ padding: '0.5rem 0.75rem' }}>
                    Monthly
                  </button>
                </div>
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <button className="stat-card" onClick={clearData}>Clear Data</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <InsightsBanner runs={filteredRuns} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <Summary runs={filteredRuns} />
              <Leaderboard runs={filteredRuns} />
            </div>

            <ChartView runs={filteredRuns} aggregation={aggregation} />
          </div>
        </div>
      )}
    </div>
  )
}
