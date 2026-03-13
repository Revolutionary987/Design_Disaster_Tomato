import './globals.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

export const metadata = {
  title: 'Dark Commerce — AI-Powered Quick Delivery',
  description: 'Market-ready quick commerce with 10-minute delivery, AI Shopping Agent, and live tracking.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
