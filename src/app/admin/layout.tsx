// src/app/admin/layout.tsx
"use client"

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <main 
        className={`flex-1 p-4 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  )
}