import './globals.css'
import 'react-datepicker/dist/react-datepicker.css'
import { ReactNode } from 'react'
import Providers from '../components/Providers'
import ThemeToggle from '../components/ThemeToggle'

export const metadata = {
  title: 'CSV Runner Dashboard',
  description: 'Upload CSVs and view running summaries and charts'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>
            <div className="container">
              <header className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1>CSV Runner Dashboard</h1>
                  <p className="text-secondary">Upload a CSV file to visualize running data with interactive charts and metrics</p>
                </div>
                <div>
                  <ThemeToggle />
                </div>
              </header>
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
