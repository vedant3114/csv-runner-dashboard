# CSV Runner Dashboard

## Project Overview

This project is a Next.js application built with the app router, TypeScript, and modern CSS for styling. It's a fully interactive dashboard for analyzing running data.

The application allows users to upload a CSV file containing running data (date, person, miles run). It parses and validates the data, then displays comprehensive summary metrics, per-person statistics, a leaderboard, time-series charts with multiple aggregation levels, and week-over-week insights.

## 🎯 Key Features

### Core Functionality

1. **CSV Upload & Validation** ✓
   - Upload running data with headers: `date` (YYYY-MM-DD), `person`, `miles`
   - Papa Parse handles robust CSV parsing
   - Row-level validation with clear error messages
   - Normalized headers (case-insensitive)

2. **Interactive Filters** ✓
   - **Date Range Picker** (react-datepicker): Select start and end dates
   - **Multi-Select Runner Filter** (react-select): Choose which runners to display
   - Real-time filtering applied to all metrics and charts
   - Default: All runners selected across full date range

3. **Data Aggregation** ✓
   - **Daily**: Chart shows miles per day per runner
   - **Weekly**: Groups data by ISO week (YYYY-Www format)
   - **Monthly**: Groups data by month (YYYY-MM format)
   - Toggle buttons instantly update chart visualization
   - Custom aggregation logic (no external date library needed)

4. **Summary Metrics** ✓
   - **Overall Statistics**: Average, minimum, and maximum run distances
   - **Per-Person Stats**: Individual averages, ranges, and run counts
   - All metrics dynamically update based on filters and aggregation

5. **Leaderboard** ✓
   - Runners ranked by total miles
   - **Top 3 Medals**: 🥇 1st, 🥈 2nd, 🥉 3rd place highlighting
   - Shows: Total miles, average per run, number of runs
   - Gradient text styling for visual appeal
   - **CSV Export**: Download leaderboard data as CSV file

6. **Time-Series Chart** ✓
   - Interactive Recharts line chart
   - One line per runner with distinct colors
   - X-axis: Date, Y-axis: Distance (miles)
   - Responsive container, touch-friendly on mobile
   - Hover tooltips show exact values
   - Connect null values for smoother visualization

7. **Auto Insights Banner** ✓
   - Automatically compares last 7 days vs previous 7 days
   - Shows which runner improved or regressed most
   - Displays percentage change (e.g., "20% more")
   - Shows absolute miles for context
   - Only displays if change ≥5% (filters out noise)
   - Appears above all metrics for visibility

8. **LocalStorage Persistence** ✓
   - All parsed runs automatically saved to browser localStorage
   - Data persists across page reloads and browser sessions
   - Storage key: `csv-runs-v1`
   - Runs serialized as ISO date strings and restored to Date objects
   - Survives browser restarts until manually cleared
   - **Clear Data Button**: One-click reset of all data

