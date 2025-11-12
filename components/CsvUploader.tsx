"use client"
import React from 'react'
import Papa from 'papaparse'

export type Run = { date: Date; person: string; miles: number }

type Props = {
  onData: (data: Run[]) => void
  onError: (message: string) => void
}

const expectedKeys = ['date', 'person', 'miles']

export default function CsvUploader({ onData, onError }: Props) {
  const handleFile = (file?: File) => {
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, errors, meta } = results as Papa.ParseResult<Record<string, string>> & { errors: any[] }
        if (errors && errors.length > 0) {
          onError('CSV parse error: ' + errors[0].message)
          return
        }

        // Normalize headers
        const headers = meta.fields || []
        const normalized = headers.map((h) => (h || '').toLowerCase().trim())

        // Map expected keys to actual header names
        const map: Record<string, string | undefined> = {}
        expectedKeys.forEach((k) => {
          const idx = normalized.indexOf(k)
          if (idx !== -1) map[k] = headers[idx]
        })

        // Check required headers
        for (const k of expectedKeys) {
          if (!map[k]) {
            onError(`Missing required header: ${k}`)
            return
          }
        }

        const rows: Run[] = []
        for (let i = 0; i < data.length; i++) {
          const row = data[i] as Record<string, string>
          const dateStr = row[map['date']!]?.trim() || ''
          const person = (row[map['person']!] || '').trim()
          const milesStr = (row[map['miles']!] || '').trim()

          if (!dateStr || !person || !milesStr) {
            onError(`Invalid or missing value on row ${i + 2}`)
            return
          }

          const date = new Date(dateStr)
          if (isNaN(date.getTime())) {
            onError(`Invalid date format on row ${i + 2}: "${dateStr}" (expected YYYY-MM-DD)`)
            return
          }

          const miles = Number(milesStr)
          if (!isFinite(miles)) {
            onError(`Invalid miles value on row ${i + 2}: "${milesStr}"`)
            return
          }

          rows.push({ date, person, miles })
        }

        onData(rows)
      },
      error: (err) => {
        onError(String(err))
      }
    })
  }

  return (
    <div className="upload-zone">
      <label className="stat-label" style={{ display: 'block', marginBottom: '1rem' }}>
        Upload Running Data CSV
      </label>
      <input
        type="file"
        accept="text/csv,application/vnd.ms-excel"
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ 
          display: 'block',
          width: '100%',
          padding: '1rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          marginBottom: '1rem'
        }}
      />
      <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
        CSV must include headers: date (YYYY-MM-DD), person, miles
      </p>
    </div>
  )
}
