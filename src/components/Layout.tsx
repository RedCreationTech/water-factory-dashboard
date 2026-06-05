import type { ReactNode } from 'react'
import Header from './Header'
import NavBar from './NavBar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-full h-full bg-bg-primary">
      <Header />
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
      <NavBar />
    </div>
  )
}