9. **Dark Mode Toggle** ✓
   - Light/Dark theme switching via next-themes
   - Toggle button in header (☀️ Light / 🌙 Dark)
   - Theme preference persists in localStorage
   - Complete CSS variable overrides for dark theme:
     - Background: Dark blue (#0b1220)
     - Surface: Deep navy (#0f1724)
     - Text: Light cream (#e6eef8)
     - Borders: Subtle white overlay (6% opacity)
   - Smooth transitions between themes
   - All components and charts respect theme

10. **Modern UI/UX** ✓
    - Glassmorphism effects with backdrop blur
    - Smooth animations and transitions
    - Gradient text for emphasis (stat values, leaderboard totals)
    - Responsive card layouts
    - Professional button styling with hover effects
    - Color-coded stat cards with top borders on hover
    - Responsive grid layouts that adapt to screen size

## 📁 File Structure

```
app/
  layout.tsx           Root layout with ThemeProvider, header, theme toggle
  page.tsx             Main dashboard: state, filters, localStorage logic
  globals.css          CSS variables, dark theme, animations, glassmorphism

components/
  CsvUploader.tsx      CSV parsing & validation (Papa Parse)
  Summary.tsx          Overall & per-person summary statistics
  ChartView.tsx        Time-series chart (Recharts) with daily/weekly/monthly aggregation
  Leaderboard.tsx      Ranked runners with medals (🥇🥈🥉) and CSV export
  InsightsBanner.tsx   Week-over-week comparison insights
  ThemeToggle.tsx      Light/dark mode toggle button
  Providers.tsx        Theme provider wrapper (client-side context)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ (app router)
- **Language**: TypeScript
- **UI Libraries**:
  - react-datepicker (date range picker)
  - react-select (multi-select dropdown)
  - Recharts (interactive charts)
  - next-themes (dark mode management)
- **CSV Parsing**: Papa Parse
- **Styling**: Modern CSS with variables, animations, glassmorphism
- **Storage**: Browser localStorage for data persistence

## ⚙️ Assumptions & Decisions

- **Client-Side Only**: All data stays in the browser. No server uploads or database required.
- **Parsing**: Papa Parse handles CSV robustly; supports various delimiters.
- **Data Structure**: `{ date: Date; person: string; miles: number }`
- **Validation**:
  - Dates: `YYYY-MM-DD` format required
  - Headers: Normalized (lowercased, trimmed) to `date`, `person`, `miles`
  - Miles: Must be parseable as a valid number
- **Aggregation**: Custom grouping logic for simplicity; no external date library
- **Insights**: Auto-calculated from 7-day rolling comparisons; threshold of 5% change
- **Storage**: localStorage (~5–10MB limit per origin); sufficient for typical use

## 🚀 Quick Start

### Prerequisites
- Node.js (>=18)

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd 'c:\Users\vedan\csv runner dashboard'
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   (The `--legacy-peer-deps` flag handles minor peer dependency conflicts)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   ```
   http://localhost:3000
   ```

## 📊 Sample CSV

Create or download a file named `sample.csv` with the following contents to test all features:

```csv
date,person,miles
2025-01-01,Alice,3.5
2025-01-02,Bob,4.2
2025-01-02,Alice,2.8
2025-01-03,Alice,5.0
2025-01-03,Bob,3.1
2025-01-04,Carol,2.5
2025-01-05,Bob,4.8
2025-01-06,Alice,3.2
2025-01-07,Carol,3.7
2025-01-08,Alice,4.1
2025-01-09,Bob,3.5
2025-01-10,Carol,2.9
```

## 📖 How to Use the Dashboard

1. **Upload CSV**
   - Click the upload zone and select your CSV file
   - File is parsed and validated automatically
   - Error messages appear if validation fails

2. **Filter by Date Range**
   - Use the two date pickers in the "Filters & Controls" card
   - Click "Start" and "End" to select dates
   - Summary and chart update instantly

3. **Filter by Runner(s)**
   - Click the multi-select dropdown labeled "Runners"
   - Select/deselect individual runners
   - Default: all runners are selected
   - Multiple selections work together with date filter

4. **Change Chart Aggregation**
   - Click **Daily**, **Weekly**, or **Monthly** buttons
   - Chart data groups accordingly
   - Useful for spotting trends over time
   - Leaderboard and summary ignore aggregation (always show raw data)

5. **View Summary Metrics**
   - Left card shows: Average, Min, Max for filtered data
   - Below: Per-person breakdown (count, average, range)
   - Real-time updates as you filter

6. **View Leaderboard**
   - Right card shows runners ranked by total miles
   - Top 3 highlighted with 🥇🥈🥉 medals
   - Each runner's average and run count displayed
   - Total miles shown with gradient styling

7. **Check Weekly Insights**
   - Above summary/leaderboard: Auto-generated comparison
   - Shows: Runner with biggest change week-over-week
   - Example: "Alice ran 20% more this week (25.3 mi) vs last week (21.0 mi)"
   - Only appears if change ≥5%

8. **Export Leaderboard**
   - Click **"Export CSV"** button on the leaderboard card
   - Downloads as `leaderboard.csv`
   - Contains: person, total miles, average miles, run count

9. **Switch Theme**
   - Click **☀️ Light** or **🌙 Dark** button in header
   - Theme persists across sessions
   - All UI elements adapt to theme

10. **Reset Everything**
    - Click **"Clear Data"** button (bottom right of controls)
    - Clears all runs, resets filters, removes localStorage data
    - You can upload a new CSV afterward

## 💾 Data Persistence

- All uploaded CSV data is automatically saved to browser localStorage
- Key: `csv-runs-v1`
- Persists across:
  - Page reloads
  - Browser restarts
  - Multiple sessions (until manually cleared)
- Data is cleared when:
  - "Clear Data" button is clicked
  - Browser storage is manually cleared (Settings → Clear Data)
  - `localStorage.removeItem('csv-runs-v1')` is called

## 📈 Performance Notes

- **Large Datasets**: For 1000+ runs, date range filtering significantly improves rendering
- **Aggregation**: Weekly/monthly aggregation reduces chart complexity and improves speed
- **localStorage**: Typical limit is 5–10MB per origin; should handle 10,000+ runs comfortably
- **Memoization**: Components use React.useMemo to prevent unnecessary re-renders

## 🌐 Browser Compatibility

- ✅ Chrome/Chromium (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)
- ❌ Internet Explorer (not supported; uses CSS variables, modern ES6+)

## 🔧 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 🚧 Known Limitations

1. **Client-Side Only**: No backend or database; data not shared between devices
2. **localStorage Limit**: ~5–10MB per origin (browser-dependent)
3. **Date Format**: Fixed to `YYYY-MM-DD` (configurable in CsvUploader.tsx if needed)
4. **No Editing**: After upload, runs can only be reset; individual edits not supported
5. **Browser Data Wipe**: Clearing browser storage removes all saved runs

## 💡 Future Enhancement Ideas

- ✨ CSV preview with row-level validation before upload
- ✨ Comparison mode: side-by-side date range analysis
- ✨ Custom aggregation periods (e.g., every 3 days)
- ✨ Workout categories/intensity levels
- ✨ Goal tracking and achievements
- ✨ Mobile-optimized responsive design
- ✨ Export full filtered dataset as CSV
- ✨ Backend API for multi-device sync
- ✨ Real-time collaboration mode
- ✨ Performance metrics and streak tracking

## 📝 License

Open source. Feel free to use, modify, and distribute.

---

**Built with ❤️ using Next.js, React, TypeScript, and modern web standards.**

For questions or issues, please refer to the code comments or check individual component files.


